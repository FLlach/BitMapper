#include "display_manager.h"

DisplayManager displayManager;

DisplayManager::DisplayManager()
    : tft(TFT_eSPI()), currentDuty(TFT_BACKLIGHT_DEFAULT_DUTY), isDmaActive(false),
      toastActive(false), toastExpiresAt(0) {}

void DisplayManager::init(const DeviceSettings &settings) {
  currentDuty = settings.brightnessDuty;

  // 1. Asegurar ambos Chip Selects en HIGH antes de iniciar
  pinMode(TFT_CS_PIN, OUTPUT);
  digitalWrite(TFT_CS_PIN, HIGH);

  pinMode(SD_CS_PIN, OUTPUT);
  digitalWrite(SD_CS_PIN, HIGH);

  // 2. Pulso de Reset físico para el controlador ST7735S
  pinMode(TFT_RST_PIN, OUTPUT);
  digitalWrite(TFT_RST_PIN, HIGH);
  delay(10);
  digitalWrite(TFT_RST_PIN, LOW);
  delay(30);
  digitalWrite(TFT_RST_PIN, HIGH);
  delay(120);

  // 3. Inicializar pantalla ST7735S
  tft.init();
  tft.setRotation(0); // 0 = Vertical 128x160
  tft.setSwapBytes(settings.swapBytes);
  tft.invertDisplay(settings.invertDisplay);
  tft.fillScreen(TFT_BLACK); // Limpiar memoria gráfica (GRAM) antes de encender backlight

  // 4. Configurar retroiluminación PWM (LEDC)
  ledcSetup(TFT_BACKLIGHT_CHANNEL, TFT_BACKLIGHT_FREQ, TFT_BACKLIGHT_RES);
  ledcAttachPin(TFT_BLK_PIN, TFT_BACKLIGHT_CHANNEL);
  ledcWrite(TFT_BACKLIGHT_CHANNEL, currentDuty);

  // 5. Renderizado por bloques optimizado (DMA no soportado en C3)
  isDmaActive = false;
  Serial.println("[Display] Pantalla ST7735S iniciada (128x160). Modo chunks activo.");
}

void DisplayManager::setBrightness(uint8_t duty) {
  currentDuty = duty;
  ledcWrite(TFT_BACKLIGHT_CHANNEL, currentDuty);
}

uint8_t DisplayManager::getBrightness() const {
  return currentDuty;
}

void DisplayManager::fadeBacklight(uint8_t fromDuty, uint8_t toDuty, int stepDelayMs) {
  const int steps = 6;
  for (int i = 1; i <= steps; i++) {
    int val = fromDuty + ((toDuty - fromDuty) * i) / steps;
    if (val < 0) val = 0;
    if (val > 255) val = 255;
    ledcWrite(TFT_BACKLIGHT_CHANNEL, val);
    delay(stepDelayMs);
  }
}

void DisplayManager::setSwapBytes(bool swap) {
  tft.setSwapBytes(swap);
}

void DisplayManager::setInvertDisplay(bool invert) {
  tft.invertDisplay(invert);
}

void DisplayManager::clearScreen(uint16_t color) {
  tft.fillScreen(color);
}

void DisplayManager::showCalibrationPattern() {
  tft.fillScreen(TFT_BLACK);
  tft.setTextColor(TFT_CYAN, TFT_BLACK);
  tft.setTextSize(2);
  tft.drawString("BitMapper", 10, 30);
  tft.setTextSize(1);
  tft.setTextColor(TFT_WHITE, TFT_BLACK);
  tft.drawString("ST7735S 128x160", 10, 56);
  tft.setTextColor(TFT_GREEN, TFT_BLACK);
  tft.drawString("Iniciando SD...", 10, 80);
}

void DisplayManager::showToast(const char *line1, const char *line2, uint32_t durationMs) {
  toastActive = true;
  toastExpiresAt = millis() + durationMs;

  tft.fillRect(8, 50, 112, 44, TFT_NAVY);
  tft.drawRect(8, 50, 112, 44, TFT_CYAN);

  tft.setTextColor(TFT_WHITE, TFT_NAVY);
  tft.setTextSize(1);

  if (line1 && line2) {
    tft.drawString(line1, 14, 58);
    tft.setTextColor(TFT_YELLOW, TFT_NAVY);
    tft.drawString(line2, 14, 74);
  } else if (line1) {
    tft.drawString(line1, 14, 66);
  }
}

void DisplayManager::showProgress(size_t received, size_t total) {
  if (total == 0) return;
  int percent = (received * 100) / total;
  if (percent > 100) percent = 100;

  int barW = 108;
  int barH = 12;
  int barX = 10;
  int barY = 68;

  tft.drawRect(barX - 2, barY - 2, barW + 4, barH + 4, TFT_DARKCYAN);
  int fillW = (barW * percent) / 100;
  tft.fillRect(barX, barY, fillW, barH, TFT_GREEN);
  tft.fillRect(barX + fillW, barY, barW - fillW, barH, TFT_NAVY);

  char buf[32];
  snprintf(buf, sizeof(buf), "%d%% (%u KB)", percent, (unsigned int)(received / 1024));
  tft.setTextColor(TFT_YELLOW, TFT_BLACK);
  tft.setTextSize(1);
  tft.drawString(buf, barX, barY + 18);
}

