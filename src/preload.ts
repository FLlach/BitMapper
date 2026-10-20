import { contextBridge, ipcRenderer } from 'electron';
import { SaveFileDialogOptions, WriteFileOptions, BitmapperAPI } from './types';

const api: BitmapperAPI = {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  openBinaryFile: () => ipcRenderer.invoke('dialog:openBinaryFile'),
  openMultipleFiles: () => ipcRenderer.invoke('dialog:openMultipleFiles'),
  saveFile: (options: SaveFileDialogOptions) => ipcRenderer.invoke('dialog:saveFile', options),
  writeFile: (options: WriteFileOptions) => ipcRenderer.invoke('fs:writeFile', options),
  revealInFolder: (path: string) => ipcRenderer.invoke('fs:revealInFolder', path),
  onBluetoothDevices: (callback) => {
    const listener = (_event: Electron.IpcRendererEvent, devices: any) => callback(devices);
    ipcRenderer.on('bluetooth:devices-discovered', listener);
    return () => {
      ipcRenderer.removeListener('bluetooth:devices-discovered', listener);
    };
  },
  selectBluetoothDevice: (deviceId: string) => ipcRenderer.send('bluetooth:select-device', deviceId),
  cancelBluetooth: () => ipcRenderer.send('bluetooth:cancel')
};

contextBridge.exposeInMainWorld('bitmapperAPI', api);
