/*
 * =============================================================================
 * BitMapper Studio - Firmware Modular ESP32-C3 SuperMini + ST7735S + MicroSD + BLE
 * =============================================================================
 */

#include <Arduino.h>
#include "config.h"
#include "preferences_manager.h"
#include "display_manager.h"
#include "sd_manager.h"
#include "ble_service.h"
#include "touch_handler.h"

// -----------------------------------------------------------------------------
// Estado Global de Reproducción
// -----------------------------------------------------------------------------
static DeviceSettings currentSettings;
static int currentPhotoIndex = 0;

static File currentVideoFile;
static bool isCurrentFileVideo = false;
static int videoTotalFrames = 1;
static int videoCurrentFrame = 0;
static int videoCurrentFps = 15;
static unsigned long videoFrameIntervalMs = 66;
static unsigned long lastFrameRenderTime = 0;
static unsigned long lastSlideshowTime = 0;
static int videoLoopCount = 0;
static bool isVideoPaused = false;

static bool currentIsBmpr = false;
static BmprHeader currentBmprHeader;
static int currentOrigW = IMAGE_WIDTH;
static int currentOrigH = IMAGE_HEIGHT;

const int FPS_PRESETS[] = {5, 10, 15, 20, 24, 30};
const int NUM_FPS_PRESETS = sizeof(FPS_PRESETS) / sizeof(FPS_PRESETS[0]);

// Estado y funciones del Modo Reposo (Atenuación)
static bool isSleeping = false;
static unsigned long lastUserActivityTime = 0;

void enterSleepMode();
void wakeUpFromSleep();

// Declaraciones de funciones
void displayPhoto(int index, TransitionMode transition = TRANSITION_NONE);
void cycleVideoFps();

void enterSleepMode() {
  if (isSleeping) return;
  isSleeping = true;
  touchHandler.setSleeping(true);
  Serial.printf("[Power] Entrando en Modo Reposo (Atenuando brillo a %u)\n", currentSettings.sleepBrightnessDuty);
  displayManager.fadeBacklight(currentSettings.brightnessDuty, currentSettings.sleepBrightnessDuty, 10);
  displayManager.setBrightness(currentSettings.sleepBrightnessDuty);
}

void wakeUpFromSleep() {
  lastUserActivityTime = millis();
  if (!isSleeping) return;
  isSleeping = false;
  touchHandler.setSleeping(false);
  Serial.printf("[Power] Saliendo de Modo Reposo. Restaurando brillo activo: %u\n", currentSettings.brightnessDuty);
  displayManager.fadeBacklight(currentSettings.sleepBrightnessDuty, currentSettings.brightnessDuty, 8);
  displayManager.setBrightness(currentSettings.brightnessDuty);
}

