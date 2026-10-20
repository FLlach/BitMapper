import { HeaderOptions } from '../types';
import { toHex } from './exporters';

export interface RLECompressionResult {
  compressed: Uint8Array;
  originalSize: number;
  compressedSize: number;
  ratioPercent: number; // e.g. -45 (%)
}

/**
 * PackBits-style Run-Length Encoding for binary and image buffers.
 * Guarantees no expansion penalty and provides streaming decompression.
 */
export function compressRLE(data: Uint8Array): RLECompressionResult {
  const originalSize = data.length;
  if (originalSize === 0) {
    return {
      compressed: new Uint8Array(0),
      originalSize: 0,
      compressedSize: 0,
      ratioPercent: 0
    };
  }

  const out: number[] = [];
  let i = 0;

  while (i < originalSize) {
    // Check for a run of repeating bytes
    let runLen = 1;
    while (i + runLen < originalSize && runLen < 128 && data[i + runLen] === data[i]) {
      runLen++;
    }

    if (runLen >= 3) {
      // Encode run packet: high bit set (0x80 | (count - 1))
      out.push(0x80 | (runLen - 1));
      out.push(data[i]);
      i += runLen;
    } else {
      // Find literal sequence of non-repeating bytes
      let litLen = 0;
      while (i + litLen < originalSize && litLen < 128) {
        // Stop if a run of 3 or more starts ahead
        if (
          i + litLen + 2 < originalSize &&
          data[i + litLen] === data[i + litLen + 1] &&
          data[i + litLen] === data[i + litLen + 2]
        ) {
          break;
        }
        litLen++;
      }

      if (litLen === 0) {
        litLen = 1;
      }

      // Encode literal packet: high bit clear (count - 1)
      out.push(litLen - 1);
      for (let k = 0; k < litLen; k++) {
        out.push(data[i + k]);
      }
      i += litLen;
    }
  }

  const compressed = new Uint8Array(out);
  const compressedSize = compressed.length;
  const ratioPercent = Math.round(((compressedSize - originalSize) / originalSize) * 100);

  return {
    compressed,
    originalSize,
    compressedSize,
    ratioPercent
  };
}

/**
 * Decompress a PackBits RLE buffer back to original bytes (for validation)
 */
export function decompressRLE(compressed: Uint8Array, expectedSize?: number): Uint8Array {
  const out: number[] = [];
  let si = 0;

  while (si < compressed.length) {
    const header = compressed[si++];
    if (header & 0x80) {
      const count = (header & 0x7f) + 1;
      const val = compressed[si++];
      for (let k = 0; k < count; k++) out.push(val);
    } else {
      const count = header + 1;
      for (let k = 0; k < count && si < compressed.length; k++) {
        out.push(compressed[si++]);
      }
    }
    if (expectedSize && out.length >= expectedSize) break;
  }

  return new Uint8Array(out);
}

/**
 * Generate a complete C/C++ Header with embedded RLE decompressed draw function
 */
export function generateRLECHeader(
  name: string,
  width: number,
  height: number,
  rawBytes: Uint8Array,
  options: HeaderOptions = {}
): string {
  const { colorFormat = 'rgb565', useProgmem = true } = options;
  const { compressed, originalSize, compressedSize, ratioPercent } = compressRLE(rawBytes);

  const safeName = name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
  const upperName = safeName.toUpperCase();
  const progmemStr = useProgmem ? 'PROGMEM ' : '';

  const chunks: string[] = [];
  chunks.push(`// =============================================================================\n`);
  chunks.push(`// BitMapper Studio - PackBits RLE Compressed Bitmap\n`);
  chunks.push(`// Original Size   : ${originalSize} bytes (${width} x ${height} px)\n`);
  chunks.push(`// Compressed Size : ${compressedSize} bytes (${ratioPercent < 0 ? ratioPercent : '+' + ratioPercent}%)\n`);
  chunks.push(`// Color Format     : ${colorFormat.toUpperCase()}\n`);
  chunks.push(`// Date             : ${new Date().toISOString()}\n`);
  chunks.push(`// =============================================================================\n\n`);
  chunks.push(`#pragma once\n`);
  chunks.push(`#include <Arduino.h>\n\n`);
  chunks.push(`#define ${upperName}_WIDTH ${width}\n`);
  chunks.push(`#define ${upperName}_HEIGHT ${height}\n`);
  chunks.push(`#define ${upperName}_RAW_SIZE ${originalSize}\n`);
  chunks.push(`#define ${upperName}_RLE_SIZE ${compressedSize}\n\n`);

  chunks.push(`// RLE Compressed Stream Data\n`);
  chunks.push(`const uint8_t ${safeName}_rle_data[${compressedSize}] ${progmemStr}= {\n`);

  let currentLine = '  ';
  for (let i = 0; i < compressedSize; i++) {
    currentLine += toHex(compressed[i], 'uint8_t');
    if (i < compressedSize - 1) currentLine += ', ';
    if ((i + 1) % 16 === 0 || i === compressedSize - 1) {
      chunks.push(currentLine + '\n');
      currentLine = '  ';
    }
  }
  chunks.push(`};\n\n`);

  // Embedded streaming decompression helper for TFT_eSPI
  chunks.push(`/**\n`);
  chunks.push(` * Stream and draw RLE compressed RGB565 bitmap directly to TFT display\n`);
  chunks.push(` * Requires ZERO RAM allocation!\n`);
  chunks.push(` */\n`);
  chunks.push(`#if defined(TFT_ESPI_VERSION) || defined(_TFT_eSPIH_)\n`);
  chunks.push(`inline void draw_${safeName}_RLE(TFT_eSPI &tft, int16_t x, int16_t y) {\n`);
  chunks.push(`  tft.setAddrWindow(x, y, ${upperName}_WIDTH, ${upperName}_HEIGHT);\n`);
  chunks.push(`  tft.startWrite();\n`);
  chunks.push(`  size_t si = 0;\n`);
  chunks.push(`  uint8_t byteLo = 0, byteHi = 0;\n`);
  chunks.push(`  bool hasHi = false;\n`);
  chunks.push(`  while (si < ${upperName}_RLE_SIZE) {\n`);
  chunks.push(`    uint8_t header = pgm_read_byte(&${safeName}_rle_data[si++]);\n`);
  chunks.push(`    if (header & 0x80) {\n`);
  chunks.push(`      uint8_t count = (header & 0x7F) + 1;\n`);
  chunks.push(`      uint8_t val = pgm_read_byte(&${safeName}_rle_data[si++]);\n`);
  chunks.push(`      for (uint8_t k = 0; k < count; k++) {\n`);
  chunks.push(`        if (!hasHi) { byteHi = val; hasHi = true; }\n`);
  chunks.push(`        else { tft.pushColor((byteHi << 8) | val); hasHi = false; }\n`);
  chunks.push(`      }\n`);
  chunks.push(`    } else {\n`);
  chunks.push(`      uint8_t count = header + 1;\n`);
  chunks.push(`      for (uint8_t k = 0; k < count; k++) {\n`);
  chunks.push(`        uint8_t val = pgm_read_byte(&${safeName}_rle_data[si++]);\n`);
  chunks.push(`        if (!hasHi) { byteHi = val; hasHi = true; }\n`);
  chunks.push(`        else { tft.pushColor((byteHi << 8) | val); hasHi = false; }\n`);
  chunks.push(`      }\n`);
  chunks.push(`    }\n`);
  chunks.push(`  }\n`);
  chunks.push(`  tft.endWrite();\n`);
  chunks.push(`}\n`);
  chunks.push(`#endif\n`);

  return chunks.join('');
}
