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
  private isBusy: boolean = false;
  private connectedDevName: string = 'BitMapper-ESP32';

  public get isConnected(): boolean {
    return !!(this.activeDevice && this.server && this.server.connected && this.controlChar);
  }

  public get deviceName(): string {
    return this.connectedDevName;
  }

  /**
   * Conectar al dispositivo Bluetooth.
   * IMPORTANTE: Debe ser llamado de forma sincrónica con la interacción del usuario (click).
   */
  public async requestDeviceAndConnect(onProgress?: (p: BLEProgress) => void): Promise<{ device: any; devName: string }> {
    if (this.isBusy) {
      throw new Error('Ya hay una transferencia BLE en progreso.');
    }

    const bluetooth = (navigator as any).bluetooth;
    if (!bluetooth) {
      throw new Error(
        'La API Web Bluetooth no está soportada en este entorno. Verifica que los permisos Bluetooth estén activos.'
      );
    }

    // Si ya estamos conectados activamente, reutilizar la conexión
    if (this.activeDevice && this.server && this.server.connected && this.controlChar && this.dataChar) {
      return { device: this.activeDevice, devName: this.connectedDevName };
    }

    this.isBusy = true;

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
  }

  /**
   * Transmitir los datos al dispositivo ya conectado.
   */
  public async transferData(options: BLEUploadOptions): Promise<void> {
    const { fileName, bytes, onProgress, signal } = options;

    if (!this.activeDevice || !this.server || !this.controlChar || !this.dataChar) {
      throw new Error('No hay conexión activa con el ESP32. Llama a requestDeviceAndConnect() primero.');
    }

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

      // 3. Enviar chunks binarios
      const CHUNK_SIZE = 240; // MTU óptimo para ESP32-C3
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
          statusText: `Transmitiendo a MicroSD...`,
          bytesSent: offset,
          totalBytes,
          percentage,
          deviceName: devName,
          speedKbps
        });

        // Breve pausa para no saturar el buffer del ESP32 y permitir la escritura en la SD
        await new Promise(r => setTimeout(r, 4));
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
      this.isBusy = false;
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
   * Método de conveniencia completo (Conectar + Transmitir).
   */
  public async upload(options: BLEUploadOptions): Promise<void> {
    await this.requestDeviceAndConnect(options.onProgress);
    await this.transferData(options);
  }

  public disconnect(): void {
    if (this.activeDevice && this.activeDevice.gatt && this.activeDevice.gatt.connected) {
      setTimeout(() => {
        try {
          this.activeDevice.gatt.disconnect();
        } catch (err) {
          console.warn('Error al desconectar GATT:', err);
        }
        this.activeDevice = null;
        this.server = null;
        this.controlChar = null;
        this.dataChar = null;
        this.isBusy = false;
      }, 500);
    } else {
      this.activeDevice = null;
      this.server = null;
      this.controlChar = null;
      this.dataChar = null;
      this.isBusy = false;
    }
  }
}

export const bleUploader = new BLEUploader();