// -----------------------------------------------------------------------------
// Mostrar Foto / Video desde MicroSD
// -----------------------------------------------------------------------------
void displayPhoto(int index, TransitionMode transition) {
  if (sdManager.getPhotoCount() == 0) {
    displayManager.showEmptySDMessage();
    return;
  }

  if (index < 0) index = sdManager.getPhotoCount() - 1;
  if (index >= (int)sdManager.getPhotoCount()) index = 0;
  currentPhotoIndex = index;

  if (currentVideoFile) {
    currentVideoFile.close();
  }
  isCurrentFileVideo = false;
  isVideoPaused = false;
  videoLoopCount = 0;

  String path = sdManager.getPhotoPath(currentPhotoIndex);
  Serial.printf("\n[Main] Cargando [%d/%u]: %s\n", currentPhotoIndex + 1,
                (unsigned int)sdManager.getPhotoCount(), path.c_str());

  size_t fileSize = 0;
  bool valid = sdManager.inspectPhoto(path, currentBmprHeader, currentIsBmpr,
                                      currentOrigW, currentOrigH, videoTotalFrames,
                                      videoCurrentFps, fileSize);

  if (!valid) {
    displayManager.showIncompatibleMessage(path, fileSize);
    return;
  }

  isCurrentFileVideo = (videoTotalFrames > 1);
  videoFrameIntervalMs = 1000 / max(1, videoCurrentFps);
  videoCurrentFrame = 0;
  lastFrameRenderTime = millis();
  lastSlideshowTime = millis();

  currentVideoFile = SD.open(path, FILE_READ);
  if (!currentVideoFile) {
    Serial.printf("❌ Error al abrir archivo: %s\n", path.c_str());
    return;
  }

  prefManager.saveLastFile(path);

  // Renderizar el primer fotograma con la transición seleccionada
  displayManager.performTransition(transition, [&]() {
    if (currentIsBmpr) {
      displayManager.renderBmprFrame(currentVideoFile, currentBmprHeader, 0);
    } else {
      displayManager.renderLegacyRawFrame(currentVideoFile, 0, currentOrigW, currentOrigH);
    }
  });

  if (!isCurrentFileVideo) {
    currentVideoFile.close();
  } else {
    Serial.printf("🎬 Video activo: %d cuadros a %d FPS (intervalo %lu ms)\n",
                  videoTotalFrames, videoCurrentFps, videoFrameIntervalMs);
  }
}

// -----------------------------------------------------------------------------
// Alternar Presets de FPS
// -----------------------------------------------------------------------------
void cycleVideoFps() {
  int currentIdx = 2; // 15 FPS por defecto
  for (int i = 0; i < NUM_FPS_PRESETS; i++) {
    if (FPS_PRESETS[i] == videoCurrentFps) {
      currentIdx = i;
      break;
    }
  }
  int nextIdx = (currentIdx + 1) % NUM_FPS_PRESETS;
  videoCurrentFps = FPS_PRESETS[nextIdx];
  currentSettings.videoFps = videoCurrentFps;
  videoFrameIntervalMs = 1000 / videoCurrentFps;

  Serial.printf("[FPS] Velocidad cambiada a %d FPS (%lu ms)\n",
                videoCurrentFps, videoFrameIntervalMs);

  char buf[24];
  snprintf(buf, sizeof(buf), "%d FPS", videoCurrentFps);
  displayManager.showToast("VELOCIDAD FPS", buf);
  prefManager.saveVideoFps(videoCurrentFps);
}

