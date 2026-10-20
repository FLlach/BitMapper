import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import path from 'path';
import fsPromises from 'fs/promises';
import { FileOpenResult, SaveFileDialogOptions, WriteFileOptions, WriteFileResult, OpenBinaryFileResult, MultipleFilesResult } from './types';

// Habilitar soporte para Web Bluetooth en Chromium / Electron
app.commandLine.appendSwitch('enable-web-bluetooth', 'true');

let mainWindow: BrowserWindow | null = null;
let bluetoothSelectCallback: ((deviceId: string) => void) | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1080,
    minHeight: 700,
    backgroundColor: '#0d1117',
    title: 'BitMapper Studio - ESP32 & Display Bitmap Generator (TypeScript)',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      enableBlinkFeatures: 'Bluetooth'
    },
    autoHideMenuBar: false
  });

  // Manejo de descubrimiento y selección de dispositivos Bluetooth
  mainWindow.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault();
    bluetoothSelectCallback = callback;

    // Enviar lista actualizada de dispositivos descubiertos al renderer
    mainWindow?.webContents.send('bluetooth:devices-discovered', deviceList);

    // Si se encuentra el ESP32 con nombre "BitMapper", seleccionarlo automáticamente
    const bitmapperDevice = deviceList.find(d =>
      d.deviceName && d.deviceName.toLowerCase().includes('bitmapper')
    );
    if (bitmapperDevice) {
      console.log('Dispositivo BitMapper encontrado automáticamente:', bitmapperDevice.deviceName);
      callback(bitmapperDevice.deviceId);
      bluetoothSelectCallback = null;
    }
  });

  // Confirmar emparejamiento Bluetooth sin solicitar PIN al usuario si no es requerido
  mainWindow.webContents.session.setBluetoothPairingHandler((_details, callback) => {
    callback({ confirmed: true });
  });

  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
    bluetoothSelectCallback = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handler: Open Media File
ipcMain.handle('dialog:openFile', async (): Promise<FileOpenResult | null> => {
  if (!mainWindow) return null;

  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Image or Video',
    properties: ['openFile'],
    filters: [
      {
        name: 'All Supported Media',
        extensions: ['png', 'jpg', 'jpeg', 'bmp', 'webp', 'gif', 'svg', 'mp4', 'webm', 'mov', 'avi', 'mkv']
      },
      {
        name: 'Images',
        extensions: ['png', 'jpg', 'jpeg', 'bmp', 'webp', 'gif', 'svg']
      },
      {
        name: 'Videos',
        extensions: ['mp4', 'webm', 'mov', 'avi', 'mkv']
      }
    ]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const filePath = result.filePaths[0];
  const ext = path.extname(filePath).toLowerCase();
  const fileName = path.basename(filePath);
  const baseName = path.parse(filePath).name;
  const isVideo = ['.mp4', '.webm', '.mov', '.avi', '.mkv'].includes(ext);

  return {
    filePath,
    fileName,
    baseName,
    ext,
    isVideo
  };
});

// IPC Handler: Show Save Dialog
ipcMain.handle(
  'dialog:saveFile',
  async (_event, options: SaveFileDialogOptions): Promise<string | null> => {
    if (!mainWindow) return null;

    const ext = options.extension.replace(/^\./, '');
    const result = await dialog.showSaveDialog(mainWindow, {
      title: 'Export Bitmap Data',
      defaultPath: options.defaultName.endsWith('.' + ext)
        ? options.defaultName
        : `${options.defaultName}.${ext}`,
      filters: [
        { name: options.filterName || `${ext.toUpperCase()} File`, extensions: [ext] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (result.canceled || !result.filePath) {
      return null;
    }
    return result.filePath;
  }
);

// IPC Handler: Write File directly
ipcMain.handle(
  'fs:writeFile',
  async (_event, options: WriteFileOptions): Promise<WriteFileResult> => {
    try {
      if (options.isBinary) {
        let buffer: Buffer;
        if (options.content instanceof Uint8Array) {
          buffer = Buffer.from(options.content.buffer, options.content.byteOffset, options.content.byteLength);
        } else if (Array.isArray(options.content)) {
          buffer = Buffer.from(options.content);
        } else {
          buffer = Buffer.from(options.content as string, 'binary');
        }
        await fsPromises.writeFile(options.filePath, buffer);
      } else {
        await fsPromises.writeFile(options.filePath, options.content as string, 'utf-8');
      }
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error('File write error:', errorMsg);
      return { success: false, error: errorMsg };
    }
  }
);

// IPC Handler: Reveal in File Explorer
ipcMain.handle('fs:revealInFolder', async (_event, filePath: string): Promise<boolean> => {
  try {
    shell.showItemInFolder(filePath);
    return true;
  } catch {
    return false;
  }
});

// IPC Handler: Open Binary (.bin) file directly
ipcMain.handle('dialog:openBinaryFile', async (): Promise<OpenBinaryFileResult | null> => {
  if (!mainWindow) return null;

  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Seleccionar archivo Bitmap Binario (.BIN)',
    properties: ['openFile'],
    filters: [
      { name: 'Archivos Binarios (.bin)', extensions: ['bin'] },
      { name: 'Todos los Archivos', extensions: ['*'] }
    ]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const filePath = result.filePaths[0];
  const fileName = path.basename(filePath);
  const baseName = path.parse(filePath).name;
  const buffer = await fsPromises.readFile(filePath);

  return {
    filePath,
    fileName,
    baseName,
    data: new Uint8Array(buffer)
  };
});

// IPC Handler: Open Multiple Media / .bin files
ipcMain.handle('dialog:openMultipleFiles', async (): Promise<MultipleFilesResult[] | null> => {
  if (!mainWindow) return null;

  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Seleccionar múltiples imágenes o archivos .BIN',
    properties: ['openFile', 'multiSelections'],
    filters: [
      {
        name: 'Imágenes y Archivos Binarios',
        extensions: ['png', 'jpg', 'jpeg', 'bmp', 'webp', 'bin']
      },
      {
        name: 'Imágenes',
        extensions: ['png', 'jpg', 'jpeg', 'bmp', 'webp']
      },
      {
        name: 'Archivos Binarios (.bin)',
        extensions: ['bin']
      },
      {
        name: 'Todos los Archivos',
        extensions: ['*']
      }
    ]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const results: MultipleFilesResult[] = [];
  for (const filePath of result.filePaths) {
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);
    const baseName = path.parse(filePath).name;
    const isBin = ext === '.bin';
    let data: Uint8Array | undefined;
    if (isBin) {
      try {
        const buf = await fsPromises.readFile(filePath);
        data = new Uint8Array(buf);
      } catch (err) {
        console.warn('Error al leer .bin:', err);
      }
    }
    results.push({
      filePath,
      fileName,
      baseName,
      isBin,
      data
    });
  }
  return results;
});

// IPC Handler: Manual Bluetooth device selection by renderer
ipcMain.on('bluetooth:select-device', (_event, deviceId: string) => {
  if (bluetoothSelectCallback) {
    bluetoothSelectCallback(deviceId);
    bluetoothSelectCallback = null;
  }
});

// IPC Handler: Cancel Bluetooth device request
ipcMain.on('bluetooth:cancel', () => {
  if (bluetoothSelectCallback) {
    bluetoothSelectCallback('');
    bluetoothSelectCallback = null;
  }
});

