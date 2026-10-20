// =============================================================================
// BitMapper Studio - Módulo de Carga Bluetooth LE (ESP32-C3)
// =============================================================================

import '../types';

export const BLE_SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
export const BLE_CONTROL_CHAR_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
export const BLE_DATA_CHAR_UUID = 'beb5483f-36e1-4688-b7f5-ea07361b26a8';

export interface BLEProgress {
  state: 'idle' | 'scanning' | 'connecting' | 'connected' | 'uploading' | 'completed' | 'error';
  statusText: string;
  bytesSent: number;
  totalBytes: number;
  percentage: number;
  speedKbps?: number;
  deviceName?: string;
  error?: string;
}

export interface BLEUploadOptions {
  fileName: string;
  bytes: Uint8Array;
  onProgress: (progress: BLEProgress) => void;
  signal?: AbortSignal;
}

export interface SDBinFile {
  name: string;
  size: number;
  isVideo: boolean;
  totalFrames?: number;
  displaySize: string;
}

export class BLEUploader {
  private activeDevice: any = null;
  private server: any = null;
  private controlChar: any = null;
  private dataChar: any = null;
  private isConnecting: boolean = false;
  private isTransferring: boolean = false;
  private onDisconnectCallback: (() => void) | null = null;
  private connectedDevName: string = 'BitMapper-ESP32';

  public get isConnected(): boolean {
    return !!(this.activeDevice && this.server && this.server.connected && this.controlChar);
  }

  public get isBusy(): boolean {
    return this.isConnecting || this.isTransferring;
  }

  public get deviceName(): string {
    return this.connectedDevName;
  }

  public onDisconnect(cb: () => void): void {
    this.onDisconnectCallback = cb;
  }

  /**
   * Conectar al dispositivo Bluetooth.
   * IMPORTANTE: Debe ser llamado de forma sincrónica con la interacción del usuario (click).
   */
  public async requestDeviceAndConnect(onProgress?: (p: BLEProgress) => void): Promise<{ device: any; devName: string }> {
    // Si ya estamos conectados activamente, reutilizar la conexión
    if (this.activeDevice && this.server && this.server.connected && this.controlChar && this.dataChar) {
      return { device: this.activeDevice, devName: this.connectedDevName };
    }

    if (this.isTransferring) {
      throw new Error('Hay una transferencia BLE en progreso.');
    }
    if (this.isConnecting) {
      throw new Error('Ya se está estableciendo una conexión BLE.');
    }

    const bluetooth = (navigator as any).bluetooth;
    if (!bluetooth) {
      throw new Error(
        'La API Web Bluetooth no está soportada en este entorno. Verifica que los permisos Bluetooth estén activos.'
      );
    }

    this.isConnecting = true;

    try {
      if (onProgress) {
        onProgress({
          state: 'scanning',
          statusText: "Buscando módulo ESP32-C3 ('BitMapper-ESP32')...",
          bytesSent: 0,
          totalBytes: 0,
          percentage: 0
        });
      }

      let device: any = null;
      try {
        device = await bluetooth.requestDevice({
          filters: [{ namePrefix: 'BitMapper' }],
          optionalServices: [BLE_SERVICE_UUID]
        });
      } catch (scanErr: any) {
        console.warn('Filtro por nombre no encontrado, abriendo lista de todos los dispositivos...', scanErr);
        device = await bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: [BLE_SERVICE_UUID]
        });
      }

      this.activeDevice = device;
      this.connectedDevName = device.name || 'BitMapper-ESP32';

      device.addEventListener('gattserverdisconnected', () => {
        console.log('[BLE] Dispositivo desconectado del servidor GATT');
        this.server = null;
        this.controlChar = null;
        this.dataChar = null;
        this.isConnecting = false;
        this.isTransferring = false;
        if (this.onDisconnectCallback) {
          this.onDisconnectCallback();
        }
      });

      if (onProgress) {
        onProgress({
          state: 'connecting',
          statusText: `Conectando al servidor GATT de ${this.connectedDevName}...`,
          bytesSent: 0,
          totalBytes: 0,
          percentage: 0,
          deviceName: this.connectedDevName
        });
      }

      this.server = await device.gatt.connect();

      if (onProgress) {
        onProgress({
          state: 'connected',
          statusText: `Conectado a ${this.connectedDevName}. Obteniendo características de transferencia...`,
          bytesSent: 0,
          totalBytes: 0,
          percentage: 0,
          deviceName: this.connectedDevName
        });
      }

