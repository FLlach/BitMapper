#pragma once

#include <Arduino.h>
#include <stdint.h>

// -----------------------------------------------------------------------------
// Configuración de Pines de Hardware (ESP32-C3 SuperMini)
// -----------------------------------------------------------------------------
#define TFT_BLK_PIN 0 // Control PWM de retroiluminación ST7735S
#define TFT_CS_PIN 7  // Chip Select de la pantalla ST7735S
#define TFT_DC_PIN 2  // Data / Command de la pantalla
#define TFT_RST_PIN 1 // Reset de la pantalla
#define SD_CS_PIN 3   // Chip Select del lector MicroSD SPI
#define TOUCH_PIN 10  // Pin de entrada táctil (TTP223 / Pulsador)
#define ONBOARD_LED 8 // LED azul integrado en el ESP32-C3 SuperMini

#define TOUCH_ACTIVE_LEVEL HIGH

// -----------------------------------------------------------------------------
// Retroiluminación PWM (LEDC)
// -----------------------------------------------------------------------------
#define TFT_BACKLIGHT_CHANNEL 0
#define TFT_BACKLIGHT_FREQ 5000
#define TFT_BACKLIGHT_RES 8
#define TFT_BACKLIGHT_DEFAULT_DUTY 153 // 60% brillo (153 de 255)

// -----------------------------------------------------------------------------
// Dimensiones Físicas del Display ST7735S
// -----------------------------------------------------------------------------
#define IMAGE_WIDTH 128
#define IMAGE_HEIGHT 160

// -----------------------------------------------------------------------------
// Parámetros de Pulsación y Gestos Táctiles
// -----------------------------------------------------------------------------
#define DEBOUNCE_TIME_MS 35
#define DOUBLE_TAP_WINDOW_MS 320

// -----------------------------------------------------------------------------
// Bluetooth Low Energy (BLE) UUIDs
// -----------------------------------------------------------------------------
#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CONTROL_CHAR_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define DATA_CHAR_UUID "beb5483f-36e1-4688-b7f5-ea07361b26a8"
#define BLE_INACTIVITY_TIMEOUT_MS 180000 // 3 min de inactividad antes de auto-apagar BLE

// -----------------------------------------------------------------------------
// Formato Binario BMPR con Cabecera de Metadatos (16 bytes)
// -----------------------------------------------------------------------------
#define BMPR_MAGIC "BMPR"
#define BMPR_VERSION 1

#pragma pack(push, 1)
struct BmprHeader {
  char magic[4];        // 'B', 'M', 'P', 'R'
  uint16_t version;     // 1
  uint16_t width;       // Ancho en píxeles (ej. 128)
  uint16_t height;      // Alto en píxeles (ej. 160)
  uint16_t totalFrames; // 1 = Foto fija, >1 = Video animado
  uint8_t fps;          // Velocidad en fotogramas por segundo (ej. 15)
  uint8_t colorFormat;  // 0 = RGB565, 1 = BGR565, 2 = RGB888, 3 = Gray8, 4 = Mono1H, 5 = Mono1V
  uint16_t flags;       // bit 0: swapBytes
};
#pragma pack(pop)

// -----------------------------------------------------------------------------
// Modos de Transición entre Imágenes
// -----------------------------------------------------------------------------
enum TransitionMode {
  TRANSITION_NONE = 0,       // Corte directo instantáneo
  TRANSITION_FADE = 1,       // Desvanecimiento suave mediante PWM de retroiluminación
  TRANSITION_WIPE_DOWN = 2,  // Cortina vertical de arriba a abajo
  TRANSITION_WIPE_RIGHT = 3  // Barrido horizontal de izquierda a derecha
};

// -----------------------------------------------------------------------------
// Estructura de Configuración del Dispositivo
// -----------------------------------------------------------------------------
struct DeviceSettings {
  bool swapBytes = true;
  bool invertDisplay = false;
  int videoFps = 15;
  bool slideshowEnabled = false;
  int slideshowDelaySec = 5;
  TransitionMode transitionMode = TRANSITION_FADE;
  uint8_t brightnessDuty = TFT_BACKLIGHT_DEFAULT_DUTY;
  String lastFile = "";
};
