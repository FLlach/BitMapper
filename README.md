# BitMapper Studio ⚡
> Generador de Bitmaps y Secuencias de Video para Microcontroladores (ESP32, ST7789, ILI9341, SSD1306 y más)

BitMapper Studio es una aplicación de escritorio moderna y de alto rendimiento diseñada para convertir imágenes fijas (PNG, JPG, BMP, WebP, GIF, SVG) y videos (MP4, WebM, MOV, AVI) en arreglos de memoria C/C++, archivos binarios brutos (`.bin`), dumps hexadecimales y scripts MicroPython, optimizados para pantallas de microcontroladores.

---

## 🌟 Características Principales

### 📸 Soporte de Medios Universal
- **Fotos e Imágenes**: Carga directa, arrastrar y soltar (Drag & Drop) o pegar desde el portapapeles (`Ctrl+V`).
- **Videos**: Reproductor integrado con barra de desplazamiento temporal (scrubber), selector de puntos de inicio (*In*) y fin (*Out*), paso fotograma a fotograma y diezmador de FPS (5, 10, 15, 20, 24, 30 FPS).
- **Ejemplos Integrados**: Generador de patrones procedimentales (Cyberpunk, Carta SMPTE, Rueda de Color, ESP32 Chip).

### 🖥️ Presets de Pantallas y Resoluciones
- **ST7789**:
  - `240 x 240` (Cuadrada / Redonda para ESP32)
  - `240 x 320` (Módulos estándar 2.0", 2.4", 2.8")
  - `135 x 240` (LilyGO TTGO T-Display 1.14")
  - `172 x 320` (Displays 1.47" de bandas inteligentes)
  - `170 x 320` (Displays IPS 1.9")
- **ILI9341**: `320 x 240` / `240 x 320`
- **GC9A01**: `240 x 240` (Con bisel circular simulado)
- **ST7735**: `128 x 160`, `128 x 128`, `80 x 160`
- **SSD1306 OLED**: `128 x 64`, `128 x 32`
- **Waveshare e-Paper**: `200 x 200`, `250 x 122`
- **Personalizado (Custom)**: Ancho y alto libres (1 a 4096 px) con botón de alternancia horizontal/vertical (⇄).

### 🎨 Formatos de Color & Profundidades de Bit
- **RGB565 (16-bit Color)**: 5 bits Rojo, 6 bits Verde, 5 bits Azul. El estándar de oro para ST7789 y TFT_eSPI.
- **BGR565 (16-bit Color)**: Para controladores con canales invertidos.
- **RGB888 (24-bit True Color)**: Calidad total para ESP32-S3 y pantallas RGB paralelas.
- **RGB666 (18-bit Color)**: 6 bits por canal.
- **Grayscale 8-bit (256 niveles)**: Ideal para pantallas monocromáticas avanzadas.
- **Grayscale 4-bit (16 niveles)**: Empaquetado de 2 píxeles por byte (pantallas e-Ink con escala de grises).
- **Monocromo 1-bit Horizontal (Adafruit GFX)**: 8 píxeles horizontales por byte (MSB a la izquierda).
- **Monocromo 1-bit Vertical (SSD1306 Page Mode)**: 8 píxeles verticales por byte para la memoria nativa del controlador OLED.

### 🧪 Algoritmos de Dithering (Difuminado)
1. **None (Truncar / Umbral)**: Bordes duros y gráficos limpios.
2. **Floyd-Steinberg**: Difusión de error de alta fidelidad, excelente para fotos realistas.
3. **Atkinson**: Difusión clásica con contraste acentuado (estilo MacPaint y tinta electrónica).
4. **Bayer Ordenado 4x4 y 8x8**: Patrones de matriz estables, **esenciales para video** porque no parpadean entre fotogramas consecutivos.

### ⚙️ Ajustes y Transformaciones en Tiempo Real
- **Modos de Escala**: `Cover` (Rellenar/recortar), `Contain` (Mantener proporción con color de fondo), `Stretch` (Estirar), `Center 1:1`.
- **Rotación**: 0°, 90°, 180°, 270°.
- **Volteo**: Horizontal (↔) y Vertical (↕).
- **Control de Imagen**: Deslizadores en vivo para Brillo, Contraste, Corrección Gamma, Umbral de binarización e Inversión de colores (Negativo).

### 💾 Formatos de Exportación
- **Cabecera C/C++ (`.h`)**:
  - Arreglo con atributo `PROGMEM` para almacenamiento en memoria Flash.
  - Exportación de fotograma individual o secuencia completa de video con tabla de punteros `frames[]` y constantes `#define FRAME_DELAY_MS`.
- **Binario Puro (`.bin`)**:
  - Archivo binario directo listo para volcar a una partición SPIFFS, LittleFS o tarjeta MicroSD del ESP32.
- **Hex Dump (`.hex`)**:
  - Volcado de texto hexadecimal formateado.
- **MicroPython (`.py`)**:
  - `bytearray(b'...')` listo para controladores MicroPython o CircuitPython.
- **Paquete ZIP de Secuencia**:
  - Genera automáticamente un archivo `.zip` con todos los fotogramas en `.bin` o `.h`, junto al sketch de Arduino listo para compilar.

### 🚀 Generador de Código Arduino para ESP32
Pestaña interactiva con sketches completos y listos para flashear con:
- **TFT_eSPI** (`tft.pushImage(...)` con `tft.setSwapBytes(...)`)
- **Adafruit_GFX + Adafruit_ST7789** (`tft.drawRGBBitmap(...)`)
- **LovyanGFX** (Controlador ultra-rápido por hardware DMA)
- **Streaming desde LittleFS / SD** (Lectura directa de archivos `.bin`)

---

## 💻 Requisitos y Ejecución

La aplicación está construida sobre **TypeScript**, **Electron** y empaquetada con **esbuild** para máximo rendimiento.

### Scripts Disponibles

```bash
# Compilar TypeScript y ejecutar la aplicación (prestart ejecuta npm run build automáticamente)
npm start

# Verificar tipos estáticos con el compilador de TypeScript
npm run typecheck

# Compilar manualmente el proyecto
npm run build
```

---

## ⌨️ Atajos de Teclado
- `Ctrl + O`: Abrir archivo (imagen o video)
- `Ctrl + V`: Pegar imagen del portapapeles
- `Ctrl + S`: Exportar bitmap o secuencia
- `Espacio`: Reproducir / pausar video
- `Flecha Izquierda` / `Flecha Derecha`: Retroceder / avanzar fotograma

---

## 📁 Estructura del Proyecto (TypeScript)

```
BitMapper/
├── package.json             # Dependencias y scripts de compilación
├── tsconfig.json            # Configuración estricta de TypeScript
├── index.html               # Interfaz de usuario estructurada
├── styles.css               # Diseño moderno oscuro con glassmorphism
├── dist/                    # Código JavaScript compilado y empaquetado
│   ├── main.js              # Bundle del proceso principal
│   ├── preload.js           # Bundle del puente seguro IPC
│   └── app.js               # Bundle de la interfaz y módulos de procesamiento
└── src/
    ├── types/
    │   └── index.ts         # Interfaces y tipos TypeScript (Presets, Formatos, Opciones)
    ├── main.ts              # Proceso principal de Electron (diálogos nativos, IPC, FS)
    ├── preload.ts           # Puente seguro de tipos para window.bitmapperAPI
    ├── engine/
    │   ├── presets.ts       # Catálogo de pantallas (ST7789, ILI9341, SSD1306, etc.)
    │   ├── dither.ts        # Algoritmos Floyd-Steinberg, Atkinson, Bayer 4x4 y 8x8
    │   ├── color-quantizer.ts # Motores de codificación RGB565, BGR565, Grayscale, Mono
    │   └── exporters.ts     # Generadores de C/C++, .bin, hex, MicroPython y sketches Arduino
    └── renderer/
        └── app.ts           # Controlador UI, reproductor de video y pipeline de renderizado
```