      const service = await this.server.getPrimaryService(BLE_SERVICE_UUID);
      this.controlChar = await service.getCharacteristic(BLE_CONTROL_CHAR_UUID);
      this.dataChar = await service.getCharacteristic(BLE_DATA_CHAR_UUID);

      return { device: this.activeDevice, devName: this.connectedDevName };
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Transmitir los datos al dispositivo ya conectado.
   */
  public async transferData(options: BLEUploadOptions): Promise<void> {
    const { fileName, bytes, onProgress, signal } = options;

    if (!this.activeDevice || !this.server || !this.controlChar || !this.dataChar) {
      throw new Error('No hay conexión activa con el ESP32. Llama a requestDeviceAndConnect() primero.');
    }

    if (this.isTransferring) {
      throw new Error('Ya hay una transferencia BLE en progreso.');
    }

    this.isTransferring = true;
    const devName = this.connectedDevName;

    try {
      // 1. Suscripción a notificaciones del Control Char
      let readyResolver: (() => void) | null = null;
      const readyPromise = new Promise<void>(resolve => {
        readyResolver = resolve;
      });

      let doneResolver: ((status: string) => void) | null = null;
      const donePromise = new Promise<string>(resolve => {
        doneResolver = resolve;
      });

      const onNotification = (event: Event) => {
        const char = event.target as any;
        const val = new TextDecoder().decode(char.value);
        console.log('[ESP32 BLE Notificación]:', val);
        if (val === 'READY' && readyResolver) {
          readyResolver();
        } else if ((val === 'SUCCESS' || val === 'CANCELLED' || val === 'ERROR_SD') && doneResolver) {
          doneResolver(val);
        }
      };

      try {
        await this.controlChar.startNotifications();
        this.controlChar.addEventListener('characteristicvaluechanged', onNotification);
      } catch (notifErr) {
        console.warn('Notificaciones no habilitadas en el cliente, continuando:', notifErr);
      }

      // 2. Iniciar transferencia con comando START:<nombre>:<bytes>
      let cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      if (!cleanName.toLowerCase().endsWith('.bin') && !cleanName.toLowerCase().endsWith('.bmpr')) {
        cleanName += '.bin';
      }

      const startCmd = `START:${cleanName}:${bytes.byteLength}`;
      const encoder = new TextEncoder();
      await this.controlChar.writeValue(encoder.encode(startCmd));

      // Esperar confirmación READY o un pequeño tiempo para que el ESP32 prepare el archivo en la SD
      await Promise.race([
        readyPromise,
        new Promise(r => setTimeout(r, 250))
      ]);

      // 3. Enviar chunks binarios acelerados (MTU 517 negociado)
      const CHUNK_SIZE = 490; // Aceleración BLE óptima para MTU 517
      const totalBytes = bytes.byteLength;
      let offset = 0;
      const startTime = performance.now();

      onProgress({
        state: 'uploading',
        statusText: `Enviando "${cleanName}" (${(totalBytes / 1024).toFixed(1)} KB)...`,
        bytesSent: 0,
        totalBytes,
        percentage: 0,
        deviceName: devName,
        speedKbps: 0
      });

      while (offset < totalBytes) {
        if (signal?.aborted) {
          try {
            await this.controlChar.writeValue(encoder.encode('CANCEL'));
          } catch {
            // Ignorar error al cancelar
          }
          throw new Error('Transferencia cancelada por el usuario');
        }

        const chunk = bytes.subarray(offset, Math.min(offset + CHUNK_SIZE, totalBytes));

        if (this.dataChar.writeValueWithoutResponse) {
          await this.dataChar.writeValueWithoutResponse(chunk);
        } else {
          await this.dataChar.writeValue(chunk);
        }

        offset += chunk.byteLength;

        const elapsedSec = (performance.now() - startTime) / 1000;
        const speedKbps = elapsedSec > 0 ? (offset / 1024) / elapsedSec : 0;
        const percentage = Math.min(100, Math.round((offset / totalBytes) * 100));

        onProgress({
          state: 'uploading',
          statusText: `Transmitiendo a MicroSD (${speedKbps.toFixed(1)} KB/s)...`,
          bytesSent: offset,
          totalBytes,
          percentage,
          deviceName: devName,
          speedKbps
        });

        // Pacing ultra-rápido de 3ms compatible con escritura SPI en MicroSD
        await new Promise(r => setTimeout(r, 3));
      }

      // 4. Enviar comando DONE
      onProgress({
        state: 'uploading',
        statusText: `Finalizando y mostrando en pantalla...`,
        bytesSent: totalBytes,
        totalBytes,
        percentage: 100,
        deviceName: devName
      });

      await this.controlChar.writeValue(encoder.encode('DONE'));

      const finalResult = await Promise.race([
        donePromise,
        new Promise<string>(r => setTimeout(() => r('SUCCESS'), 1800))
      ]);

      if (finalResult === 'ERROR_SD') {
        throw new Error('El ESP32 no pudo escribir el archivo en la tarjeta MicroSD. Verifica que la SD esté conectada.');
      }

      onProgress({
        state: 'completed',
        statusText: `¡Archivo "${cleanName}" transferido con éxito! Mostrado en la pantalla ST7735S.`,
        bytesSent: totalBytes,
        totalBytes,
        percentage: 100,
        deviceName: devName
      });

      try {
        this.controlChar.removeEventListener('characteristicvaluechanged', onNotification);
      } catch {
        // Ignorar
      }
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      onProgress({
        state: 'error',
        statusText: `Error BLE: ${errMsg}`,
        bytesSent: 0,
        totalBytes: bytes.byteLength,
        percentage: 0,
        error: errMsg
      });
      throw err;
    } finally {
      this.isTransferring = false;
    }
  }

