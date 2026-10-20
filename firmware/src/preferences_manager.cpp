#include "preferences_manager.h"

PreferencesManager prefManager;

PreferencesManager::PreferencesManager() {}

void PreferencesManager::begin() {}

void PreferencesManager::load(DeviceSettings &settings) {
  if (prefs.begin("bitmapper", true)) {
    settings.swapBytes = prefs.getBool("swapBytes", true);
    settings.invertDisplay = prefs.getBool("invDisp", false);
    settings.videoFps = prefs.getInt("videoFps", 15);
    if (settings.videoFps < 1 || settings.videoFps > 60) {
      settings.videoFps = 15;
    }
    settings.slideshowEnabled = prefs.getBool("slideshow", false);
    settings.slideshowDelaySec = prefs.getInt("slideSec", 5);
    if (settings.slideshowDelaySec < 1 || settings.slideshowDelaySec > 3600) {
      settings.slideshowDelaySec = 5;
    }
    int tMode = prefs.getInt("transMode", (int)TRANSITION_FADE);
    if (tMode < 0 || tMode > 3) {
      tMode = (int)TRANSITION_FADE;
    }
    settings.transitionMode = (TransitionMode)tMode;
    settings.brightnessDuty = (uint8_t)prefs.getUChar("brightness", TFT_BACKLIGHT_DEFAULT_DUTY);
    settings.lastFile = prefs.getString("lastFile", "");
    prefs.end();

    Serial.printf("[NVS] Ajustes cargados: SwapBytes=%d, Invert=%d, FPS=%d, Slideshow=%d (%ds), Trans=%d, Brillo=%u, Ultimo='%s'\n",
                  settings.swapBytes, settings.invertDisplay, settings.videoFps,
                  settings.slideshowEnabled, settings.slideshowDelaySec,
                  (int)settings.transitionMode, settings.brightnessDuty, settings.lastFile.c_str());
  } else {
    Serial.println("[NVS] Sin preferencias previas. Usando valores predeterminados.");
  }
}

void PreferencesManager::save(const DeviceSettings &settings) {
  if (prefs.begin("bitmapper", false)) {
    prefs.putBool("swapBytes", settings.swapBytes);
    prefs.putBool("invDisp", settings.invertDisplay);
    prefs.putInt("videoFps", settings.videoFps);
    prefs.putBool("slideshow", settings.slideshowEnabled);
    prefs.putInt("slideSec", settings.slideshowDelaySec);
    prefs.putInt("transMode", (int)settings.transitionMode);
    prefs.putUChar("brightness", settings.brightnessDuty);
    if (settings.lastFile.length() > 0) {
      prefs.putString("lastFile", settings.lastFile);
    }
    prefs.end();
    Serial.println("[NVS] Preferencias globales guardadas en Flash.");
  }
}

void PreferencesManager::saveLastFile(const String &path) {
  if (prefs.begin("bitmapper", false)) {
    prefs.putString("lastFile", path);
    prefs.end();
  }
}

void PreferencesManager::saveSlideshow(bool enabled, int delaySec) {
  if (prefs.begin("bitmapper", false)) {
    prefs.putBool("slideshow", enabled);
    prefs.putInt("slideSec", delaySec);
    prefs.end();
    Serial.printf("[NVS] Slideshow guardado: %s (%d s)\n", enabled ? "ON" : "OFF", delaySec);
  }
}

void PreferencesManager::saveTransitionMode(TransitionMode mode) {
  if (prefs.begin("bitmapper", false)) {
    prefs.putInt("transMode", (int)mode);
    prefs.end();
    Serial.printf("[NVS] Modo de transicion guardado: %d\n", (int)mode);
  }
}

void PreferencesManager::saveBrightness(uint8_t duty) {
  if (prefs.begin("bitmapper", false)) {
    prefs.putUChar("brightness", duty);
    prefs.end();
    Serial.printf("[NVS] Brillo guardado: %u\n", duty);
  }
}

void PreferencesManager::saveVideoFps(int fps) {
  if (prefs.begin("bitmapper", false)) {
    prefs.putInt("videoFps", fps);
    prefs.end();
  }
}

void PreferencesManager::saveSwapBytes(bool swap) {
  if (prefs.begin("bitmapper", false)) {
    prefs.putBool("swapBytes", swap);
    prefs.end();
  }
}

void PreferencesManager::saveInvertDisplay(bool invert) {
  if (prefs.begin("bitmapper", false)) {
    prefs.putBool("invDisp", invert);
    prefs.end();
  }
}