// -----------------------------------------------------------------------------
// Setup Principal
// -----------------------------------------------------------------------------
void setup() {
  // Ahorro de energía en CPU (80 MHz)
  setCpuFrequencyMhz(80);

  Serial.begin(115200);
  delay(300);

  Serial.println("\n========================================================");
  Serial.println("  BitMapper Studio v2.0 - ST7735S (128x160) + SD + BLE  ");
  Serial.printf("  CPU: %d MHz | PWM Backlight: %u\n",
                getCpuFrequencyMhz(), currentSettings.brightnessDuty);
  Serial.println("========================================================");

  // 1. Cargar preferencias desde NVS
  prefManager.load(currentSettings);
  videoCurrentFps = currentSettings.videoFps;
  videoFrameIntervalMs = 1000 / max(1, videoCurrentFps);

  // 2. Inicializar Pantalla ST7735S
  displayManager.init(currentSettings);
  displayManager.showCalibrationPattern();

  // 3. Inicializar Sensor Táctil y LED
  touchHandler.init();

  // 4. Inicializar Tarjeta MicroSD
  bool sdMounted = sdManager.init();

  // 5. Inicializar Bluetooth LE
  bleService.init(currentSettings);

  // 6. Configurar Callbacks de Eventos Táctiles
  touchHandler.onNext = [&]() {
    Serial.println("[Touch] 1 TOQUE -> Siguiente imagen");
    displayManager.clearToast();
    lastSlideshowTime = millis();
    displayPhoto(currentPhotoIndex + 1, currentSettings.transitionMode);
  };

  touchHandler.onPrev = [&]() {
    Serial.println("[Touch] 2 TOQUES -> Imagen anterior");
    displayManager.clearToast();
    lastSlideshowTime = millis();
    displayPhoto(currentPhotoIndex - 1, currentSettings.transitionMode);
  };

  touchHandler.onToggleByteSwap = [&]() {
    currentSettings.swapBytes = !currentSettings.swapBytes;
    displayManager.setSwapBytes(currentSettings.swapBytes);
    prefManager.saveSwapBytes(currentSettings.swapBytes);
    displayPhoto(currentPhotoIndex, TRANSITION_NONE);
    displayManager.showToast("BYTESWAP",
                             currentSettings.swapBytes ? "Estado: ACTIVADO" : "Estado: DESACTIVADO");
  };

  touchHandler.onToggleInvert = [&]() {
    currentSettings.invertDisplay = !currentSettings.invertDisplay;
    displayManager.setInvertDisplay(currentSettings.invertDisplay);
    prefManager.saveInvertDisplay(currentSettings.invertDisplay);
    displayPhoto(currentPhotoIndex, TRANSITION_NONE);
    displayManager.showToast("INVERSION",
                             currentSettings.invertDisplay ? "Estado: ACTIVADA" : "Estado: NORMAL");
  };

  touchHandler.onCycleFps = [&]() {
    cycleVideoFps();
  };

  touchHandler.onToggleBle = [&]() {
    bleService.toggleBLE();
  };

  touchHandler.onWake = [&]() {
    wakeUpFromSleep();
  };

  touchHandler.onActivity = [&]() {
    lastUserActivityTime = millis();
  };

  // 7. Configurar Callbacks de BLE
  bleService.onFileUploaded = [&](const String &path) {
    wakeUpFromSleep();
    sdManager.scanPhotos();
    int idx = sdManager.findPhotoIndex(path);
    delay(200);
    displayPhoto(idx >= 0 ? idx : 0, currentSettings.transitionMode);
  };

  bleService.onShowFile = [&](const String &path) {
    wakeUpFromSleep();
    sdManager.scanPhotos();
    int idx = sdManager.findPhotoIndex(path);
    if (idx >= 0) {
      displayPhoto(idx, currentSettings.transitionMode);
    }
  };

  bleService.onBeforeDelete = [&](const String &path) {
    wakeUpFromSleep();
    if (currentVideoFile) {
      currentVideoFile.close();
    }
    isCurrentFileVideo = false;
  };

  bleService.onFileDeleted = [&](const String &path) {
    wakeUpFromSleep();
    sdManager.scanPhotos();
    if (sdManager.getPhotoCount() > 0) {
      if (currentPhotoIndex >= (int)sdManager.getPhotoCount()) {
        currentPhotoIndex = 0;
      }
      displayPhoto(currentPhotoIndex, currentSettings.transitionMode);
    } else {
      displayManager.showEmptySDMessage();
    }
  };

  bleService.onNextPhoto = [&]() {
    wakeUpFromSleep();
    lastSlideshowTime = millis();
    displayPhoto(currentPhotoIndex + 1, currentSettings.transitionMode);
  };

  bleService.onPrevPhoto = [&]() {
    wakeUpFromSleep();
    lastSlideshowTime = millis();
    displayPhoto(currentPhotoIndex - 1, currentSettings.transitionMode);
  };

  bleService.onPausePlayback = [&](bool pause) {
    wakeUpFromSleep();
    isVideoPaused = pause;
    displayManager.showToast("REPRODUCCION", isVideoPaused ? "Pausado ⏸" : "Reanudado ▶");
  };

  bleService.onToggleByteSwap = [&]() {
    wakeUpFromSleep();
    currentSettings.swapBytes = !currentSettings.swapBytes;
    displayManager.setSwapBytes(currentSettings.swapBytes);
    prefManager.saveSwapBytes(currentSettings.swapBytes);
    displayPhoto(currentPhotoIndex, TRANSITION_NONE);
    displayManager.showToast("BYTESWAP",
                             currentSettings.swapBytes ? "Estado: ACTIVADO" : "Estado: DESACTIVADO");
  };

  bleService.onToggleInvert = [&]() {
    wakeUpFromSleep();
    currentSettings.invertDisplay = !currentSettings.invertDisplay;
    displayManager.setInvertDisplay(currentSettings.invertDisplay);
    prefManager.saveInvertDisplay(currentSettings.invertDisplay);
    displayPhoto(currentPhotoIndex, TRANSITION_NONE);
    displayManager.showToast("INVERSION",
                             currentSettings.invertDisplay ? "Estado: ACTIVADA" : "Estado: NORMAL");
  };

  bleService.onGetStatus = [&]() -> String {
    String curName = "";
    if (sdManager.getPhotoCount() > 0) {
      curName = sdManager.getPhotoPath(currentPhotoIndex);
      if (curName.startsWith("/")) curName = curName.substring(1);
    }
    char buf[128];
    snprintf(buf, sizeof(buf), "%d:%u:%d:%d:%d:%d:%u:%d:%s",
             currentPhotoIndex,
             (unsigned int)sdManager.getPhotoCount(),
             isCurrentFileVideo ? 1 : 0,
             isVideoPaused ? 1 : 0,
             currentSettings.swapBytes ? 1 : 0,
             currentSettings.invertDisplay ? 1 : 0,
             currentSettings.brightnessDuty,
             isSleeping ? 1 : 0,
             curName.c_str());
    return String(buf);
  };

  bleService.onFpsChanged = [&](int fps) {
    wakeUpFromSleep();
    videoCurrentFps = fps;
    currentSettings.videoFps = fps;
    videoFrameIntervalMs = 1000 / max(1, videoCurrentFps);
    prefManager.saveVideoFps(fps);
  };

  bleService.onSlideshowChanged = [&](bool enabled, int delaySec) {
    wakeUpFromSleep();
    currentSettings.slideshowEnabled = enabled;
    if (delaySec > 0) currentSettings.slideshowDelaySec = delaySec;
    lastSlideshowTime = millis();
    prefManager.saveSlideshow(enabled, currentSettings.slideshowDelaySec);
  };

  bleService.onTransitionChanged = [&](TransitionMode mode) {
    wakeUpFromSleep();
    currentSettings.transitionMode = mode;
    prefManager.saveTransitionMode(mode);
    displayManager.showToast("TRANSICION",
                             mode == TRANSITION_FADE ? "Modo: FADE PWM" :
                             mode == TRANSITION_WIPE_DOWN ? "Modo: CORTINA" : "Modo: DIRECTO");
  };

  bleService.onBrightnessChanged = [&](uint8_t duty) {
    wakeUpFromSleep();
    currentSettings.brightnessDuty = duty;
    displayManager.setBrightness(duty);
    prefManager.saveBrightness(duty);
  };

  bleService.onActivity = [&]() {
    wakeUpFromSleep();
  };

  bleService.onSleepConfigChanged = [&](bool enabled, int timeoutSec, uint8_t dimDuty) {
    currentSettings.sleepEnabled = enabled;
    currentSettings.sleepTimeoutSec = timeoutSec;
    currentSettings.sleepBrightnessDuty = dimDuty;
    prefManager.saveSleepConfig(enabled, timeoutSec, dimDuty);
    wakeUpFromSleep();
    displayManager.showToast("MODO REPOSO",
                             enabled ? "Ajustes guardados" : "Modo: DESACTIVADO");
  };

  bleService.onTriggerSleep = [&]() {
    enterSleepMode();
  };

  bleService.onTriggerWake = [&]() {
    wakeUpFromSleep();
  };

  // 8. Cargar archivo inicial o mostrar estado
  if (!sdMounted) {
    displayManager.showNoSDMessage();
  } else {
    sdManager.scanPhotos();
    if (sdManager.getPhotoCount() > 0) {
      currentPhotoIndex = 0;
      if (currentSettings.lastFile.length() > 0) {
        int lastIdx = sdManager.findPhotoIndex(currentSettings.lastFile);
        if (lastIdx >= 0) currentPhotoIndex = lastIdx;
      }
      delay(200);
      displayPhoto(currentPhotoIndex, TRANSITION_NONE);
    } else {
      displayManager.showEmptySDMessage();
    }
  }

  lastSlideshowTime = millis();
  lastUserActivityTime = millis();
}

