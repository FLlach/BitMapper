#pragma once

#include "config.h"
#include <BLE2902.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <FS.h>
#include <functional>

class BLEServiceManager {
public:
  BLEServiceManager();
  void init(const DeviceSettings &settings);
  void loop();

  void startBLE();
  void stopBLE();
  void toggleBLE();

  bool isActive() const { return isBleActive; }
  bool isConnected() const { return deviceConnected; }
  void setDeviceConnected(bool connected) { deviceConnected = connected; }
  bool isUploadInProgress() const { return isUploading; }

  // Callbacks para eventos del sistema
  std::function<void(const String &path)> onFileUploaded;
  std::function<void(const String &path)> onShowFile;
  std::function<void(const String &path)> onBeforeDelete;
  std::function<void(const String &path)> onFileDeleted;
  std::function<void()> onNextPhoto;
  std::function<void()> onPrevPhoto;
  std::function<void(bool pause)> onPausePlayback;
  std::function<void()> onToggleByteSwap;
  std::function<void()> onToggleInvert;
  std::function<String()> onGetStatus;
  std::function<void(int fps)> onFpsChanged;
  std::function<void(bool enabled, int delaySec)> onSlideshowChanged;
  std::function<void(TransitionMode mode)> onTransitionChanged;
  std::function<void(uint8_t duty)> onBrightnessChanged;
  std::function<void(bool enabled, int timeoutSec, uint8_t dimDuty)> onSleepConfigChanged;
  std::function<void()> onTriggerSleep;
  std::function<void()> onTriggerWake;
  std::function<void()> onActivity;

  void notifyControl(const String &msg);
  void sendThumbnail(const String &path);

  // Llamado internamente por los callbacks de BLE
  void handleControlCommand(const String &value);
  void handleDataChunk(uint8_t *pData, size_t len);

private:
  BLEServer *pServer;
  BLECharacteristic *pControlChar;
  BLECharacteristic *pDataChar;

  bool deviceConnected;
  bool oldDeviceConnected;
  bool isBleActive;
  unsigned long lastBleActivityTime;

  File currentUploadFile;
  String uploadFilename;
  size_t uploadTotalBytes;
  size_t uploadReceivedBytes;
  bool isUploading;
};

extern BLEServiceManager bleService;
