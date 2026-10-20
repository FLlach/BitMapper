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
  std::function<void()> onWake;
  std::function<void()> onActivity;

  void setSleeping(bool sleeping) { isSleeping = sleeping; }
  bool getSleeping() const { return isSleeping; }

  void flashLed(int times, int durationMs = 30);

private:
  int tapCount;
  unsigned long lastTapTime;
  bool lastButtonState;
  unsigned long lastDebounceTime;
  unsigned long pressStartTime;
  bool longPressTriggered;
  bool bleHoldTriggered;
  bool isSleeping;
  bool wakeTriggered;
  int lastCountdownSec;
};

extern TouchHandler touchHandler;
