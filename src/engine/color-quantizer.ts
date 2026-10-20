import { EncodeOptions, EncodedBitmap, DataType } from '../types';

/**
 * Encode an image into raw binary buffer and structured array elements.
 */
export function encodeBitmap(
  rgbaPixels: Uint8ClampedArray,
  width: number,
  height: number,
  options: EncodeOptions = {}
): EncodedBitmap {
  const {
    colorFormat = 'rgb565',
    endian = 'big',
    swapBytes = false,
    invert = false
  } = options;

  let bytes: Uint8Array;
  const values: number[] = [];
  let dataType: DataType = 'uint16_t';

  if (colorFormat === 'rgb565' || colorFormat === 'bgr565') {
    dataType = 'uint16_t';
    const totalPixels = width * height;
    bytes = new Uint8Array(totalPixels * 2);
    const isBGR = colorFormat === 'bgr565';

    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      let r = rgbaPixels[idx];
      let g = rgbaPixels[idx + 1];
      let b = rgbaPixels[idx + 2];

      if (invert) {
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      }

      const r5 = (r >> 3) & 0x1f;
      const g6 = (g >> 2) & 0x3f;
      const b5 = (b >> 3) & 0x1f;

      let val16 = isBGR
        ? (b5 << 11) | (g6 << 5) | r5
        : (r5 << 11) | (g6 << 5) | b5;

      let highByte = (val16 >> 8) & 0xff;
      let lowByte = val16 & 0xff;

      if (swapBytes) {
        val16 = (lowByte << 8) | highByte;
        const temp = highByte;
        highByte = lowByte;
        lowByte = temp;
      }

      values.push(val16);

      if (endian === 'big') {
        bytes[i * 2] = highByte;
        bytes[i * 2 + 1] = lowByte;
      } else {
        bytes[i * 2] = lowByte;
        bytes[i * 2 + 1] = highByte;
      }
    }
  } else if (colorFormat === 'rgb888') {
    dataType = 'uint8_t';
    const totalPixels = width * height;
    bytes = new Uint8Array(totalPixels * 3);

    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      let r = rgbaPixels[idx];
      let g = rgbaPixels[idx + 1];
      let b = rgbaPixels[idx + 2];

      if (invert) {
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      }

      bytes[i * 3] = r;
      bytes[i * 3 + 1] = g;
      bytes[i * 3 + 2] = b;

      values.push(r, g, b);
    }
  } else if (colorFormat === 'rgb666') {
    dataType = 'uint8_t';
    const totalPixels = width * height;
    bytes = new Uint8Array(totalPixels * 3);

    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      let r = rgbaPixels[idx];
      let g = rgbaPixels[idx + 1];
      let b = rgbaPixels[idx + 2];

      if (invert) {
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      }

      const r6 = (r >> 2) & 0x3f;
      const g6 = (g >> 2) & 0x3f;
      const b6 = (b >> 2) & 0x3f;

      bytes[i * 3] = r6;
      bytes[i * 3 + 1] = g6;
      bytes[i * 3 + 2] = b6;

      values.push(r6, g6, b6);
    }
  } else if (colorFormat === 'gray8') {
    dataType = 'uint8_t';
    const totalPixels = width * height;
    bytes = new Uint8Array(totalPixels);

    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      const r = rgbaPixels[idx];
      const g = rgbaPixels[idx + 1];
      const b = rgbaPixels[idx + 2];

      let lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      if (invert) lum = 255 - lum;

      bytes[i] = lum;
      values.push(lum);
    }
  } else if (colorFormat === 'gray4') {
    dataType = 'uint8_t';
    const totalPixels = width * height;
    const totalBytes = Math.ceil(totalPixels / 2);
    bytes = new Uint8Array(totalBytes);

    let byteIdx = 0;
    for (let i = 0; i < totalPixels; i += 2) {
      const idx1 = i * 4;
      let lum1 = Math.round(
        0.299 * rgbaPixels[idx1] +
        0.587 * rgbaPixels[idx1 + 1] +
        0.114 * rgbaPixels[idx1 + 2]
      );
      if (invert) lum1 = 255 - lum1;
      const val1 = Math.min(15, Math.floor(lum1 / 16));

      let val2 = 0;
      if (i + 1 < totalPixels) {
        const idx2 = (i + 1) * 4;
        let lum2 = Math.round(
          0.299 * rgbaPixels[idx2] +
          0.587 * rgbaPixels[idx2 + 1] +
          0.114 * rgbaPixels[idx2 + 2]
        );
        if (invert) lum2 = 255 - lum2;
        val2 = Math.min(15, Math.floor(lum2 / 16));
      }

      const packed = (val1 << 4) | val2;
      bytes[byteIdx++] = packed;
      values.push(packed);
    }
  } else if (colorFormat === 'mono1_horizontal') {
    dataType = 'uint8_t';
    const rowBytes = Math.ceil(width / 8);
    const totalBytes = rowBytes * height;
    bytes = new Uint8Array(totalBytes);

    let byteIndex = 0;
    for (let y = 0; y < height; y++) {
      for (let xByte = 0; xByte < rowBytes; xByte++) {
        let currentByte = 0;
        for (let b = 0; b < 8; b++) {
          const x = xByte * 8 + b;
          if (x < width) {
            const idx = (y * width + x) * 4;
            const r = rgbaPixels[idx];
            let isWhite = r > 127;
            if (invert) isWhite = !isWhite;

            if (isWhite) {
              currentByte |= 1 << (7 - b);
            }
          }
        }
        bytes[byteIndex++] = currentByte;
        values.push(currentByte);
      }
    }
  } else {
    // mono1_vertical (SSD1306 Page Mode)
    dataType = 'uint8_t';
    const pages = Math.ceil(height / 8);
    const totalBytes = width * pages;
    bytes = new Uint8Array(totalBytes);

    let byteIndex = 0;
    for (let p = 0; p < pages; p++) {
      for (let x = 0; x < width; x++) {
        let currentByte = 0;
        for (let b = 0; b < 8; b++) {
          const y = p * 8 + b;
          if (y < height) {
            const idx = (y * width + x) * 4;
            const r = rgbaPixels[idx];
            let isWhite = r > 127;
            if (invert) isWhite = !isWhite;

            if (isWhite) {
              currentByte |= 1 << b;
            }
          }
        }
        bytes[byteIndex++] = currentByte;
        values.push(currentByte);
      }
    }
  }

  return {
    bytes,
    values,
    dataType,
    sizeBytes: bytes.length
  };
}