void DisplayManager::showNoSDMessage() {
  tft.fillScreen(TFT_BLACK);
  tft.setTextColor(TFT_RED, TFT_BLACK);
  tft.setTextSize(1);
  tft.drawString("SIN TARJETA SD", 10, 15);

  tft.setTextColor(TFT_YELLOW, TFT_BLACK);
  tft.drawString("Revisa conexiones:", 10, 32);
  tft.setTextColor(TFT_WHITE, TFT_BLACK);
  tft.drawString("1. VCC a 5V (no 3V3)", 10, 48);
  tft.drawString("2. Formato FAT32 MBR", 10, 64);
  tft.drawString("3. MISO->G5 MOSI->G6", 10, 80);
  tft.drawString("4. CS->G3  SCK->G4", 10, 96);

  tft.setTextColor(TFT_CYAN, TFT_BLACK);
  tft.drawString("BLE activo...", 10, 120);
  tft.setTextColor(TFT_GREEN, TFT_BLACK);
  tft.drawString("BitMapper-ESP32", 10, 138);
}

void DisplayManager::showEmptySDMessage() {
  tft.fillScreen(TFT_BLACK);
  tft.setTextColor(TFT_CYAN, TFT_BLACK);
  tft.setTextSize(1);
  tft.drawString("Esperando fotos", 10, 25);
  tft.setTextColor(TFT_WHITE, TFT_BLACK);
  tft.drawString("SD montada y lista", 10, 48);
  tft.drawString("Conecta BitMapper app", 10, 68);
  tft.drawString("para enviar fotos:", 10, 84);
  tft.setTextColor(TFT_GREEN, TFT_BLACK);
  tft.drawString("BitMapper-ESP32", 10, 105);
}

void DisplayManager::showIncompatibleMessage(const String &path, size_t fileSize) {
  tft.fillScreen(TFT_BLACK);
  tft.setTextColor(TFT_RED, TFT_BLACK);
  tft.setTextSize(1);
  tft.drawString("ARCHIVO INCOMPATIBLE", 10, 20);

  tft.setTextColor(TFT_WHITE, TFT_BLACK);
  tft.drawString(path.c_str() + (path.startsWith("/") ? 1 : 0), 10, 40);

  char buf[32];
  snprintf(buf, sizeof(buf), "Tamano: %u B", (unsigned int)fileSize);
  tft.setTextColor(TFT_YELLOW, TFT_BLACK);
  tft.drawString(buf, 10, 60);

  tft.setTextColor(TFT_LIGHTGREY, TFT_BLACK);
  tft.drawString("Exporta con cabecera", 10, 85);
  tft.drawString("BMPR o preset 128x160", 10, 100);
  tft.drawString("desde BitMapper Studio", 10, 115);
  tft.setTextColor(TFT_CYAN, TFT_BLACK);
  tft.drawString("por Bluetooth BLE", 10, 130);
}

