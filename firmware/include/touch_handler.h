#pragma once

#include "config.h"
#include <functional>

class TouchHandler {
public:
  TouchHandler();
  void init();
  void loop();

  std::function<void()> onNext;
  std::function<void()> onPrev;
  std::function<void()> onToggleByteSwap;
  std::function<void()> onToggleInvert;
  std::function<void()> onCycleFps;
  std::function<void()> onToggleBle;

  void flashLed(int times, int durationMs = 30);

private:
  int tapCount;
  unsigned long lastTapTime;
  bool lastButtonState;
  unsigned long lastDebounceTime;
  unsigned long pressStartTime;
  bool longPressTriggered;
  bool bleHoldTriggered;
  int lastCountdownSec;
};

extern TouchHandler touchHandler;
