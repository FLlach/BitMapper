#include "ble_service.h"
#include "display_manager.h"
#include "preferences_manager.h"
#include "sd_manager.h"

BLEServiceManager bleService;

class BleServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer *pServer) override {
    Serial.println(">> [BLE]: Cliente conectado.");
    digitalWrite(ONBOARD_LED, LOW);
  }

  void onDisconnect(BLEServer *pServer) override {
    Serial.println("<< [BLE]: Cliente desconectado.");
    digitalWrite(ONBOARD_LED, HIGH);
  }
};

class BleControlCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) override {
    String value = pCharacteristic->getValue().c_str();
    if (value.length() > 0) {
      bleService.handleControlCommand(value);
    }
  }
};

class BleDataCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) override {
    size_t len = pCharacteristic->getLength();
    uint8_t *pData = pCharacteristic->getData();
    if (len > 0 && pData != nullptr) {
      bleService.handleDataChunk(pData, len);
    }
  }
};

BLEServiceManager::BLEServiceManager()
    : pServer(nullptr), pControlChar(nullptr), pDataChar(nullptr),
      deviceConnected(false), oldDeviceConnected(false), isBleActive(true),
      lastBleActivityTime(0), uploadTotalBytes(0), uploadReceivedBytes(0), isUploading(false) {}

void BLEServiceManager::init(const DeviceSettings &settings) {
  startBLE();
}

void BLEServiceManager::startBLE() {
  if (pServer != nullptr) {
    BLEDevice::deinit(true);
    delay(100);
  }

  BLEDevice::init("BitMapper-ESP32");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new BleServerCallbacks());

  BLEService *pCustomService = pServer->createService(SERVICE_UUID);

  pControlChar = pCustomService->createCharacteristic(
      CONTROL_CHAR_UUID,
      BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE |
          BLECharacteristic::PROPERTY_NOTIFY);
  pControlChar->addDescriptor(new BLE2902());
  pControlChar->setCallbacks(new BleControlCallbacks());

  pDataChar = pCustomService->createCharacteristic(
      DATA_CHAR_UUID,
      BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_WRITE_NR);
  pDataChar->setCallbacks(new BleDataCallbacks());

  pCustomService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();

  isBleActive = true;
  lastBleActivityTime = millis();
  Serial.println("✔ [BLE] Servidor 'BitMapper-ESP32' activo y visible.");
}

void BLEServiceManager::stopBLE() {
  if (!isBleActive) return;

  if (isUploading && currentUploadFile) {
    currentUploadFile.close();
    isUploading = false;
  }

  if (pServer) {
    BLEDevice::stopAdvertising();
    BLEDevice::deinit(true);
    pServer = nullptr;
    pControlChar = nullptr;
    pDataChar = nullptr;
  }

  isBleActive = false;
  deviceConnected = false;
  oldDeviceConnected = false;
  digitalWrite(ONBOARD_LED, HIGH);

  Serial.println("💤 [BLE] Bluetooth LE apagado por ahorro de energía.");
  displayManager.showToast("BLUETOOTH LE", "Estado: APAGADO");
}

void BLEServiceManager::toggleBLE() {
  if (isBleActive) {
    stopBLE();
  } else {
    startBLE();
    displayManager.showToast("BLUETOOTH LE", "Estado: ENCENDIDO");
  }
}

void BLEServiceManager::notifyControl(const String &msg) {
  if (pControlChar && deviceConnected) {
    pControlChar->setValue(msg.c_str());
    pControlChar->notify();
  }
}

void BLEServiceManager::loop() {
  if (!isBleActive || !pServer) return;

  // Reconexión y publicidad
  if (!deviceConnected && oldDeviceConnected) {
    delay(400);
    pServer->startAdvertising();
    Serial.println("[BLE] Reiniciando publicidad...");
    oldDeviceConnected = deviceConnected;
  }
  if (deviceConnected && !oldDeviceConnected) {
    oldDeviceConnected = deviceConnected;
  }

  // Auto-apagado de BLE tras 3 minutos sin conexión ni subida
  if (!deviceConnected && !isUploading) {
    if (millis() - lastBleActivityTime >= BLE_INACTIVITY_TIMEOUT_MS) {
      Serial.println("[BLE] Inactividad alcanzada (3 min). Auto-apagando BLE...");
      stopBLE();
    }
  }
}