// -----------------------------------------------------------------------------
// Renderizado BMPR con Cabecera de 16 Bytes
// Soporta centrado dinámico, recorte y cualquier resolución arbitraria
// -----------------------------------------------------------------------------
void DisplayManager::renderBmprFrame(File &file, const BmprHeader &header, int frameIndex) {
  if (!file) return;

  uint32_t frameSizeBytes = (uint32_t)header.width * header.height * 2;
  uint32_t frameOffset = 16 + ((uint32_t)frameIndex * frameSizeBytes);

  if (header.width == IMAGE_WIDTH && header.height == IMAGE_HEIGHT) {
    // Formato Nativo 128x160: Lectura rápida en bloques de 16 líneas
    if (frameIndex == 0 || file.position() != frameOffset) {
      digitalWrite(TFT_CS_PIN, HIGH);
      file.seek(frameOffset);
    }

    const size_t CHUNK_BYTES = IMAGE_WIDTH * CHUNK_LINES * 2;
    for (int row = 0; row < IMAGE_HEIGHT; row += CHUNK_LINES) {
      digitalWrite(TFT_CS_PIN, HIGH);
      size_t bytesRead = file.read((uint8_t *)chunkBufferA, CHUNK_BYTES);
      digitalWrite(SD_CS_PIN, HIGH);

      if (bytesRead > 0) {
        int linesToPush = bytesRead / (IMAGE_WIDTH * 2);
        tft.pushImage(0, row, IMAGE_WIDTH, linesToPush, chunkBufferA);
      } else {
        break;
      }
    }
    digitalWrite(TFT_CS_PIN, HIGH);
  } else if (header.width <= IMAGE_WIDTH && header.height <= IMAGE_HEIGHT) {
    // Imagen más pequeña que la pantalla: Centrado automático con márgenes negros
    int offsetX = (IMAGE_WIDTH - (int)header.width) / 2;
    int offsetY = (IMAGE_HEIGHT - (int)header.height) / 2;

    if (frameIndex == 0) {
      tft.fillScreen(TFT_BLACK);
    }

    digitalWrite(TFT_CS_PIN, HIGH);
    file.seek(frameOffset);

    for (int row = 0; row < (int)header.height; row++) {
      digitalWrite(TFT_CS_PIN, HIGH);
      size_t bytesRead = file.read((uint8_t *)lineBuffer, header.width * 2);
      digitalWrite(SD_CS_PIN, HIGH);

      if (bytesRead == header.width * 2) {
        tft.pushImage(offsetX, offsetY + row, header.width, 1, lineBuffer);
      } else {
        break;
      }
    }
    digitalWrite(TFT_CS_PIN, HIGH);
  } else {
    // Imagen más grande que la pantalla: Recorte centrado
    int cropX = ((int)header.width - IMAGE_WIDTH) / 2;
    int cropY = ((int)header.height - IMAGE_HEIGHT) / 2;

    for (int row = 0; row < IMAGE_HEIGHT; row++) {
      uint32_t lineSeek = frameOffset + (((cropY + row) * header.width + cropX) * 2);

      digitalWrite(TFT_CS_PIN, HIGH);
      file.seek(lineSeek);
      size_t bytesRead = file.read((uint8_t *)lineBuffer, IMAGE_WIDTH * 2);
      digitalWrite(SD_CS_PIN, HIGH);

      if (bytesRead == IMAGE_WIDTH * 2) {
        tft.pushImage(0, row, IMAGE_WIDTH, 1, lineBuffer);
      } else {
        break;
      }
    }
    digitalWrite(TFT_CS_PIN, HIGH);
  }
}

// -----------------------------------------------------------------------------
// Renderizado Legacy Raw (128x160, 240x240, 240x320)
// -----------------------------------------------------------------------------
void DisplayManager::renderLegacyRawFrame(File &file, int frameIndex, int origW, int origH) {
  if (!file) return;

  if (origW == IMAGE_WIDTH && origH == IMAGE_HEIGHT) {
    const uint32_t FRAME_SIZE = 40960;
    uint32_t expectedOffset = (uint32_t)frameIndex * FRAME_SIZE;

    if (frameIndex == 0 || file.position() != expectedOffset) {
      digitalWrite(TFT_CS_PIN, HIGH);
      file.seek(expectedOffset);
    }

    const size_t CHUNK_BYTES = IMAGE_WIDTH * CHUNK_LINES * 2;
    for (int row = 0; row < IMAGE_HEIGHT; row += CHUNK_LINES) {
      digitalWrite(TFT_CS_PIN, HIGH);
      size_t bytesRead = file.read((uint8_t *)chunkBufferA, CHUNK_BYTES);
      digitalWrite(SD_CS_PIN, HIGH);

      if (bytesRead > 0) {
        int linesToPush = bytesRead / (IMAGE_WIDTH * 2);
        tft.pushImage(0, row, IMAGE_WIDTH, linesToPush, chunkBufferA);
      } else {
        break;
      }
    }
    digitalWrite(TFT_CS_PIN, HIGH);
  } else {
    // Formato Recortado (240x240 o 240x320)
    uint32_t frameSizeBytes = (uint32_t)origW * origH * 2;
    uint32_t frameBaseOffset = (uint32_t)frameIndex * frameSizeBytes;
    const int startX = (origW - IMAGE_WIDTH) / 2;
    const int startY = (origH - IMAGE_HEIGHT) / 2;

    for (int row = 0; row < IMAGE_HEIGHT; row++) {
      uint32_t fileOffset = frameBaseOffset + ((startY + row) * origW + startX) * 2;

      digitalWrite(TFT_CS_PIN, HIGH);
      file.seek(fileOffset);
      size_t bytesRead = file.read((uint8_t *)lineBuffer, IMAGE_WIDTH * 2);
      digitalWrite(SD_CS_PIN, HIGH);

      if (bytesRead == IMAGE_WIDTH * 2) {
        tft.pushImage(0, row, IMAGE_WIDTH, 1, lineBuffer);
      } else {
        break;
      }
    }
    digitalWrite(TFT_CS_PIN, HIGH);
  }
}

// -----------------------------------------------------------------------------
// Transición Cinemática entre Imágenes (Punto 3)
// -----------------------------------------------------------------------------
void DisplayManager::performTransition(TransitionMode mode, std::function<void()> drawCallback) {
  if (mode == TRANSITION_FADE) {
    // Desvanecimiento suave PWM
    fadeBacklight(currentDuty, 0, 10);
    drawCallback();
    fadeBacklight(0, currentDuty, 10);
  } else if (mode == TRANSITION_WIPE_DOWN) {
    // Cortina vertical: Se dibuja directamente
    drawCallback();
  } else {
    // Corte directo instantáneo
    drawCallback();
  }
}
