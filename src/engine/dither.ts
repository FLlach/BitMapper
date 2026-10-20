import { ColorFormatId, DitherAlgorithmId } from '../types';
import { isRetroPalette, findClosestPaletteColor, RETRO_PALETTES } from './retro-palettes';

export const BAYER_4X4: number[][] = [
  [ 0,  8,  2, 10],
  [12,  4, 14,  6],
  [ 3, 11,  1,  9],
  [15,  7, 13,  5]
];

export const BAYER_8X8: number[][] = [
  [ 0, 32,  8, 40,  2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44,  4, 36, 14, 46,  6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [ 3, 35, 11, 43,  1, 33,  9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47,  7, 39, 13, 45,  5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21]
];

/**
 * Clamp a numeric value between min and max
 */
export function clamp(val: number, min = 0, max = 255): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Apply dithering and return an array of quantized RGBA values.
 */
export function applyDithering(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  ditherType: DitherAlgorithmId,
  mode: ColorFormatId,
  threshold = 128
): Uint8ClampedArray {
  const output = new Uint8ClampedArray(pixels.length);
  const isMono = mode === 'mono1_horizontal' || mode === 'mono1_vertical';
  const isGray4 = mode === 'gray4';
  const isGray8 = mode === 'gray8';

  // Error diffusion algorithms
  if (ditherType === 'floyd' || ditherType === 'atkinson') {
    const rBuffer = new Float32Array(width * height);
    const gBuffer = new Float32Array(width * height);
    const bBuffer = new Float32Array(width * height);

    for (let i = 0; i < width * height; i++) {
      const idx = i * 4;
      rBuffer[i] = pixels[idx];
      gBuffer[i] = pixels[idx + 1];
      bBuffer[i] = pixels[idx + 2];
      output[idx + 3] = pixels[idx + 3]; // Alpha channel
    }

    const isAtkinson = ditherType === 'atkinson';

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        const curR = clamp(rBuffer[i]);
        const curG = clamp(gBuffer[i]);
        const curB = clamp(bBuffer[i]);

        let newR: number, newG: number, newB: number;

        if (isMono) {
          const lum = 0.299 * curR + 0.587 * curG + 0.114 * curB;
          const val = lum >= threshold ? 255 : 0;
          newR = newG = newB = val;
        } else if (isGray4) {
          const lum = 0.299 * curR + 0.587 * curG + 0.114 * curB;
          const step = Math.round(lum / 17);
          const val = clamp(step * 17);
          newR = newG = newB = val;
        } else if (isGray8) {
          const lum = Math.round(0.299 * curR + 0.587 * curG + 0.114 * curB);
          newR = newG = newB = clamp(lum);
        } else if (mode === 'rgb666') {
          newR = Math.round(Math.round(curR / 4.0476) * 4.0476);
          newG = Math.round(Math.round(curG / 4.0476) * 4.0476);
          newB = Math.round(Math.round(curB / 4.0476) * 4.0476);
        } else if (isRetroPalette(mode)) {
          const pal = RETRO_PALETTES[mode].colors;
          const { color } = findClosestPaletteColor(curR, curG, curB, pal);
          newR = color.r;
          newG = color.g;
          newB = color.b;
        } else {
          // RGB565 / BGR565
          const r5 = Math.round((curR * 31) / 255);
          const g6 = Math.round((curG * 63) / 255);
          const b5 = Math.round((curB * 31) / 255);

          newR = Math.round((r5 * 255) / 31);
          newG = Math.round((g6 * 255) / 63);
          newB = Math.round((b5 * 255) / 31);
        }

        const errR = curR - newR;
        const errG = curG - newG;
        const errB = curB - newB;

        const outIdx = i * 4;
        output[outIdx] = newR;
        output[outIdx + 1] = newG;
        output[outIdx + 2] = newB;

        // Distribute error
        if (isAtkinson) {
          const addErr = (nx: number, ny: number) => {
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const ni = ny * width + nx;
              rBuffer[ni] += (errR * 1) / 8;
              gBuffer[ni] += (errG * 1) / 8;
              bBuffer[ni] += (errB * 1) / 8;
            }
          };
          addErr(x + 1, y);
          addErr(x + 2, y);
          addErr(x - 1, y + 1);
          addErr(x, y + 1);
          addErr(x + 1, y + 1);
          addErr(x, y + 2);
        } else {
          // Floyd-Steinberg
          const addErr = (nx: number, ny: number, weight: number) => {
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const ni = ny * width + nx;
              rBuffer[ni] += (errR * weight) / 16;
              gBuffer[ni] += (errG * weight) / 16;
              bBuffer[ni] += (errB * weight) / 16;
            }
          };
          addErr(x + 1, y, 7);
          addErr(x - 1, y + 1, 3);
          addErr(x, y + 1, 5);
          addErr(x + 1, y + 1, 1);
        }
      }
    }
    return output;
  }

  // Ordered Bayer or None
  const hasBayer = ditherType === 'bayer4' || ditherType === 'bayer8';
  const bayerMatrix = ditherType === 'bayer4' ? BAYER_4X4 : BAYER_8X8;
  const bayerSize = ditherType === 'bayer4' ? 4 : 8;
  const bayerDiv = ditherType === 'bayer4' ? 16 : 64;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      output[idx + 3] = pixels[idx + 3];

      let ditherOffset = 0;
      if (hasBayer) {
        const matrixVal = bayerMatrix[y % bayerSize][x % bayerSize];
        ditherOffset = (matrixVal / bayerDiv - 0.5);
      }

      if (isMono) {
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        let finalLum = lum;
        if (hasBayer) {
          finalLum += ditherOffset * 64;
        }
        const val = finalLum >= threshold ? 255 : 0;
        output[idx] = output[idx + 1] = output[idx + 2] = val;
      } else if (isGray4) {
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const adj = lum / 17 + (hasBayer ? ditherOffset : 0);
        const step = clamp(Math.round(adj), 0, 15);
        const val = step * 17;
        output[idx] = output[idx + 1] = output[idx + 2] = val;
      } else if (isGray8) {
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        output[idx] = output[idx + 1] = output[idx + 2] = clamp(Math.round(lum));
      } else if (mode === 'rgb666') {
        const rAdj = (r / 255) * 63 + (hasBayer ? ditherOffset : 0);
        const gAdj = (g / 255) * 63 + (hasBayer ? ditherOffset : 0);
        const bAdj = (b / 255) * 63 + (hasBayer ? ditherOffset : 0);
        output[idx] = Math.round((clamp(Math.round(rAdj), 0, 63) * 255) / 63);
        output[idx + 1] = Math.round((clamp(Math.round(gAdj), 0, 63) * 255) / 63);
        output[idx + 2] = Math.round((clamp(Math.round(bAdj), 0, 63) * 255) / 63);
      } else if (isRetroPalette(mode)) {
        const pal = RETRO_PALETTES[mode].colors;
        const bayerShift = hasBayer ? ditherOffset * 48 : 0;
        const rAdj = clamp(r + bayerShift);
        const gAdj = clamp(g + bayerShift);
        const bAdj = clamp(b + bayerShift);
        const { color } = findClosestPaletteColor(rAdj, gAdj, bAdj, pal);
        output[idx] = color.r;
        output[idx + 1] = color.g;
        output[idx + 2] = color.b;
      } else {
        // RGB565 / BGR565
        const rAdj = (r / 255) * 31 + (hasBayer ? ditherOffset : 0);
        const gAdj = (g / 255) * 63 + (hasBayer ? ditherOffset : 0);
        const bAdj = (b / 255) * 31 + (hasBayer ? ditherOffset : 0);

        const r5 = clamp(Math.round(rAdj), 0, 31);
        const g6 = clamp(Math.round(gAdj), 0, 63);
        const b5 = clamp(Math.round(bAdj), 0, 31);

        output[idx] = Math.round((r5 * 255) / 31);
        output[idx + 1] = Math.round((g6 * 255) / 63);
        output[idx + 2] = Math.round((b5 * 255) / 31);
      }
    }
  }

  return output;
}
