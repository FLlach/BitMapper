#pragma once

#include "config.h"
#include <Preferences.h>

class PreferencesManager {
public:
  PreferencesManager();
  void begin();
  void load(DeviceSettings &settings);
  void save(const DeviceSettings &settings);
  void saveLastFile(const String &path);
  void saveSlideshow(bool enabled, int delaySec);
  void saveTransitionMode(TransitionMode mode);
  void saveBrightness(uint8_t duty);
  void saveVideoFps(int fps);
  void saveSwapBytes(bool swap);
  void saveInvertDisplay(bool invert);

private:
  Preferences prefs;
};

extern PreferencesManager prefManager;