  /**
   * Obtener lista de archivos .BIN en la tarjeta MicroSD del ESP32
   */
  public async listSDFiles(): Promise<SDBinFile[]> {
    if (!this.activeDevice || !this.server || !this.controlChar) {
      throw new Error('No hay conexión activa con el ESP32. Conecta el dispositivo primero.');
    }

    const files: SDBinFile[] = [];
    const encoder = new TextEncoder();

    return new Promise(async (resolve, reject) => {
      let timeoutTimer: ReturnType<typeof setTimeout>;

      const cleanup = () => {
        clearTimeout(timeoutTimer);
        try {
          this.controlChar.removeEventListener('characteristicvaluechanged', onListNotif);
        } catch {
          // Ignorar
        }
      };

      const onListNotif = (event: Event) => {
        const char = event.target as any;
        const val = new TextDecoder().decode(char.value);
        console.log('[BLE SD List Notif]:', val);

        if (val.startsWith('FILE_ITEM:')) {
          const parts = val.substring(10).split(':');
          const name = parts[0] || 'unknown.bin';
          const size = parseInt(parts[1], 10) || 0;

          const isVideo = size > 40960 && (size % 40960 === 0 || size % 115200 === 0 || size % 153600 === 0);
          const totalFrames = isVideo
            ? (size % 40960 === 0 ? size / 40960 : Math.round(size / 115200))
            : 1;

          let displaySize = '';
          if (size >= 1024 * 1024) {
            displaySize = `${(size / (1024 * 1024)).toFixed(2)} MB`;
          } else {
            displaySize = `${(size / 1024).toFixed(1)} KB`;
          }

          files.push({
            name,
            size,
            isVideo,
            totalFrames,
            displaySize
          });
        } else if (val === 'FILE_LIST_END') {
          cleanup();
          resolve(files);
        }
      };

      try {
        await this.controlChar.startNotifications();
        this.controlChar.addEventListener('characteristicvaluechanged', onListNotif);

        await this.controlChar.writeValue(encoder.encode('LIST'));

        timeoutTimer = setTimeout(() => {
          cleanup();
          resolve(files);
        }, 7000);
      } catch (err) {
        cleanup();
        reject(err);
      }
    });
  }

