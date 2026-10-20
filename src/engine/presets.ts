import { DisplayPreset, ColorFormat, DitheringAlgorithm, ExportFormat } from '../types';

export const DISPLAY_PRESETS: DisplayPreset[] = [
  {
    id: 'st7789_240x240',
    name: 'ST7789 (240x240)',
    category: 'ST7789',
    width: 240,
    height: 240,
    colorFormat: 'rgb565',
    endian: 'big',
    swapBytes: true,
    shape: 'square',
    description: 'Standard 1.3" / 1.54" IPS LCD for ESP32 / Arduino'
  },
  {
    id: 'st7789_240x320',
    name: 'ST7789 (240x320)',
    category: 'ST7789',
    width: 240,
    height: 320,
    colorFormat: 'rgb565',
    endian: 'big',
    swapBytes: true,
    shape: 'rectangle',
    description: 'Common 2.0" / 2.4" / 2.8" SPI IPS Display'
  },
  {
    id: 'st7789_135x240',
    name: 'ST7789 TTGO T-Display (135x240)',
    category: 'ST7789',
    width: 135,
    height: 240,
    colorFormat: 'rgb565',
    endian: 'big',
    swapBytes: true,
    shape: 'rectangle',
    description: 'LilyGO TTGO T-Display ESP32 1.14" LCD'
  },
  {
    id: 'st7789_172x320',
    name: 'ST7789 (172x320)',
    category: 'ST7789',
    width: 172,
    height: 320,
    colorFormat: 'rgb565',
    endian: 'big',
    swapBytes: true,
    shape: 'rectangle',
    description: '1.47" elongated display for smartbands / ESP32'
  },
  {
    id: 'st7789_170x320',
    name: 'ST7789 (170x320)',
    category: 'ST7789',
    width: 170,
    height: 320,
    colorFormat: 'rgb565',
    endian: 'big',
    swapBytes: true,
    shape: 'rectangle',
    description: '1.9" IPS LCD module'
  },
  {
    id: 'gc9a01_240x240',
    name: 'GC9A01 Circular (240x240)',
    category: 'Round Displays',
    width: 240,
    height: 240,
    colorFormat: 'rgb565',
    endian: 'big',
    swapBytes: true,
    shape: 'circle',
    description: 'Round 1.28" smartwatch display'
  },
  {
    id: 'ili9341_320x240',
    name: 'ILI9341 (320x240)',
    category: 'ILI9341',
    width: 320,
    height: 240,
    colorFormat: 'rgb565',
    endian: 'big',
    swapBytes: true,
    shape: 'rectangle',
    description: 'Classic 2.8" / 3.2" TFT LCD with touch'
  },
  {
    id: 'st7735_128x160',
    name: 'ST7735 (128x160)',
    category: 'ST7735',
    width: 128,
    height: 160,
    colorFormat: 'rgb565',
    endian: 'big',
    swapBytes: true,
    shape: 'rectangle',
    description: '1.8" SPI TFT LCD'
  },
  {
    id: 'st7735_128x128',
    name: 'ST7735 (128x128)',
    category: 'ST7735',
    width: 128,
    height: 128,
    colorFormat: 'rgb565',
    endian: 'big',
    swapBytes: true,
    shape: 'square',
    description: '1.44" square SPI TFT LCD'
  },
  {
    id: 'ssd1306_128x64',
    name: 'SSD1306 OLED (128x64)',
    category: 'Monochrome OLED',
    width: 128,
    height: 64,
    colorFormat: 'mono1_horizontal',
    endian: 'little',
    swapBytes: false,
    shape: 'rectangle',
    description: '0.96" I2C/SPI monochrome OLED'
  },
  {
    id: 'ssd1306_128x32',
    name: 'SSD1306 OLED (128x32)',
    category: 'Monochrome OLED',
    width: 128,
    height: 32,
    colorFormat: 'mono1_horizontal',
    endian: 'little',
    swapBytes: false,
    shape: 'rectangle',
    description: '0.91" I2C monochrome narrow OLED'
  },
  {
    id: 'waveshare_200x200',
    name: 'Waveshare e-Paper (200x200)',
    category: 'e-Paper',
    width: 200,
    height: 200,
    colorFormat: 'mono1_horizontal',
    endian: 'big',
    swapBytes: false,
    shape: 'square',
    description: '1.54" Black/White e-Ink display'
  },
  {
    id: 'waveshare_250x122',
    name: 'Waveshare e-Paper (250x122)',
    category: 'e-Paper',
    width: 250,
    height: 122,
    colorFormat: 'mono1_horizontal',
    endian: 'big',
    swapBytes: false,
    shape: 'rectangle',
    description: '2.13" Black/White e-Ink display'
  },
  {
    id: 'custom',
    name: 'Custom Resolution...',
    category: 'Custom',
    width: 240,
    height: 240,
    colorFormat: 'rgb565',
    endian: 'big',
    swapBytes: true,
    shape: 'rectangle',
    description: 'User specified width and height'
  }
];

