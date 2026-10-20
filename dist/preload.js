"use strict";

// src/preload.ts
var import_electron = require("electron");
var api = {
  openFile: () => import_electron.ipcRenderer.invoke("dialog:openFile"),
  openBinaryFile: () => import_electron.ipcRenderer.invoke("dialog:openBinaryFile"),
  openMultipleFiles: () => import_electron.ipcRenderer.invoke("dialog:openMultipleFiles"),
  saveFile: (options) => import_electron.ipcRenderer.invoke("dialog:saveFile", options),
  writeFile: (options) => import_electron.ipcRenderer.invoke("fs:writeFile", options),
  revealInFolder: (path) => import_electron.ipcRenderer.invoke("fs:revealInFolder", path),
  onBluetoothDevices: (callback) => {
    const listener = (_event, devices) => callback(devices);
    import_electron.ipcRenderer.on("bluetooth:devices-discovered", listener);
    return () => {
      import_electron.ipcRenderer.removeListener("bluetooth:devices-discovered", listener);
    };
  },
  selectBluetoothDevice: (deviceId) => import_electron.ipcRenderer.send("bluetooth:select-device", deviceId),
  cancelBluetooth: () => import_electron.ipcRenderer.send("bluetooth:cancel")
};
import_electron.contextBridge.exposeInMainWorld("bitmapperAPI", api);
