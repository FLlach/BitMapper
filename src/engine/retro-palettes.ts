import { ColorFormatId } from '../types';

export interface PaletteColor {
  r: number;
  g: number;
  b: number;
  hex: string;
  rgb565: number;
}

export interface RetroPalette {
  id: ColorFormatId;
  name: string;
  category: string;
  description: string;
  bitDepth: number; // 2 or 4
  colors: PaletteColor[];
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return [r, g, b];
}

function makeColor(hex: string): PaletteColor {
  const [r, g, b] = hexToRgb(hex);
  const r5 = (r >> 3) & 0x1f;
  const g6 = (g >> 2) & 0x3f;
  const b5 = (b >> 3) & 0x1f;
  const rgb565 = (r5 << 11) | (g6 << 5) | b5;
  return { r, g, b, hex, rgb565 };
}

export const RETRO_PALETTES: Record<string, RetroPalette> = {
  palette_gameboy: {
    id: 'palette_gameboy',
    name: 'Game Boy Classic (DMG 4 Green)',
    category: 'Retro Palettes',
    description: 'Classic 4-shade greenish palette of the original 1989 Nintendo Game Boy.',
    bitDepth: 2,
    colors: [
      makeColor('#0f380f'), // darkest
      makeColor('#306230'), // dark
      makeColor('#8bac0f'), // light
      makeColor('#9bbc0f')  // lightest
    ]
  },
  palette_gb_pocket: {
    id: 'palette_gb_pocket',
    name: 'Game Boy Pocket (4 Grayscale)',
    category: 'Retro Palettes',
    description: 'Neutral 4-shade true grayscale LCD of Game Boy Pocket.',
    bitDepth: 2,
    colors: [
      makeColor('#141414'),
      makeColor('#545454'),
      makeColor('#a0a0a0'),
      makeColor('#f0f0f0')
    ]
  },
  palette_cga1: {
    id: 'palette_cga1',
    name: 'IBM CGA Palette 1 (High Intensity)',
    category: 'Retro Palettes',
    description: 'Black, Cyan, Magenta, and Bright White from 1981 IBM PC.',
    bitDepth: 2,
    colors: [
      makeColor('#000000'),
      makeColor('#55ffff'),
      makeColor('#ff55ff'),
      makeColor('#ffffff')
    ]
  },
  palette_cga2: {
    id: 'palette_cga2',
    name: 'IBM CGA Palette 2 (High Intensity)',
    category: 'Retro Palettes',
    description: 'Black, Green, Red, and Bright Yellow from 1981 IBM PC.',
    bitDepth: 2,
    colors: [
      makeColor('#000000'),
      makeColor('#55ff55'),
      makeColor('#ff5555'),
      makeColor('#ffff55')
    ]
  },
  palette_c64: {
    id: 'palette_c64',
    name: 'Commodore 64 (16 Colors)',
    category: 'Retro Palettes',
    description: 'Iconic 16-color palette of the legendary Commodore 64 VIC-II.',
    bitDepth: 4,
    colors: [
      makeColor('#000000'), // 0: Black
      makeColor('#ffffff'), // 1: White
      makeColor('#880000'), // 2: Red
      makeColor('#aaffee'), // 3: Cyan
      makeColor('#cc44cc'), // 4: Purple
      makeColor('#00cc55'), // 5: Green
      makeColor('#0000aa'), // 6: Blue
      makeColor('#eeee77'), // 7: Yellow
      makeColor('#dd8855'), // 8: Orange
      makeColor('#664400'), // 9: Brown
      makeColor('#ff7777'), // 10: Light Red
      makeColor('#333333'), // 11: Dark Gray
      makeColor('#777777'), // 12: Gray
      makeColor('#aaff66'), // 13: Light Green
      makeColor('#0088ff'), // 14: Light Blue
      makeColor('#bbbbbb')  // 15: Light Gray
    ]
  },
  palette_pico8: {
    id: 'palette_pico8',
    name: 'PICO-8 Fantasy Console (16 Colors)',
    category: 'Retro Palettes',
    description: 'Warm, highly expressive 16-color palette made famous by PICO-8.',
    bitDepth: 4,
    colors: [
      makeColor('#000000'), // Black
      makeColor('#1d2b53'), // Dark Blue
      makeColor('#7e2553'), // Dark Purple
      makeColor('#008751'), // Dark Green
      makeColor('#ab5236'), // Brown
      makeColor('#5f574f'), // Dark Gray
      makeColor('#c2c3c7'), // Light Gray
      makeColor('#fff1e8'), // White
      makeColor('#ff004d'), // Red
      makeColor('#ffa300'), // Orange
      makeColor('#ffec27'), // Yellow
      makeColor('#00e436'), // Green
      makeColor('#29adff'), // Blue
      makeColor('#83769c'), // Indigo
      makeColor('#ff77a8'), // Pink
      makeColor('#ffccaa')  // Peach
    ]
  },
  palette_zx: {
    id: 'palette_zx',
    name: 'ZX Spectrum (15 Colors)',
    category: 'Retro Palettes',
    description: 'Sinclair ZX Spectrum 15 distinct hardware colors (normal and bright).',
    bitDepth: 4,
    colors: [
      makeColor('#000000'), // Black
      makeColor('#0000d7'), // Blue
      makeColor('#d70000'), // Red
      makeColor('#d700d7'), // Magenta
      makeColor('#00d700'), // Green
      makeColor('#00d7d7'), // Cyan
      makeColor('#d7d700'), // Yellow
      makeColor('#d7d7d7'), // White
      makeColor('#0000ff'), // Bright Blue
      makeColor('#ff0000'), // Bright Red
      makeColor('#ff00ff'), // Bright Magenta
      makeColor('#00ff00'), // Bright Green
      makeColor('#00ffff'), // Bright Cyan
      makeColor('#ffff00'), // Bright Yellow
      makeColor('#ffffff')  // Bright White
    ]
  }
};

/**
 * Checks if a ColorFormatId corresponds to an indexed retro palette
 */
export function isRetroPalette(format: ColorFormatId): boolean {
  return format in RETRO_PALETTES;
}

/**
 * Find the closest color index in a palette using weighted perceptual distance
 */
export function findClosestPaletteColor(
  r: number,
  g: number,
  b: number,
  palette: PaletteColor[]
): { index: number; color: PaletteColor } {
  let minDistance = Infinity;
  let bestIndex = 0;

  for (let i = 0; i < palette.length; i++) {
    const c = palette[i];
    // Perceptual color difference weighting
    const dr = r - c.r;
    const dg = g - c.g;
    const db = b - c.b;
    const dist = 2 * dr * dr + 4 * dg * dg + 3 * db * db;

    if (dist < minDistance) {
      minDistance = dist;
      bestIndex = i;
    }
  }

  return { index: bestIndex, color: palette[bestIndex] };
}
