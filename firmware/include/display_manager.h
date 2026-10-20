#pragma once

#include "config.h"
#include <FS.h>
#include <TFT_eSPI.h>
#include <functional>

class DisplayManager {
public:
  DisplayManager();
  void init(const DeviceSettings &settings);
  void setBrightness(uint8_t duty);
  uint8_t getBrightness() const;
  void fadeBacklight(uint8_t fromDuty, uint8_t toDuty, int stepDelayMs = 12);

  void setSwapBytes(bool swap);
  void setInvertDisplay(bool invert);

  void showCalibrationPattern();
  void showToast(const char *line1, const char *line2 = nullptr);
  void showProgress(size_t received, size_t total);
  void showNoSDMessage();
  void showEmptySDMessage();
  void showIncompatibleMessage(const String &path, size_t fileSize);
  void clearScreen(uint16_t color = TFT_BLACK);

  // Renderizado de fotogramas
  void renderBmprFrame(File &file, const BmprHeader &header, int frameIndex);
  void renderLegacyRawFrame(File &file, int frameIndex, int origW, int origH);

  // Transición entre imágenes
  void performTransition(TransitionMode mode, std::function<void()> drawCallback);

  TFT_eSPI &getTFT() { return tft; }

private:
  TFT_eSPI tft;
  uint8_t currentDuty;
  bool isDmaActive;

  // Búferes para renderizado rápido
  static const int CHUNK_LINES = 16;
  uint16_t chunkBufferA[IMAGE_WIDTH * CHUNK_LINES];
  uint16_t lineBuffer[IMAGE_WIDTH];
};

extern DisplayManager displayManager;