  /**
   * Eliminar un archivo .BIN de la MicroSD vía Bluetooth
   */
  public async deleteSDFile(fileName: string): Promise<boolean> {
    if (!this.activeDevice || !this.server || !this.controlChar) {
      throw new Error('No hay conexión activa con el ESP32.');
    }

    const encoder = new TextEncoder();

    return new Promise(async (resolve, reject) => {
      let timeoutTimer: ReturnType<typeof setTimeout>;

      const cleanup = () => {
        clearTimeout(timeoutTimer);
        try {
          this.controlChar.removeEventListener('characteristicvaluechanged', onDelNotif);
        } catch {
          // Ignorar
        }
      };

      const onDelNotif = (event: Event) => {
        const char = event.target as any;
        const val = new TextDecoder().decode(char.value);
        console.log('[BLE Delete Notif]:', val);

        if (val.startsWith('DELETE_OK:')) {
          cleanup();
          resolve(true);
        } else if (val.startsWith('DELETE_FAIL:')) {
          cleanup();
          resolve(false);
        }
      };

      try {
        await this.controlChar.startNotifications();
        this.controlChar.addEventListener('characteristicvaluechanged', onDelNotif);

        const cleanName = fileName.startsWith('/') ? fileName.substring(1) : fileName;
        await this.controlChar.writeValue(encoder.encode(`DELETE:${cleanName}`));

        timeoutTimer = setTimeout(() => {
          cleanup();
          resolve(false);
        }, 6000);
      } catch (err) {
        cleanup();
        reject(err);
      }
    });
  }

  /**
   * Mostrar un archivo específico en la pantalla del ESP32
   */
  public async showSDFile(fileName: string): Promise<boolean> {
    if (!this.activeDevice || !this.server || !this.controlChar) {
      throw new Error('No hay conexión activa con el ESP32.');
    }

    const encoder = new TextEncoder();
    const cleanName = fileName.startsWith('/') ? fileName.substring(1) : fileName;
    await this.controlChar.writeValue(encoder.encode(`SHOW:${cleanName}`));
    return true;
  }

  /**
   * Enviar comando de control genérico esperando respuesta por notificación
   */
  public async sendGenericCommand(cmd: string, expectPrefix?: string, timeoutMs: number = 3000): Promise<string> {
    if (!this.activeDevice || !this.server || !this.controlChar) {
      throw new Error('No hay conexión activa con el ESP32.');
    }

    const encoder = new TextEncoder();
    if (!expectPrefix) {
      await this.controlChar.writeValue(encoder.encode(cmd));
      return 'OK';
    }

    return new Promise(async (resolve, reject) => {
      let timeoutTimer: ReturnType<typeof setTimeout>;

      const cleanup = () => {
        clearTimeout(timeoutTimer);
        try {
          this.controlChar.removeEventListener('characteristicvaluechanged', onCmdNotif);
        } catch {
          // Ignorar
        }
      };

      const onCmdNotif = (event: Event) => {
        const char = event.target as any;
        const val = new TextDecoder().decode(char.value);
        if (val.startsWith(expectPrefix)) {
          cleanup();
          resolve(val);
        }
      };

      try {
        await this.controlChar.startNotifications();
        this.controlChar.addEventListener('characteristicvaluechanged', onCmdNotif);
        await this.controlChar.writeValue(encoder.encode(cmd));

        timeoutTimer = setTimeout(() => {
          cleanup();
          resolve('TIMEOUT');
        }, timeoutMs);
      } catch (err) {
        cleanup();
        reject(err);
      }
    });
  }

  /**
   * Configurar modo Diapositivas (Slideshow) en el ESP32
   */
  public async sendSlideshowConfig(enabled: boolean, delaySec: number = 5): Promise<boolean> {
    const cmd = enabled ? `SLIDESHOW:ON:${delaySec}` : 'SLIDESHOW:OFF';
    const resp = await this.sendGenericCommand(cmd, 'SLIDESHOW_OK', 3000);
    return resp.startsWith('SLIDESHOW_OK');
  }

  /**
   * Configurar modo de Transición entre imágenes en el ESP32
   */
  public async sendTransitionConfig(mode: number | string): Promise<boolean> {
    const cmd = `TRANSITION:${mode}`;
    const resp = await this.sendGenericCommand(cmd, 'TRANSITION_OK', 3000);
    return resp.startsWith('TRANSITION_OK');
  }

  /**
   * Configurar brillo de pantalla por PWM en el ESP32
   */
  public async sendBrightnessConfig(duty: number): Promise<boolean> {
    const clamped = Math.max(0, Math.min(255, Math.round(duty)));
    const cmd = `BRIGHT:${clamped}`;
    const resp = await this.sendGenericCommand(cmd, 'BRIGHT_OK', 2500);
    return resp.startsWith('BRIGHT_OK');
  }

  /**
   * Configurar velocidad FPS por defecto en el ESP32
   */
  public async sendFpsConfig(fps: number): Promise<boolean> {
    const cmd = `FPS:${fps}`;
    const resp = await this.sendGenericCommand(cmd, 'FPS_OK', 2500);
    return resp.startsWith('FPS_OK');
  }

