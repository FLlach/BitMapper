"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/main.ts
var import_electron = require("electron");
var import_path = __toESM(require("path"));
var import_promises = __toESM(require("fs/promises"));
import_electron.app.commandLine.appendSwitch("enable-web-bluetooth", "true");
var mainWindow = null;
var bluetoothSelectCallback = null;
function createWindow() {
  mainWindow = new import_electron.BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1080,
    minHeight: 700,
    backgroundColor: "#0d1117",
    title: "BitMapper Studio - ESP32 & Display Bitmap Generator (TypeScript)",
    webPreferences: {
      preload: import_path.default.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      enableBlinkFeatures: "Bluetooth"
    },
    autoHideMenuBar: false
  });
  mainWindow.webContents.on("select-bluetooth-device", (event, deviceList, callback) => {
    event.preventDefault();
    bluetoothSelectCallback = callback;
    mainWindow?.webContents.send("bluetooth:devices-discovered", deviceList);
    const bitmapperDevice = deviceList.find(
      (d) => d.deviceName && d.deviceName.toLowerCase().includes("bitmapper")
    );
    if (bitmapperDevice) {
      console.log("Dispositivo BitMapper encontrado autom\xE1ticamente:", bitmapperDevice.deviceName);
      callback(bitmapperDevice.deviceId);
      bluetoothSelectCallback = null;
    }
  });
  mainWindow.webContents.session.setBluetoothPairingHandler((_details, callback) => {
    callback({ confirmed: true });
  });
  mainWindow.loadFile(import_path.default.join(__dirname, "../index.html"));
  mainWindow.on("closed", () => {
    mainWindow = null;
    bluetoothSelectCallback = null;
  });
}
import_electron.app.whenReady().then(() => {
  createWindow();
  import_electron.app.on("activate", () => {
    if (import_electron.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
import_electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    import_electron.app.quit();
  }
});
import_electron.ipcMain.handle("dialog:openFile", async () => {
  if (!mainWindow) return null;
  const result = await import_electron.dialog.showOpenDialog(mainWindow, {
    title: "Select Image or Video",
    properties: ["openFile"],
    filters: [
      {
        name: "All Supported Media",
        extensions: ["png", "jpg", "jpeg", "bmp", "webp", "gif", "svg", "mp4", "webm", "mov", "avi", "mkv"]
      },
      {
        name: "Images",
        extensions: ["png", "jpg", "jpeg", "bmp", "webp", "gif", "svg"]
      },
      {
        name: "Videos",
        extensions: ["mp4", "webm", "mov", "avi", "mkv"]
      }
    ]
  });
  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  const filePath = result.filePaths[0];
  const ext = import_path.default.extname(filePath).toLowerCase();
  const fileName = import_path.default.basename(filePath);
  const baseName = import_path.default.parse(filePath).name;
  const isVideo = [".mp4", ".webm", ".mov", ".avi", ".mkv"].includes(ext);
  return {
    filePath,
    fileName,
    baseName,
    ext,
    isVideo
  };
});
import_electron.ipcMain.handle(
  "dialog:saveFile",
  async (_event, options) => {
    if (!mainWindow) return null;
    const ext = options.extension.replace(/^\./, "");
    const result = await import_electron.dialog.showSaveDialog(mainWindow, {
      title: "Export Bitmap Data",
      defaultPath: options.defaultName.endsWith("." + ext) ? options.defaultName : `${options.defaultName}.${ext}`,
      filters: [
        { name: options.filterName || `${ext.toUpperCase()} File`, extensions: [ext] },
        { name: "All Files", extensions: ["*"] }
      ]
    });
    if (result.canceled || !result.filePath) {
      return null;
    }
    return result.filePath;
  }
);
import_electron.ipcMain.handle(
  "fs:writeFile",
  async (_event, options) => {
    try {
      if (options.isBinary) {
        let buffer;
        if (options.content instanceof Uint8Array) {
          buffer = Buffer.from(options.content.buffer, options.content.byteOffset, options.content.byteLength);
        } else if (Array.isArray(options.content)) {
          buffer = Buffer.from(options.content);
        } else {
          buffer = Buffer.from(options.content, "binary");
        }
        await import_promises.default.writeFile(options.filePath, buffer);
      } else {
        await import_promises.default.writeFile(options.filePath, options.content, "utf-8");
      }
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("File write error:", errorMsg);
      return { success: false, error: errorMsg };
    }
  }
);
import_electron.ipcMain.handle("fs:revealInFolder", async (_event, filePath) => {
  try {
    import_electron.shell.showItemInFolder(filePath);
    return true;
  } catch {
    return false;
  }
});
import_electron.ipcMain.handle("dialog:openBinaryFile", async () => {
  if (!mainWindow) return null;
  const result = await import_electron.dialog.showOpenDialog(mainWindow, {
    title: "Seleccionar archivo Bitmap Binario (.BIN)",
    properties: ["openFile"],
    filters: [
      { name: "Archivos Binarios (.bin)", extensions: ["bin"] },
      { name: "Todos los Archivos", extensions: ["*"] }
    ]
  });
  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  const filePath = result.filePaths[0];
  const fileName = import_path.default.basename(filePath);
  const baseName = import_path.default.parse(filePath).name;
  const buffer = await import_promises.default.readFile(filePath);
  return {
    filePath,
    fileName,
    baseName,
    data: new Uint8Array(buffer)
  };
});
import_electron.ipcMain.handle("dialog:openMultipleFiles", async () => {
  if (!mainWindow) return null;
  const result = await import_electron.dialog.showOpenDialog(mainWindow, {
    title: "Seleccionar m\xFAltiples im\xE1genes o archivos .BIN",
    properties: ["openFile", "multiSelections"],
    filters: [
      {
        name: "Im\xE1genes y Archivos Binarios",
        extensions: ["png", "jpg", "jpeg", "bmp", "webp", "bin"]
      },
      {
        name: "Im\xE1genes",
        extensions: ["png", "jpg", "jpeg", "bmp", "webp"]
      },
      {
        name: "Archivos Binarios (.bin)",
        extensions: ["bin"]
      },
      {
        name: "Todos los Archivos",
        extensions: ["*"]
      }
    ]
  });
  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  const results = [];
  for (const filePath of result.filePaths) {
    const ext = import_path.default.extname(filePath).toLowerCase();
    const fileName = import_path.default.basename(filePath);
    const baseName = import_path.default.parse(filePath).name;
    const isBin = ext === ".bin";
    let data;
    if (isBin) {
      try {
        const buf = await import_promises.default.readFile(filePath);
        data = new Uint8Array(buf);
      } catch (err) {
        console.warn("Error al leer .bin:", err);
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
import_electron.ipcMain.on("bluetooth:select-device", (_event, deviceId) => {
  if (bluetoothSelectCallback) {
    bluetoothSelectCallback(deviceId);
    bluetoothSelectCallback = null;
  }
});
import_electron.ipcMain.on("bluetooth:cancel", () => {
  if (bluetoothSelectCallback) {
    bluetoothSelectCallback("");
    bluetoothSelectCallback = null;
  }
});
