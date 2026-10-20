export interface FontGenOptions {
  fontFamily: string;
  fontSize: number; // in pixels
  fontWeight?: string; // 'normal' | 'bold'
  firstChar?: number; // default 32 (' ')
  lastChar?: number; // default 126 ('~')
  fontName?: string;
}

export interface GeneratedGlyph {
  char: string;
  ascii: number;
  bitmapOffset: number;
  width: number;
  height: number;
  xAdvance: number;
  xOffset: number;
  yOffset: number;
  previewDataUrl?: string;
}

export interface GeneratedFontResult {
  fontName: string;
  firstChar: number;
  lastChar: number;
  yAdvance: number;
  totalBitmapsSize: number;
  headerContent: string;
  glyphs: GeneratedGlyph[];
}

export function generateBitmapFont(options: FontGenOptions): GeneratedFontResult {
  const {
    fontFamily,
    fontSize,
    fontWeight = 'normal',
    firstChar = 32,
    lastChar = 126,
    fontName = `${fontFamily.replace(/[^a-zA-Z0-9]/g, '_')}_${fontSize}pt`
  } = options;

  const canvas = document.createElement('canvas');
  const maxDim = Math.max(64, fontSize * 3);
  canvas.width = maxDim;
  canvas.height = maxDim;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  const fontSpec = `${fontWeight} ${fontSize}px "${fontFamily}", monospace, sans-serif`;
  ctx.font = fontSpec;
  ctx.textBaseline = 'alphabetic';

  const bitmapBytes: number[] = [];
  const glyphs: GeneratedGlyph[] = [];
  let bitBuffer = 0;
  let bitCount = 0;

  function pushBit(b: number) {
    bitBuffer = (bitBuffer << 1) | (b ? 1 : 0);
    bitCount++;
    if (bitCount === 8) {
      bitmapBytes.push(bitBuffer);
      bitBuffer = 0;
      bitCount = 0;
    }
  }

  function flushBits() {
    if (bitCount > 0) {
      bitBuffer <<= 8 - bitCount;
      bitmapBytes.push(bitBuffer);
      bitBuffer = 0;
      bitCount = 0;
    }
  }

  const baselineY = Math.round(fontSize * 1.5);
  const baselineX = 10;
  const yAdvance = Math.round(fontSize * 1.25);

  for (let ch = firstChar; ch <= lastChar; ch++) {
    const charStr = String.fromCharCode(ch);
    ctx.clearRect(0, 0, maxDim, maxDim);
    ctx.fillStyle = '#ffffff';
    ctx.font = fontSpec;
    ctx.fillText(charStr, baselineX, baselineY);

    const metrics = ctx.measureText(charStr);
    const xAdv = Math.max(1, Math.round(metrics.width));

    const imgData = ctx.getImageData(0, 0, maxDim, maxDim);
    const data = imgData.data;

    // Find tight bounding box of rendered character
    let minX = maxDim, maxX = -1, minY = maxDim, maxY = -1;
    for (let y = 0; y < maxDim; y++) {
      for (let x = 0; x < maxDim; x++) {
        const alpha = data[(y * maxDim + x) * 4 + 3];
        if (alpha > 80) { // Threshold for 1-bit font
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    let glyphW = 0;
    let glyphH = 0;
    let xOff = 0;
    let yOff = 0;
    const currentOffset = bitmapBytes.length;

    if (maxX >= minX && maxY >= minY) {
      glyphW = (maxX - minX) + 1;
      glyphH = (maxY - minY) + 1;
      xOff = minX - baselineX;
      yOff = minY - baselineY;

      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          const alpha = data[(y * maxDim + x) * 4 + 3];
          pushBit(alpha > 80 ? 1 : 0);
        }
      }
      flushBits();
    } else {
      // Empty character (like space)
      glyphW = 0;
      glyphH = 0;
      xOff = 0;
      yOff = 0;
    }

    // Create a mini dataUrl preview
    let previewUrl: string | undefined;
    if (glyphW > 0 && glyphH > 0) {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = glyphW;
      pCanvas.height = glyphH;
      const pCtx = pCanvas.getContext('2d')!;
      pCtx.putImageData(ctx.getImageData(minX, minY, glyphW, glyphH), 0, 0);
      previewUrl = pCanvas.toDataURL();
    }

    glyphs.push({
      char: charStr,
      ascii: ch,
      bitmapOffset: currentOffset,
      width: glyphW,
      height: glyphH,
      xAdvance: xAdv,
      xOffset: xOff,
      yOffset: yOff,
      previewDataUrl: previewUrl
    });
  }

  // Generate Adafruit_GFX / TFT_eSPI C++ header
  const safeFontName = fontName.replace(/[^a-zA-Z0-9_]/g, '_');
  const chunks: string[] = [];

  chunks.push(`// =============================================================================\n`);
  chunks.push(`// BitMapper Studio - Custom Bitmap Font Generator\n`);
  chunks.push(`// Font Family    : ${fontFamily} (${fontSize}px, ${fontWeight})\n`);
  chunks.push(`// Character Range: ASCII ${firstChar} to ${lastChar} ('${String.fromCharCode(firstChar)}' - '${String.fromCharCode(lastChar)}')\n`);
  chunks.push(`// Total Bitmaps   : ${bitmapBytes.length} bytes\n`);
  chunks.push(`// Date           : ${new Date().toISOString()}\n`);
  chunks.push(`// =============================================================================\n\n`);
  chunks.push(`#pragma once\n`);
  chunks.push(`#include <Adafruit_GFX.h>\n\n`);

  chunks.push(`// Bitmaps for glyphs (1-bit packed horizontally MSB first)\n`);
  chunks.push(`const uint8_t ${safeFontName}Bitmaps[${bitmapBytes.length}] PROGMEM = {\n`);
  let line = '  ';
  for (let i = 0; i < bitmapBytes.length; i++) {
    line += '0x' + bitmapBytes[i].toString(16).toUpperCase().padStart(2, '0');
    if (i < bitmapBytes.length - 1) line += ', ';
    if ((i + 1) % 16 === 0 || i === bitmapBytes.length - 1) {
      chunks.push(line + '\n');
      line = '  ';
    }
  }
  chunks.push(`};\n\n`);

  chunks.push(`// Glyph metadata: offset, width, height, xAdvance, xOffset, yOffset\n`);
  chunks.push(`const GFXglyph ${safeFontName}Glyphs[] PROGMEM = {\n`);
  glyphs.forEach((g, idx) => {
    const comment = g.char === '\\' ? "'\\\\'" : `'${g.char}'`;
    chunks.push(`  { ${g.bitmapOffset.toString().padStart(4, ' ')}, ${g.width.toString().padStart(2, ' ')}, ${g.height.toString().padStart(2, ' ')}, ${g.xAdvance.toString().padStart(2, ' ')}, ${g.xOffset.toString().padStart(3, ' ')}, ${g.yOffset.toString().padStart(3, ' ')} }${idx < glyphs.length - 1 ? ',' : ''} // ${comment} (${g.ascii})\n`);
  });
  chunks.push(`};\n\n`);

  chunks.push(`// GFXfont struct for Adafruit_GFX and TFT_eSPI (use tft.setFreeFont(&${safeFontName}))\n`);
  chunks.push(`const GFXfont ${safeFontName} PROGMEM = {\n`);
  chunks.push(`  (uint8_t *)${safeFontName}Bitmaps,\n`);
  chunks.push(`  (GFXglyph *)${safeFontName}Glyphs,\n`);
  chunks.push(`  ${firstChar},\n`);
  chunks.push(`  ${lastChar},\n`);
  chunks.push(`  ${yAdvance}\n`);
  chunks.push(`};\n`);

  return {
    fontName: safeFontName,
    firstChar,
    lastChar,
    yAdvance,
    totalBitmapsSize: bitmapBytes.length,
    headerContent: chunks.join(''),
    glyphs
  };
}