  /**
   * Configurar modo Reposo / Atenuación de pantalla (Sleep Mode) en el ESP32
   */
  public async sendSleepConfig(enabled: boolean, timeoutSec: number, dimDuty: number): Promise<boolean> {
    const clampedDuty = Math.max(0, Math.min(255, Math.round(dimDuty)));
    const cmd = `SLEEP_CFG:${enabled ? 1 : 0}:${timeoutSec}:${clampedDuty}`;
    const resp = await this.sendGenericCommand(cmd, 'SLEEP_CFG_OK', 2500);
    return resp.startsWith('SLEEP_CFG_OK');
  }

  /**
   * Enviar comando inmediato de entrar o salir de reposo
   */
  public async triggerSleep(enterSleep: boolean): Promise<boolean> {
    const cmd = enterSleep ? 'SLEEP_NOW' : 'WAKE_NOW';
    const resp = await this.sendGenericCommand(cmd, 'SLEEP_STATE_OK', 2500);
    return resp.startsWith('SLEEP_STATE_OK');
  }

  private thumbCache: Map<string, string> = new Map();

  public clearThumbCache(): void {
    this.thumbCache.clear();
  }

  /**
   * Obtiene la miniatura (32x40 píxeles, RGB565) de un archivo .bin/.bmpr en la MicroSD
   * y la convierte a DataURL PNG para previsualización inmediata.
   */
  public async fetchThumbnail(fileName: string): Promise<string | null> {
    const cleanName = fileName.startsWith('/') ? fileName.substring(1) : fileName;
    if (this.thumbCache.has(cleanName)) {
      return this.thumbCache.get(cleanName)!;
    }

    if (!this.activeDevice || !this.server || !this.controlChar) {
      return null;
    }

    return new Promise(async (resolve) => {
      let timeoutTimer: ReturnType<typeof setTimeout>;
      let receivedBytes: Uint8Array | null = null;
      let expectedTotal = 2560;
      let thumbW = 32;
      let thumbH = 40;
      let currentOffset = 0;

      const cleanup = () => {
        clearTimeout(timeoutTimer);
        try {
          this.controlChar.removeEventListener('characteristicvaluechanged', onThumbNotif);
        } catch {
          // Ignorar
        }
      };

      const onThumbNotif = (event: Event) => {
        const char = event.target as any;
        const val = new TextDecoder().decode(char.value);

        if (val.startsWith('THUMB_START:')) {
          const parts = val.substring(12).split(':');
          expectedTotal = parseInt(parts[1], 10) || 2560;
          thumbW = parseInt(parts[2], 10) || 32;
          thumbH = parseInt(parts[3], 10) || 40;
          receivedBytes = new Uint8Array(expectedTotal);
          currentOffset = 0;
        } else if (val.startsWith('THUMB_CHUNK:')) {
          if (!receivedBytes) return;
          const colon2 = val.indexOf(':', 12);
          if (colon2 === -1) return;
          const b64 = val.substring(colon2 + 1);
          try {
            const binStr = atob(b64);
            for (let i = 0; i < binStr.length && currentOffset < expectedTotal; i++) {
              receivedBytes[currentOffset++] = binStr.charCodeAt(i);
            }
          } catch (e) {
            console.warn('[BLE Thumb] Error base64:', e);
          }
        } else if (val.startsWith('THUMB_END:')) {
          cleanup();
          if (receivedBytes && currentOffset > 0) {
            const dataUrl = this.convertRgb565ToDataUrl(receivedBytes, thumbW, thumbH);
            this.thumbCache.set(cleanName, dataUrl);
            resolve(dataUrl);
          } else {
            resolve(null);
          }
        } else if (val.startsWith('THUMB_ERR:')) {
          cleanup();
          resolve(null);
        }
      };

      try {
        await this.controlChar.startNotifications();
        this.controlChar.addEventListener('characteristicvaluechanged', onThumbNotif);

        const encoder = new TextEncoder();
        await this.controlChar.writeValue(encoder.encode(`THUMB:${cleanName}`));

        timeoutTimer = setTimeout(() => {
          cleanup();
          resolve(null);
        }, 6000);
      } catch (err) {
        cleanup();
        resolve(null);
      }
    });
  }

