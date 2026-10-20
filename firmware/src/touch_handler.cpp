#include "touch_handler.h"

TouchHandler touchHandler;

TouchHandler::TouchHandler()
    : tapCount(0), lastTapTime(0), lastButtonState(!TOUCH_ACTIVE_LEVEL),
      lastDebounceTime(0), pressStartTime(0), longPressTriggered(false),
      bleHoldTriggered(false), lastCountdownSec(-1) {}

void TouchHandler::init() {
  pinMode(ONBOARD_LED, OUTPUT);
  digitalWrite(ONBOARD_LED, HIGH);

  if (TOUCH_ACTIVE_LEVEL == HIGH) {
    pinMode(TOUCH_PIN, INPUT_PULLDOWN);
  } else {
    pinMode(TOUCH_PIN, INPUT_PULLUP);
  }
}

void TouchHandler::flashLed(int times, int durationMs) {
  for (int i = 0; i < times; i++) {
    digitalWrite(ONBOARD_LED, LOW);
    delay(durationMs);
    digitalWrite(ONBOARD_LED, HIGH);
    if (i < times - 1) delay(durationMs);
  }
}

void TouchHandler::loop() {
  bool currentButtonReading = (digitalRead(TOUCH_PIN) == TOUCH_ACTIVE_LEVEL);

  if (currentButtonReading != lastButtonState) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > DEBOUNCE_TIME_MS) {
    static bool buttonState = !TOUCH_ACTIVE_LEVEL;

    if (currentButtonReading != buttonState) {
      buttonState = currentButtonReading;

      // Evento: Botón presionado
      if (buttonState == TOUCH_ACTIVE_LEVEL) {
        pressStartTime = millis();
        longPressTriggered = false;
        bleHoldTriggered = false;
        lastCountdownSec = -1;
        unsigned long now = millis();

        if (tapCount == 0) {
          tapCount = 1;
          lastTapTime = now;
        } else if (tapCount < 5 && (now - lastTapTime) <= DOUBLE_TAP_WINDOW_MS) {
          tapCount++;
          lastTapTime = now;
        }
      } else {
        // Evento: Botón soltado
        unsigned long heldDuration = millis() - pressStartTime;

        if (bleHoldTriggered) {
          tapCount = 0;
        } else if (heldDuration >= 1200 && heldDuration < 6000) {
          // Pulsación sostenida media (1.2s a 6s) -> Inversión de pantalla
          tapCount = 0;
          flashLed(3, 40);
          if (onToggleInvert) onToggleInvert();
        }
      }
    }

    // Mientras el botón permanezca presionado
    if (buttonState == TOUCH_ACTIVE_LEVEL) {
      unsigned long elapsed = millis() - pressStartTime;

      // A los 6 segundos: Alternar BLE
      if (elapsed >= 6000 && !bleHoldTriggered) {
        bleHoldTriggered = true;
        longPressTriggered = true;
        tapCount = 0;
        Serial.println("[Touch] ¡6 segundos! Alternando Bluetooth LE...");
        flashLed(4, 50);
        if (onToggleBle) onToggleBle();
      }
      // Entre 3 y 5 segundos: Feedback de parpadeo por segundo
      else if (elapsed >= 3000 && !bleHoldTriggered) {
        int sec = (elapsed / 1000);
        if (sec != lastCountdownSec) {
          lastCountdownSec = sec;
          digitalWrite(ONBOARD_LED, LOW);
          delay(25);
          digitalWrite(ONBOARD_LED, HIGH);
          Serial.printf("[Touch Hold] %d s... (mantener 6s para BLE)\n", sec);
        }
      }
    }
  }

  lastButtonState = currentButtonReading;

  // Evaluar toques cortos cuando vence la ventana
  if (tapCount > 0 && !bleHoldTriggered &&
      (millis() - lastTapTime) > DOUBLE_TAP_WINDOW_MS) {
    if ((millis() - pressStartTime) < 1200) {
      if (tapCount == 1) {
        flashLed(1, 40);
        if (onNext) onNext();
      } else if (tapCount == 2) {
        flashLed(2, 40);
        if (onPrev) onPrev();
      } else if (tapCount == 3) {
        flashLed(3, 40);
        if (onToggleByteSwap) onToggleByteSwap();
      } else if (tapCount == 4) {
        flashLed(4, 30);
        if (onToggleInvert) onToggleInvert();
      } else if (tapCount >= 5) {
        flashLed(5, 25);
        if (onCycleFps) onCycleFps();
      }
    }
    tapCount = 0;
  }
}
