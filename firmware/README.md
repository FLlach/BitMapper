# Firmware ESP32-C3 SuperMini + Pantalla ST7789

Proyecto de firmware configurado con **PlatformIO** y la librería de alto rendimiento **TFT_eSPI**, optimizado para visualizar bitmaps e imágenes exportadas desde **BitMapper Studio**.

---

## 📌 Conexiones de Hardware

| Pin Pantalla ST7789 | Pin ESP32-C3 SuperMini | Descripción |
| :--- | :--- | :--- |
| **GND** | **GND** | Tierra |
| **VCC** | **3.3V** | Alimentación |
| **SCL / SCLK** | **GPIO 4** | Reloj SPI (Hardware) |
| **SDA / MOSI** | **GPIO 6** | Datos SPI (Hardware) |
| **DC / RS** | **GPIO 2** | Selección Datos / Comando |
| **RES / RST** | **GPIO 1** | Reset de pantalla |
| **CS** | **GPIO 7** | Chip Select *(dejar sin conectar si la pantalla no tiene CS)* |
| **BLK / BL** | **3.3V** o **GPIO 0** | Retroiluminación *(a 3.3V encendida al 100%)* |

---

## 🚀 Comandos de Flasheo (PlatformIO)

### 1. Compilar
```powershell
pio run -d firmware
```

### 2. Flashear / Subir al ESP32-C3
Conecta la ESP32-C3 SuperMini por USB y ejecuta:
```powershell
pio run -d firmware --target upload
```

> **Nota:** Si la placa no entra automáticamente en modo descarga, mantén presionado el botón **BOOT** (GPIO 9) en la SuperMini mientras conectas el cable USB o presiona **BOOT** y luego un toque corto en **RESET**.

### 3. Monitor Serial
```powershell
pio device monitor -d firmware
```

---

## 🎨 Cómo mostrar imágenes generadas con BitMapper Studio

1. En **BitMapper Studio**, carga tu imagen o crea tu animación.
2. Selecciona el formato **RGB565 (16-bit)** y el preset de resolución de tu pantalla (ej. **240x240**).
3. Haz clic en **Exportar Código C/C++ Header (.h)** y guarda el archivo en la carpeta `firmware/include/mi_imagen.h`.
4. En `firmware/src/main.cpp`:
   ```cpp
   #include <Arduino.h>
   #include <TFT_eSPI.h>
   #include "mi_imagen.h"

   TFT_eSPI tft = TFT_eSPI();

   void setup() {
       tft.init();
       tft.setRotation(0);
       tft.setSwapBytes(true); // Importante para colores RGB565 correctos
       tft.fillScreen(TFT_BLACK);

       // Dibuja tu imagen en las coordenadas (0, 0)
       tft.pushImage(0, 0, MI_IMAGEN_WIDTH, MI_IMAGEN_HEIGHT, mi_imagen_data);
   }

   void loop() {
   }
   ```