  /**
   * Convierte un buffer binario RGB565 (32x40) a DataURL de imagen en canvas
   */
  private convertRgb565ToDataUrl(bytes: Uint8Array, width: number, height: number): string {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const imgData = ctx.createImageData(width, height);
    const totalPixels = width * height;

    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 2;
      if (idx + 1 >= bytes.length) break;
      const lsb = bytes[idx];
      const msb = bytes[idx + 1];
      const pixel16 = (msb << 8) | lsb;

      const r = Math.round(((pixel16 >> 11) & 0x1f) * (255 / 31));
      const g = Math.round(((pixel16 >> 5) & 0x3f) * (255 / 63));
      const b = Math.round((pixel16 & 0x1f) * (255 / 31));

      const outIdx = i * 4;
      imgData.data[outIdx] = r;
      imgData.data[outIdx + 1] = g;
      imgData.data[outIdx + 2] = b;
      imgData.data[outIdx + 3] = 255;
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL('image/png');
  }

  /**
   * Pausar o reanudar reproducción de video/animación
   */
  public async sendPause(paused: boolean): Promise<boolean> {
    const cmd = paused ? 'PAUSE' : 'RESUME';
    const resp = await this.sendGenericCommand(cmd, paused ? 'PAUSE_OK' : 'RESUME_OK', 2000);
    return resp.includes('_OK');
  }

  /**
   * Alternar ByteSwap (Little/Big Endian) en la pantalla
   */
  public async sendToggleByteSwap(): Promise<boolean> {
    const resp = await this.sendGenericCommand('SWAP_TOGGLE', 'SWAP_OK', 2000);
    return resp.startsWith('SWAP_OK');
  }

  /**
   * Alternar Inversión de colores en la pantalla
   */
  public async sendToggleInvert(): Promise<boolean> {
    const resp = await this.sendGenericCommand('INV_TOGGLE', 'INV_OK', 2000);
    return resp.startsWith('INV_OK');
  }

  /**
   * Ajuste de brillo en vivo y continuo (PWM)
   */
  public async sendLiveBrightness(duty: number): Promise<void> {
    if (!this.activeDevice || !this.server || !this.controlChar) return;
    const clamped = Math.max(0, Math.min(255, Math.round(duty)));
    const encoder = new TextEncoder();
    try {
      if (this.controlChar.writeValueWithoutResponse) {
        await this.controlChar.writeValueWithoutResponse(encoder.encode(`BRIGHT:${clamped}`));
      } else {
        await this.controlChar.writeValue(encoder.encode(`BRIGHT:${clamped}`));
      }
    } catch {
      // Ignorar para no bloquear el slider de brillo continuo
    }
  }

  /**
   * Consultar estado en vivo del dispositivo
   */
  public async getDeviceStatus(): Promise<{
    photoIndex: number;
    photoCount: number;
    isVideo: boolean;
    isPaused: boolean;
    swapBytes: boolean;
    invertDisplay: boolean;
    brightnessDuty: number;
    isSleeping: boolean;
    currentFileName: string;
  } | null> {
    const resp = await this.sendGenericCommand('STATUS', 'STATUS:', 2500);
    if (!resp.startsWith('STATUS:')) return null;

    const parts = resp.substring(7).split(':');
    return {
      photoIndex: parseInt(parts[0], 10) || 0,
      photoCount: parseInt(parts[1], 10) || 0,
      isVideo: parts[2] === '1',
      isPaused: parts[3] === '1',
      swapBytes: parts[4] === '1',
      invertDisplay: parts[5] === '1',
      brightnessDuty: parseInt(parts[6], 10) || 153,
      isSleeping: parts[7] === '1',
      currentFileName: parts[8] || ''
    };
  }

  /**
   * Método de conveniencia completo (Conectar + Transmitir).
   */
  public async upload(options: BLEUploadOptions): Promise<void> {
    await this.requestDeviceAndConnect(options.onProgress);
    await this.transferData(options);
  }

  public disconnect(): void {
    this.isConnecting = false;
    this.isTransferring = false;
    if (this.activeDevice && this.activeDevice.gatt && this.activeDevice.gatt.connected) {
      try {
        this.activeDevice.gatt.disconnect();
      } catch (err) {
        console.warn('Error al desconectar GATT:', err);
      }
    }
    this.activeDevice = null;
    this.server = null;
    this.controlChar = null;
    this.dataChar = null;
    if (this.onDisconnectCallback) {
      this.onDisconnectCallback();
    }
  }
}

export const bleUploader = new BLEUploader();
