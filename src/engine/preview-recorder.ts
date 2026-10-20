/**
 * Export and record animated video previews and still images from BitMapper Studio
 */

export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        resolve(false);
        return;
      }
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        resolve(true);
      } catch (err) {
        console.error('Error al copiar al portapapeles:', err);
        resolve(false);
      }
    }, 'image/png');
  });
}

export function downloadCanvasImage(canvas: HTMLCanvasElement, filename: string = 'bitmapper_preview.png'): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Record an animated sequence from the canvas and return a playable animated video/WebM Blob
 */
export async function recordCanvasAnimation(
  canvas: HTMLCanvasElement,
  renderFrame: (index: number) => Promise<void> | void,
  totalFrames: number,
  fps: number = 15,
  onProgress?: (progress0to100: number) => void
): Promise<Blob> {
  if (totalFrames <= 0) {
    throw new Error('No hay fotogramas para grabar.');
  }

  // Use MediaRecorder on canvas stream
  const stream = canvas.captureStream(0); // 0 = manual frame requests via requestFrame()
  const track = stream.getVideoTracks()[0];
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
    : 'video/webm';

  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 5000000 });
  const recordedChunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  const recordingPromise = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      const fullBlob = new Blob(recordedChunks, { type: 'video/webm' });
      resolve(fullBlob);
    };
    recorder.onerror = (e) => reject(e);
  });

  recorder.start();

  const delayMs = Math.round(1000 / Math.max(1, fps));

  for (let i = 0; i < totalFrames; i++) {
    await renderFrame(i);
    if ((track as any).requestFrame) {
      (track as any).requestFrame();
    }
    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalFrames) * 100));
    }
    await new Promise((r) => setTimeout(r, delayMs));
  }

  recorder.stop();
  return recordingPromise;
}
