export interface DecodedGifFrame {
  index: number;
  bitmap: ImageBitmap;
  durationMs: number;
  width: number;
  height: number;
}

export interface DecodedGifResult {
  isAnimated: boolean;
  frameCount: number;
  width: number;
  height: number;
  totalDurationMs: number;
  averageFps: number;
  frames: DecodedGifFrame[];
}

/**
 * Check if a file or buffer has GIF87a or GIF89a header
 */
export async function isGifFile(fileOrBlob: Blob): Promise<boolean> {
  if (fileOrBlob.type === 'image/gif') return true;
  try {
    const slice = fileOrBlob.slice(0, 6);
    const buf = await slice.arrayBuffer();
    const bytes = new Uint8Array(buf);
    const header = String.fromCharCode(...bytes);
    return header === 'GIF87a' || header === 'GIF89a';
  } catch {
    return false;
  }
}

/**
 * Decodes an animated GIF into individual frames with exact duration metadata.
 * Uses high-performance native Chromium ImageDecoder API.
 */
export async function decodeGifAnimation(fileOrBlob: Blob): Promise<DecodedGifResult> {
  const isGif = await isGifFile(fileOrBlob);
  if (!isGif) {
    throw new Error('El archivo seleccionado no es un formato GIF válido.');
  }

  // Check if browser supports modern ImageDecoder
  if (typeof (window as any).ImageDecoder !== 'undefined') {
    const ImageDecoderClass = (window as any).ImageDecoder;
    const decoder = new ImageDecoderClass({
      data: fileOrBlob.stream(),
      type: 'image/gif'
    });

    await decoder.tracks.ready;
    const track = decoder.tracks.selectedTrack;
    const frameCount = track ? track.frameCount : 1;

    const frames: DecodedGifFrame[] = [];
    let totalDurationMs = 0;
    let width = 0;
    let height = 0;

    for (let i = 0; i < frameCount; i++) {
      const decodedFrame = await decoder.decode({ frameIndex: i });
      const img = decodedFrame.image;
      
      width = img.displayWidth || img.codedWidth || width;
      height = img.displayHeight || img.codedHeight || height;

      // Duration is in microseconds, convert to ms (min 20ms = max 50fps standard)
      const durationMs = Math.max(20, Math.round((img.duration || 100000) / 1000));
      totalDurationMs += durationMs;

      // Transfer ImageBitmap or render to an offscreen bitmap
      const offscreen = new OffscreenCanvas(width, height);
      const ctx = offscreen.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const bitmap = offscreen.transferToImageBitmap();

      frames.push({
        index: i,
        bitmap,
        durationMs,
        width,
        height
      });

      img.close();
    }

    const avgFps = frames.length > 0 && totalDurationMs > 0
      ? Math.max(1, Math.round((frames.length / (totalDurationMs / 1000))))
      : 10;

    return {
      isAnimated: frames.length > 1,
      frameCount: frames.length,
      width,
      height,
      totalDurationMs,
      averageFps: avgFps,
      frames
    };
  }

  // Fallback for environments without ImageDecoder: load first frame with standard Image
  const imgUrl = URL.createObjectURL(fileOrBlob);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Error al cargar imagen GIF'));
      img.src = imgUrl;
    });

    const offscreen = new OffscreenCanvas(img.naturalWidth, img.naturalHeight);
    const ctx = offscreen.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const bitmap = offscreen.transferToImageBitmap();

    return {
      isAnimated: false,
      frameCount: 1,
      width: img.naturalWidth,
      height: img.naturalHeight,
      totalDurationMs: 100,
      averageFps: 10,
      frames: [{
        index: 0,
        bitmap,
        durationMs: 100,
        width: img.naturalWidth,
        height: img.naturalHeight
      }]
    };
  } finally {
    URL.revokeObjectURL(imgUrl);
  }
}