export const COLOR_FORMATS: ColorFormat[] = [
  {
    id: 'rgb565',
    name: 'RGB565 (16-bit Color)',
    bytesPerPixel: 2,
    dataType: 'uint16_t',
    category: 'Color',
    description: '5 bits Red, 6 bits Green, 5 bits Blue. Standard for ST7789, ILI9341, TFT_eSPI.'
  },
  {
    id: 'bgr565',
    name: 'BGR565 (16-bit Color)',
    bytesPerPixel: 2,
    dataType: 'uint16_t',
    category: 'Color',
    description: '5 bits Blue, 6 bits Green, 5 bits Red. Required by inverted color controllers.'
  },
  {
    id: 'rgb888',
    name: 'RGB888 (24-bit True Color)',
    bytesPerPixel: 3,
    dataType: 'uint8_t',
    category: 'Color',
    description: '8 bits per channel (Red, Green, Blue). High quality for ESP32-S3 RGB LCDs.'
  },
  {
    id: 'rgb666',
    name: 'RGB666 (18-bit Color)',
    bytesPerPixel: 3,
    dataType: 'uint8_t',
    category: 'Color',
    description: '6 bits per channel (stored in 3 bytes).'
  },
  {
    id: 'gray8',
    name: 'Grayscale (8-bit, 256 levels)',
    bytesPerPixel: 1,
    dataType: 'uint8_t',
    category: 'Grayscale',
    description: '8 bits per pixel (0 = black, 255 = white).'
  },
  {
    id: 'gray4',
    name: 'Grayscale 4-bit (16 levels)',
    bytesPerPixel: 0.5,
    dataType: 'uint8_t',
    category: 'Grayscale',
    description: '2 pixels packed per byte. Common in 16-shade e-paper screens.'
  },
  {
    id: 'mono1_horizontal',
    name: 'Monochrome 1-bit (Horizontal - Adafruit GFX)',
    bytesPerPixel: 0.125,
    dataType: 'uint8_t',
    category: 'Monochrome',
    description: '8 pixels per byte, horizontal scan (MSB = leftmost pixel). Used by Adafruit_GFX drawBitmap.'
  },
  {
    id: 'mono1_vertical',
    name: 'Monochrome 1-bit (Vertical Page - SSD1306 native)',
    bytesPerPixel: 0.125,
    dataType: 'uint8_t',
    category: 'Monochrome',
    description: '8 vertical pixels per byte (Page mode). Native memory layout for SSD1306 / SH1106.'
  },
  {
    id: 'palette_gameboy',
    name: 'Game Boy Classic (4 Verde DMG)',
    bytesPerPixel: 0.25,
    dataType: 'uint8_t',
    category: 'Retro Palettes',
    description: 'Paleta original de 4 tonos verde oliva de la Game Boy de 1989. Empaqueta 4 píxeles por byte.'
  },
  {
    id: 'palette_gb_pocket',
    name: 'Game Boy Pocket (4 Grises LCD)',
    bytesPerPixel: 0.25,
    dataType: 'uint8_t',
    category: 'Retro Palettes',
    description: '4 tonos monocromáticos neutros de la Game Boy Pocket. 4 píxeles por byte.'
  },
  {
    id: 'palette_cga1',
    name: 'IBM CGA Paleta 1 (Cyan/Magenta)',
    bytesPerPixel: 0.25,
    dataType: 'uint8_t',
    category: 'Retro Palettes',
    description: 'Negro, Cyan, Magenta y Blanco del adaptador CGA de 1981. 4 píxeles por byte.'
  },
  {
    id: 'palette_cga2',
    name: 'IBM CGA Paleta 2 (Verde/Rojo/Amarillo)',
    bytesPerPixel: 0.25,
    dataType: 'uint8_t',
    category: 'Retro Palettes',
    description: 'Negro, Verde, Rojo y Amarillo vibrante CGA. 4 píxeles por byte.'
  },
  {
    id: 'palette_c64',
    name: 'Commodore 64 (16 Colores VIC-II)',
    bytesPerPixel: 0.5,
    dataType: 'uint8_t',
    category: 'Retro Palettes',
    description: 'Paleta icónica de 16 colores del Commodore 64. Empaqueta 2 píxeles por byte.'
  },
  {
    id: 'palette_pico8',
    name: 'PICO-8 Console (16 Colores)',
    bytesPerPixel: 0.5,
    dataType: 'uint8_t',
    category: 'Retro Palettes',
    description: 'Paleta armónica de 16 colores para pixel art retro moderno. 2 píxeles por byte.'
  },
  {
    id: 'palette_zx',
    name: 'ZX Spectrum (15 Colores Sinclair)',
    bytesPerPixel: 0.5,
    dataType: 'uint8_t',
    category: 'Retro Palettes',
    description: '15 colores emblemáticos del Sinclair ZX Spectrum. 2 píxeles por byte.'
  }
];