// -----------------------------------------------------------------------------
// Procesamiento de Comandos de Control BLE
// -----------------------------------------------------------------------------
void BLEServiceManager::handleControlCommand(const String &value) {
  lastBleActivityTime = millis();
  if (onActivity) onActivity();
  Serial.printf("[BLE Control]: %s\n", value.c_str());

  if (value.startsWith("START:")) {
    // Formato: START:<nombre_archivo>:<tamano_bytes>
    int firstColon = value.indexOf(':');
    int secondColon = value.indexOf(':', firstColon + 1);

    if (secondColon != -1) {
      uploadFilename = value.substring(firstColon + 1, secondColon);
      uploadTotalBytes = value.substring(secondColon + 1).toInt();
    } else {
      uploadFilename = value.substring(firstColon + 1);
      uploadTotalBytes = 0;
    }

    if (!uploadFilename.startsWith("/")) {
      uploadFilename = "/" + uploadFilename;
    }

    Serial.printf("[BLE] Recibiendo '%s' (%u bytes)...\n",
                  uploadFilename.c_str(), (unsigned int)uploadTotalBytes);

    if (SD.exists(uploadFilename)) {
      SD.remove(uploadFilename);
    }

    currentUploadFile = SD.open(uploadFilename, FILE_WRITE);
    if (!currentUploadFile) {
      Serial.println("❌ [BLE] Error: No se pudo crear el archivo en MicroSD.");
      notifyControl("ERROR_SD");
      return;
    }

    uploadReceivedBytes = 0;
    isUploading = true;

    // Mostrar HUD de progreso
    displayManager.clearScreen(TFT_BLACK);
    TFT_eSPI &tft = displayManager.getTFT();
    tft.setTextColor(TFT_CYAN, TFT_BLACK);
    tft.setTextSize(1);
    tft.drawString("Recibiendo...", 10, 25);
    tft.setTextColor(TFT_WHITE, TFT_BLACK);
    tft.drawString(uploadFilename.c_str() + 1, 10, 42);

    displayManager.showProgress(0, uploadTotalBytes);
    notifyControl("READY");

  } else if (value == "DONE") {
    if (isUploading && currentUploadFile) {
      currentUploadFile.close();
      isUploading = false;
      Serial.printf("✔ [BLE] Archivo '%s' guardado (%u bytes).\n",
                    uploadFilename.c_str(), (unsigned int)uploadReceivedBytes);

      notifyControl("SUCCESS");
      sdManager.scanPhotos();

      if (onFileUploaded) {
        onFileUploaded(uploadFilename);
      }
    }
  } else if (value == "CANCEL") {
    if (isUploading && currentUploadFile) {
      currentUploadFile.close();
      SD.remove(uploadFilename);
      isUploading = false;
      notifyControl("CANCELLED");
    }
  } else if (value == "LIST") {
    sdManager.scanPhotos();
    const auto &photos = sdManager.getPhotoList();

    char startBuf[32];
    snprintf(startBuf, sizeof(startBuf), "FILE_LIST_START:%u", (unsigned int)photos.size());
    notifyControl(startBuf);
    delay(20);

    for (size_t i = 0; i < photos.size(); i++) {
      String path = photos[i];
      File f = SD.open(path, FILE_READ);
      size_t sz = f ? f.size() : 0;
      if (f) f.close();

      String displayName = path.startsWith("/") ? path.substring(1) : path;
      String itemMsg = "FILE_ITEM:" + displayName + ":" + String((unsigned long)sz);
      notifyControl(itemMsg);
      delay(25);
    }

    notifyControl("FILE_LIST_END");
  } else if (value.startsWith("DELETE:")) {
    String target = value.substring(7);
    target.trim();
    if (!target.startsWith("/")) target = "/" + target;

    if (onBeforeDelete) {
      onBeforeDelete(target);
    }

    bool removed = sdManager.deletePhoto(target);
    String displayName = target.startsWith("/") ? target.substring(1) : target;

    if (removed) {
      notifyControl("DELETE_OK:" + displayName);
      displayManager.showToast("ELIMINADO", displayName.c_str());
      if (onFileDeleted) {
        onFileDeleted(target);
      }
    } else {
      notifyControl("DELETE_FAIL:" + displayName);
    }
  } else if (value.startsWith("SHOW:")) {
    String target = value.substring(5);
    target.trim();
    if (!target.startsWith("/")) target = "/" + target;

    if (onShowFile) {
      onShowFile(target);
    }
    notifyControl("SHOW_OK");
  } else if (value == "NEXT") {
    if (onNextPhoto) onNextPhoto();
    notifyControl("NEXT_OK");
  } else if (value == "PREV") {
    if (onPrevPhoto) onPrevPhoto();
    notifyControl("PREV_OK");
  } else if (value.startsWith("FPS:")) {
    int newFps = value.substring(4).toInt();
    if (newFps >= 1 && newFps <= 60) {
      if (onFpsChanged) onFpsChanged(newFps);
      char buf[32];
      snprintf(buf, sizeof(buf), "FPS_OK:%d", newFps);
      notifyControl(buf);
    }
  } else if (value.startsWith("SLIDESHOW:")) {
    // Formato: SLIDESHOW:ON:5 o SLIDESHOW:OFF
    String param = value.substring(10);
    param.trim();
    if (param.startsWith("ON")) {
      int sec = 5;
      int colIdx = param.indexOf(':');
      if (colIdx != -1) {
        sec = param.substring(colIdx + 1).toInt();
        if (sec < 1 || sec > 3600) sec = 5;
      }
      if (onSlideshowChanged) onSlideshowChanged(true, sec);
      char buf[32];
      snprintf(buf, sizeof(buf), "SLIDESHOW_OK:%d", sec);
      notifyControl(buf);
      displayManager.showToast("DIAPOSITIVAS", "Modo: ACTIVADO");
    } else {
      if (onSlideshowChanged) onSlideshowChanged(false, 0);
      notifyControl("SLIDESHOW_OK:OFF");
      displayManager.showToast("DIAPOSITIVAS", "Modo: APAGADO");
    }
  } else if (value.startsWith("TRANSITION:")) {
    // Formato: TRANSITION:0 (NONE), 1 (FADE), 2 (WIPE_DOWN), 3 (WIPE_RIGHT)
    String modeStr = value.substring(11);
    modeStr.trim();
    TransitionMode mode = TRANSITION_FADE;

    if (modeStr == "0" || modeStr.equalsIgnoreCase("NONE")) mode = TRANSITION_NONE;
    else if (modeStr == "1" || modeStr.equalsIgnoreCase("FADE")) mode = TRANSITION_FADE;
    else if (modeStr == "2" || modeStr.equalsIgnoreCase("WIPE_DOWN")) mode = TRANSITION_WIPE_DOWN;
    else if (modeStr == "3" || modeStr.equalsIgnoreCase("WIPE_RIGHT")) mode = TRANSITION_WIPE_RIGHT;

    if (onTransitionChanged) onTransitionChanged(mode);
    char buf[32];
    snprintf(buf, sizeof(buf), "TRANSITION_OK:%d", (int)mode);
    notifyControl(buf);
  } else if (value.startsWith("BRIGHT:")) {
    int duty = value.substring(7).toInt();
    if (duty < 0) duty = 0;
    if (duty > 255) duty = 255;
    if (onBrightnessChanged) onBrightnessChanged((uint8_t)duty);
    char buf[32];
    snprintf(buf, sizeof(buf), "BRIGHT_OK:%d", duty);
    notifyControl(buf);
  } else if (value.startsWith("SLEEP_CFG:")) {
    // Formato: SLEEP_CFG:<0|1>:<timeoutSec>:<sleepDuty>
    int c1 = value.indexOf(':');
    int c2 = value.indexOf(':', c1 + 1);
    int c3 = value.indexOf(':', c2 + 1);
    bool enabled = true;
    int timeoutSec = 60;
    int dimDuty = 13;

    if (c2 != -1) {
      enabled = (value.substring(c1 + 1, c2).toInt() != 0);
      if (c3 != -1) {
        timeoutSec = value.substring(c2 + 1, c3).toInt();
        dimDuty = value.substring(c3 + 1).toInt();
      } else {
        timeoutSec = value.substring(c2 + 1).toInt();
      }
    } else {
      enabled = (value.substring(c1 + 1).toInt() != 0);
    }

    if (timeoutSec < 5) timeoutSec = 5;
    if (timeoutSec > 3600) timeoutSec = 3600;
    if (dimDuty < 0) dimDuty = 0;
    if (dimDuty > 255) dimDuty = 255;

    if (onSleepConfigChanged) onSleepConfigChanged(enabled, timeoutSec, (uint8_t)dimDuty);
    char buf[32];
    snprintf(buf, sizeof(buf), "SLEEP_CFG_OK:%d:%d:%d", enabled ? 1 : 0, timeoutSec, dimDuty);
    notifyControl(buf);
  } else if (value == "SLEEP_NOW") {
    if (onTriggerSleep) onTriggerSleep();
    notifyControl("SLEEP_STATE_OK:SLEEP");
  } else if (value == "WAKE_NOW") {
    if (onTriggerWake) onTriggerWake();
    notifyControl("SLEEP_STATE_OK:WAKE");
  } else if (value == "GET_CONFIG") {
    // Formato: CONFIG:<swapBytes>:<invert>:<fps>:<slideOn>:<slideSec>:<transMode>:<bright>
    // Se responderá desde main con los valores vigentes
    notifyControl("REQUEST_CONFIG");
  }
}

// -----------------------------------------------------------------------------
// Recepción de Fragmentos Binarios
// -----------------------------------------------------------------------------
void BLEServiceManager::handleDataChunk(uint8_t *pData, size_t len) {
  lastBleActivityTime = millis();
  if (onActivity) onActivity();
  if (!isUploading || !currentUploadFile) return;

  currentUploadFile.write(pData, len);
  uploadReceivedBytes += len;

  static size_t lastReport = 0;
  if (uploadReceivedBytes - lastReport > 4096 || uploadReceivedBytes >= uploadTotalBytes) {
    lastReport = uploadReceivedBytes;
    displayManager.showProgress(uploadReceivedBytes, uploadTotalBytes);
  }
}
