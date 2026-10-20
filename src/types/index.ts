// Type Definitions for BitMapper Studio

export type DisplayShape = 'square' | 'rectangle' | 'circle';

export type ColorFormatId =
  | 'rgb565'
  | 'bgr565'
  | 'rgb888'
  | 'rgb666'
  | 'gray8'
  | 'gray4'
  | 'mono1_horizontal'
  | 'mono1_vertical'
  | 'palette_gameboy'
  | 'palette_gb_pocket'
  | 'palette_cga1'
  | 'palette_cga2'
  | 'palette_c64'
  | 'palette_pico8'
  | 'palette_zx';

export type DitherAlgorithmId = 'none' | 'floyd' | 'atkinson' | 'bayer4' | 'bayer8';

export type ExportFormatId =
  | 'c_header'
  | 'binary'
  | 'bmpr'
  | 'rle_compressed'
  | 'hex_dump'
  | 'python'
  | 'png_preview'
  | 'zip_sequence';

export type ScalingMode = 'contain' | 'cover' | 'stretch' | 'center';

export type Endianness = 'big' | 'little';

export type DataType = 'uint16_t' | 'uint8_t';

export interface DisplayPreset {
  id: string;
  name: string;
  category: string;
  width: number;
  height: number;
  colorFormat: ColorFormatId;
  endian: Endianness;
  swapBytes: boolean;
  shape: DisplayShape;
  description: string;
}

export interface ColorFormat {
  id: ColorFormatId;
  name: string;
  bytesPerPixel: number;
  dataType: DataType;
  category: string;
  description: string;
}

export interface DitheringAlgorithm {
  id: DitherAlgorithmId;
  name: string;
  description: string;
}

export interface ExportFormat {
  id: ExportFormatId;
  name: string;
  ext: string;
  mime: string;
}

export interface EncodeOptions {
  colorFormat?: ColorFormatId;
  endian?: Endianness;
  swapBytes?: boolean;
  invert?: boolean;
}

export interface EncodedBitmap {
  bytes: Uint8Array;
  values: number[];
  dataType: DataType;
  sizeBytes: number;
}

export interface HeaderOptions {
  colorFormat?: ColorFormatId;
  endian?: Endianness;
  swapBytes?: boolean;
  useProgmem?: boolean;
  itemsPerLine?: number;
}

export interface SequenceFrame {
  time: number;
  values: number[];
  bytes: Uint8Array;
}

export interface ESP32Sketches {
  tft_espi: string;
  adafruit_gfx: string;
  lovyangfx: string;
  fs_binary: string;
}

export interface FileOpenResult {
  filePath: string;
  fileName: string;
  baseName: string;
  ext: string;
  isVideo: boolean;
}

export interface SaveFileDialogOptions {
  defaultName: string;
  extension: string;
  filterName?: string;
}

export interface BluetoothDeviceInfo {
  deviceId: string;
  deviceName?: string;
}

export interface OpenBinaryFileResult {
  filePath: string;
  fileName: string;
  baseName: string;
  data: Uint8Array;
}

export interface WriteFileOptions {
  filePath: string;
  content: string | Uint8Array | number[];
  isBinary: boolean;
}

export interface WriteFileResult {
  success: boolean;
  error?: string;
}

export interface MultipleFilesResult {
  filePath: string;
  fileName: string;
  baseName: string;
  isBin: boolean;
  data?: Uint8Array;
}

export interface DeviceConfig {
  swapBytes?: boolean;
  invertDisplay?: boolean;
  videoFps?: number;
  slideshowEnabled?: boolean;
  slideshowDelaySec?: number;
  transitionMode?: number;
  brightnessDuty?: number;
}

export interface BitmapperAPI {
  openFile: () => Promise<FileOpenResult | null>;
  openBinaryFile: () => Promise<OpenBinaryFileResult | null>;
  openMultipleFiles?: () => Promise<MultipleFilesResult[] | null>;
  saveFile: (options: SaveFileDialogOptions) => Promise<string | null>;
  writeFile: (options: WriteFileOptions) => Promise<WriteFileResult>;
  revealInFolder: (path: string) => Promise<boolean>;
  onBluetoothDevices?: (callback: (devices: BluetoothDeviceInfo[]) => void) => () => void;
  selectBluetoothDevice?: (deviceId: string) => void;
  cancelBluetooth?: () => void;
}

declare global {
  interface Window {
    bitmapperAPI?: BitmapperAPI;
  }
  interface Navigator {
    bluetooth?: any;
  }
}