export const DITHERING_ALGORITHMS: DitheringAlgorithm[] = [
  { id: 'none', name: 'None (Threshold / Truncate)', description: 'Fast, sharp edges, no noise patterns' },
  { id: 'floyd', name: 'Floyd-Steinberg (Error Diffusion)', description: 'Smooth, natural gradients, best for photos' },
  { id: 'atkinson', name: 'Atkinson (Classic Mac / e-Paper)', description: 'High contrast, clean highlights, retro aesthetic' },
  { id: 'bayer4', name: 'Ordered Bayer 4x4', description: 'Stable grid pattern, eliminates temporal video flicker' },
  { id: 'bayer8', name: 'Ordered Bayer 8x8', description: 'Detailed stable pattern, great for animations' }
];

export const EXPORT_FORMATS: ExportFormat[] = [
  { id: 'c_header', name: 'C/C++ Header (.h)', ext: '.h', mime: 'text/x-c' },
  { id: 'binary', name: 'Raw Binary (.bin)', ext: '.bin', mime: 'application/octet-stream' },
  { id: 'bmpr', name: 'BitMapper Binary with Header (.bmpr / .bin)', ext: '.bmpr', mime: 'application/octet-stream' },
  { id: 'rle_compressed', name: 'Comprimido RLE (.bin.rle / .h)', ext: '.rle', mime: 'application/octet-stream' },
  { id: 'hex_dump', name: 'Hex Dump (.hex)', ext: '.hex', mime: 'text/plain' },
  { id: 'python', name: 'MicroPython (.py)', ext: '.py', mime: 'text/x-python' },
  { id: 'png_preview', name: 'Rendered PNG Preview (.png)', ext: '.png', mime: 'image/png' },
  { id: 'zip_sequence', name: 'ZIP Archive (Frames Sequence)', ext: '.zip', mime: 'application/zip' }
];