// -----------------------------------------------------------------------------
// Bucle Principal
// -----------------------------------------------------------------------------
void loop() {
  // Manejo de eventos y temporizadores de Bluetooth LE
  bleService.loop();

  // Auto-expiración de Toasts en pantalla (borrado automático tras el tiempo de espera)
  if (displayManager.isToastActive() && displayManager.hasToastExpired()) {
    displayManager.clearToast();
    if (!isCurrentFileVideo) {
      if (sdManager.getPhotoCount() > 0) {
        displayPhoto(currentPhotoIndex, TRANSITION_NONE);
      } else if (!sdManager.isMounted()) {
        displayManager.showNoSDMessage();
      } else {
        displayManager.showEmptySDMessage();
      }
    }
  }

  // Verificación de inactividad para modo reposo (atenuación de brillo)
  if (currentSettings.sleepEnabled && !isSleeping && !bleService.isUploadInProgress()) {
    unsigned long timeoutMs = (unsigned long)currentSettings.sleepTimeoutSec * 1000;
    if (millis() - lastUserActivityTime >= timeoutMs) {
      enterSleepMode();
    }
  }

  // Si no hay una subida activa por BLE
  if (!bleService.isUploadInProgress()) {
    // 1. Reproducción de Video Cuadro a Cuadro (pausado temporalmente si hay un Toast activo, en Reposo o Pausa remota)
    if (isCurrentFileVideo && currentVideoFile && !displayManager.isToastActive() && !isSleeping && !isVideoPaused) {
      if (millis() - lastFrameRenderTime >= videoFrameIntervalMs) {
        lastFrameRenderTime = millis();
        videoCurrentFrame = (videoCurrentFrame + 1) % videoTotalFrames;
        if (videoCurrentFrame == 0) {
          videoLoopCount++;
        }

        if (currentIsBmpr) {
          displayManager.renderBmprFrame(currentVideoFile, currentBmprHeader, videoCurrentFrame);
        } else {
          displayManager.renderLegacyRawFrame(currentVideoFile, videoCurrentFrame, currentOrigW, currentOrigH);
        }
      }
    }

    // 2. Modo Diapositivas Automático (Punto 2) (pausado durante Reposo o Pausa remota)
    if (currentSettings.slideshowEnabled && sdManager.getPhotoCount() > 1 && !isSleeping && !isVideoPaused) {
      unsigned long intervalMs = (unsigned long)currentSettings.slideshowDelaySec * 1000;
      bool shouldAdvance = false;

      if (!isCurrentFileVideo) {
        if (millis() - lastSlideshowTime >= intervalMs) {
          shouldAdvance = true;
        }
      } else {
        // En video, esperar al menos 2 reproducciones completas antes de avanzar
        if (videoLoopCount >= 2 && (millis() - lastSlideshowTime >= intervalMs)) {
          shouldAdvance = true;
        }
      }

      if (shouldAdvance) {
        lastSlideshowTime = millis();
        Serial.printf("[Slideshow] Avanzando diapositiva automáticamente (%d s transcurridos)...\n",
                      currentSettings.slideshowDelaySec);
        displayPhoto(currentPhotoIndex + 1, currentSettings.transitionMode);
      }
    }

    // 3. Procesamiento de Gestos Táctiles
    touchHandler.loop();
  }

  delay(2);
}
