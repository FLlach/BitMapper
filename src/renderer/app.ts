import JSZip from 'jszip';
import {
  DisplayPreset,
  ColorFormat,
  ColorFormatId,
  DitherAlgorithmId,
  ExportFormatId,
  ScalingMode,
  Endianness,
  EncodedBitmap,
  SequenceFrame
} from '../types';
import { DISPLAY_PRESETS, COLOR_FORMATS, DITHERING_ALGORITHMS, EXPORT_FORMATS } from '../engine/presets';
import { applyDithering, clamp } from '../engine/dither';
import { encodeBitmap } from '../engine/color-quantizer';
import {
  generateCHeaderSingle,
  generateCHeaderSequence,
  generateMicroPython,
  generateHexDump,
  generateESP32Sketches,
  createBmprHeader,
  generateBmprBinary
} from '../engine/exporters';
import { bleUploader, BLEProgress, SDBinFile } from './ble-uploader';
import { isRetroPalette, RETRO_PALETTES } from '../engine/retro-palettes';
import { compressRLE, generateRLECHeader } from '../engine/rle-compressor';
import { decodeGifAnimation, isGifFile, DecodedGifResult } from '../engine/gif-decoder';
import { pixelEditor, PixelEditTool } from '../engine/pixel-editor';
import { generateBitmapFont } from '../engine/font-generator';
import { copyCanvasToClipboard, downloadCanvasImage, recordCanvasAnimation } from '../engine/preview-recorder';

interface AppState {
  sourceType: 'image' | 'video';
  sourceElement: HTMLImageElement | HTMLVideoElement | null;
  sourceFileName: string;
  sourceBaseName: string;
  sourceWidth: number;
  sourceHeight: number;

  presetId: string;
  targetWidth: number;
  targetHeight: number;
  scalingMode: ScalingMode;
  bgColor: string;

  colorFormat: ColorFormatId;
  endian: Endianness;
  swapBytes: boolean;
  invertColors: boolean;
  ditherAlgorithm: DitherAlgorithmId;

  rotation: number;
  flipH: boolean;
  flipV: boolean;
  brightness: number;
  contrast: number;
  gamma: number;
  threshold: number;

  videoPlaying: boolean;
  videoDuration: number;
  videoInPoint: number;
  videoOutPoint: number;
  videoTargetFps: number;
  videoExportMode: 'single' | 'sequence';
  videoLoop: boolean;

  exportFormat: ExportFormatId;
  variableName: string;
  useProgmem: boolean;
  itemsPerRow: number;

  zoom: number;
  pixelGrid: boolean;
  showBezel: boolean;
  activeTab: string;
  activeSketchTab: 'tft_espi' | 'adafruit_gfx' | 'lovyangfx' | 'fs_binary';

  currentEncoded: EncodedBitmap | null;
}

const state: AppState = {
  sourceType: 'image',
  sourceElement: null,
  sourceFileName: 'sample_cyberpunk.png',
  sourceBaseName: 'sample_cyberpunk',
  sourceWidth: 240,
  sourceHeight: 240,

  presetId: 'st7789_240x240',
  targetWidth: 240,
  targetHeight: 240,
  scalingMode: 'cover',
  bgColor: '#000000',

  colorFormat: 'rgb565',
  endian: 'big',
  swapBytes: false,
  invertColors: false,
  ditherAlgorithm: 'floyd',

  rotation: 0,
  flipH: false,
  flipV: false,
  brightness: 0,
  contrast: 0,
  gamma: 1.0,
  threshold: 128,

  videoPlaying: false,
  videoDuration: 0,
  videoInPoint: 0,
  videoOutPoint: 0,
  videoTargetFps: 15,
  videoExportMode: 'sequence',
  videoLoop: true,

  exportFormat: 'c_header',
  variableName: 'bitmap_data',
  useProgmem: true,
  itemsPerRow: 16,

  zoom: 2,
  pixelGrid: false,
  showBezel: true,
  activeTab: 'tab-simulator',
  activeSketchTab: 'tft_espi',

  currentEncoded: null
};

// DOM References
const el = {
  btnOpenFile: document.getElementById('btnOpenFile') as HTMLButtonElement,
  btnPasteClipboard: document.getElementById('btnPasteClipboard') as HTMLButtonElement,
  sampleSelect: document.getElementById('sampleSelect') as HTMLSelectElement,
  btnHeaderExport: document.getElementById('btnHeaderExport') as HTMLButtonElement,
  btnExportMain: document.getElementById('btnExportMain') as HTMLButtonElement,

  hiddenFileInput: document.getElementById('hiddenFileInput') as HTMLInputElement,
  hiddenVideo: document.getElementById('hiddenVideo') as HTMLVideoElement,

  sourceTypeBadge: document.getElementById('sourceTypeBadge') as HTMLElement,
  sourceDetails: document.getElementById('sourceDetails') as HTMLElement,

  presetSelect: document.getElementById('presetSelect') as HTMLSelectElement,
  inputWidth: document.getElementById('inputWidth') as HTMLInputElement,
  inputHeight: document.getElementById('inputHeight') as HTMLInputElement,
  btnSwapOrientation: document.getElementById('btnSwapOrientation') as HTMLButtonElement,
  scalingMode: document.getElementById('scalingMode') as HTMLSelectElement,
  bgColorPicker: document.getElementById('bgColorPicker') as HTMLInputElement,

  colorFormatSelect: document.getElementById('colorFormatSelect') as HTMLSelectElement,
  endianSelect: document.getElementById('endianSelect') as HTMLSelectElement,
  ditherSelect: document.getElementById('ditherSelect') as HTMLSelectElement,
  swapBytesCheckbox: document.getElementById('swapBytesCheckbox') as HTMLInputElement,
  invertColorsCheckbox: document.getElementById('invertColorsCheckbox') as HTMLInputElement,

  rotationSelect: document.getElementById('rotationSelect') as HTMLSelectElement,
  btnFlipH: document.getElementById('btnFlipH') as HTMLButtonElement,
  btnFlipV: document.getElementById('btnFlipV') as HTMLButtonElement,
  sliderBrightness: document.getElementById('sliderBrightness') as HTMLInputElement,
  brightnessVal: document.getElementById('brightnessVal') as HTMLElement,
  sliderContrast: document.getElementById('sliderContrast') as HTMLInputElement,
  contrastVal: document.getElementById('contrastVal') as HTMLElement,
  sliderGamma: document.getElementById('sliderGamma') as HTMLInputElement,
  gammaVal: document.getElementById('gammaVal') as HTMLElement,
  thresholdGroup: document.getElementById('thresholdGroup') as HTMLElement,
  sliderThreshold: document.getElementById('sliderThreshold') as HTMLInputElement,
  thresholdVal: document.getElementById('thresholdVal') as HTMLElement,

  videoSection: document.getElementById('videoSection') as HTMLElement,
  videoDurationBadge: document.getElementById('videoDurationBadge') as HTMLElement,
  videoTargetFps: document.getElementById('videoTargetFps') as HTMLSelectElement,
  videoExportMode: document.getElementById('videoExportMode') as HTMLSelectElement,
  videoTotalFrames: document.getElementById('videoTotalFrames') as HTMLElement,
  videoEstFlash: document.getElementById('videoEstFlash') as HTMLElement,

  exportFormatSelect: document.getElementById('exportFormatSelect') as HTMLSelectElement,
  variableNameInput: document.getElementById('variableNameInput') as HTMLInputElement,
  progmemCheckbox: document.getElementById('progmemCheckbox') as HTMLInputElement,
  itemsPerRowSelect: document.getElementById('itemsPerRowSelect') as HTMLSelectElement,

  targetCanvas: document.getElementById('targetCanvas') as HTMLCanvasElement,
  originalCanvas: document.getElementById('originalCanvas') as HTMLCanvasElement,
  compareTargetCanvas: document.getElementById('compareTargetCanvas') as HTMLCanvasElement,

  zoomSelect: document.getElementById('zoomSelect') as HTMLSelectElement,
  btnToggleGrid: document.getElementById('btnToggleGrid') as HTMLButtonElement,
  btnToggleBezel: document.getElementById('btnToggleBezel') as HTMLButtonElement,
  hardwareBezel: document.getElementById('hardwareBezel') as HTMLElement,
  bezelLabel: document.getElementById('bezelLabel') as HTMLElement,
  bezelScreenGlass: document.getElementById('bezelScreenGlass') as HTMLElement,

  videoTimelineBar: document.getElementById('videoTimelineBar') as HTMLElement,
  videoScrubber: document.getElementById('videoScrubber') as HTMLInputElement,
  btnVideoPlayPause: document.getElementById('btnVideoPlayPause') as HTMLButtonElement,
  playIcon: document.getElementById('playIcon') as HTMLElement,
  pauseIcon: document.getElementById('pauseIcon') as HTMLElement,
  btnPrevFrame: document.getElementById('btnPrevFrame') as HTMLButtonElement,
  btnNextFrame: document.getElementById('btnNextFrame') as HTMLButtonElement,
  currentTimeLabel: document.getElementById('currentTimeLabel') as HTMLElement,
  totalTimeLabel: document.getElementById('totalTimeLabel') as HTMLElement,
  currentFrameNum: document.getElementById('currentFrameNum') as HTMLElement,
  btnSetInPoint: document.getElementById('btnSetInPoint') as HTMLButtonElement,
  btnSetOutPoint: document.getElementById('btnSetOutPoint') as HTMLButtonElement,
  btnResetRange: document.getElementById('btnResetRange') as HTMLButtonElement,
  rangeDisplay: document.getElementById('rangeDisplay') as HTMLElement,
  videoLoopCheckbox: document.getElementById('videoLoopCheckbox') as HTMLInputElement,

  codeOutput: document.getElementById('codeOutput') as HTMLElement,
  btnCopyCode: document.getElementById('btnCopyCode') as HTMLButtonElement,
  codePreviewTitle: document.getElementById('codePreviewTitle') as HTMLElement,

  sketchOutput: document.getElementById('sketchOutput') as HTMLElement,
  btnCopySketch: document.getElementById('btnCopySketch') as HTMLButtonElement,

  statusReady: document.getElementById('statusReady') as HTMLElement,
  statusDim: document.getElementById('statusDim') as HTMLElement,
  statusFormat: document.getElementById('statusFormat') as HTMLElement,
  statusMemory: document.getElementById('statusMemory') as HTMLElement,
  statusPixelCoord: document.getElementById('statusPixelCoord') as HTMLElement,

  pixelInspector: document.getElementById('pixelInspector') as HTMLElement,
  inspectorSwatch: document.getElementById('inspectorSwatch') as HTMLElement,
  inspectorText: document.getElementById('inspectorText') as HTMLElement,

  dragOverlay: document.getElementById('dragOverlay') as HTMLElement,
  toast: document.getElementById('toast') as HTMLElement,
  toastMessage: document.getElementById('toastMessage') as HTMLElement,

  btnHeaderBle: document.getElementById('btnHeaderBle') as HTMLButtonElement,
  btnBleSendSidebar: document.getElementById('btnBleSendSidebar') as HTMLButtonElement,
  bleModalOverlay: document.getElementById('bleModalOverlay') as HTMLElement,
  btnBleCloseModal: document.getElementById('btnBleCloseModal') as HTMLButtonElement,
  btnBleDismiss: document.getElementById('btnBleDismiss') as HTMLButtonElement,
  btnBlePickLocalBin: document.getElementById('btnBlePickLocalBin') as HTMLButtonElement,
  btnBleStartUpload: document.getElementById('btnBleStartUpload') as HTMLButtonElement,
  btnBleCancelUpload: document.getElementById('btnBleCancelUpload') as HTMLButtonElement,
  bleTargetFilename: document.getElementById('bleTargetFilename') as HTMLElement,
  bleTargetFilemeta: document.getElementById('bleTargetFilemeta') as HTMLElement,
  bleStatusBadge: document.getElementById('bleStatusBadge') as HTMLElement,
  bleDeviceNameLabel: document.getElementById('bleDeviceNameLabel') as HTMLElement,
  bleProgressStatusText: document.getElementById('bleProgressStatusText') as HTMLElement,
  bleProgressPercent: document.getElementById('bleProgressPercent') as HTMLElement,
  bleProgressBar: document.getElementById('bleProgressBar') as HTMLElement,
  bleBytesTransferred: document.getElementById('bleBytesTransferred') as HTMLElement,
  bleTransferSpeed: document.getElementById('bleTransferSpeed') as HTMLElement,
  bleTabBtnUpload: document.getElementById('bleTabBtnUpload') as HTMLButtonElement,
  bleTabBtnBatch: document.getElementById('bleTabBtnBatch') as HTMLButtonElement,
  bleTabBtnManager: document.getElementById('bleTabBtnManager') as HTMLButtonElement,
  blePaneUpload: document.getElementById('blePaneUpload') as HTMLElement,
  blePaneBatch: document.getElementById('blePaneBatch') as HTMLElement,
  blePaneManager: document.getElementById('blePaneManager') as HTMLElement,
  btnBleAddBatchFiles: document.getElementById('btnBleAddBatchFiles') as HTMLButtonElement,
  btnBleClearBatch: document.getElementById('btnBleClearBatch') as HTMLButtonElement,
  bleBatchResLabel: document.getElementById('bleBatchResLabel') as HTMLElement,
  bleBatchFormatLabel: document.getElementById('bleBatchFormatLabel') as HTMLElement,
  bleBatchProgressBox: document.getElementById('bleBatchProgressBox') as HTMLElement,
  bleBatchOverallStatus: document.getElementById('bleBatchOverallStatus') as HTMLElement,
  bleBatchOverallPercent: document.getElementById('bleBatchOverallPercent') as HTMLElement,
  bleBatchOverallBar: document.getElementById('bleBatchOverallBar') as HTMLElement,
  bleBatchFileStatus: document.getElementById('bleBatchFileStatus') as HTMLElement,
  bleBatchSpeed: document.getElementById('bleBatchSpeed') as HTMLElement,
  bleBatchFilesContainer: document.getElementById('bleBatchFilesContainer') as HTMLElement,
  btnBleStartBatchUpload: document.getElementById('btnBleStartBatchUpload') as HTMLButtonElement,
  hiddenBatchFileInput: document.getElementById('hiddenBatchFileInput') as HTMLInputElement,
  bleManagerStatusText: document.getElementById('bleManagerStatusText') as HTMLElement,
  bleManagerBadge: document.getElementById('bleManagerBadge') as HTMLElement,
  btnBleRefreshFiles: document.getElementById('btnBleRefreshFiles') as HTMLButtonElement,
  bleFilesContainer: document.getElementById('bleFilesContainer') as HTMLElement,
  btnBleConnectFromManager: document.getElementById('btnBleConnectFromManager') as HTMLButtonElement,
  bleTabBtnSettings: document.getElementById('bleTabBtnSettings') as HTMLButtonElement,
  blePaneSettings: document.getElementById('blePaneSettings') as HTMLElement,
  bleSettingSlideshow: document.getElementById('bleSettingSlideshow') as HTMLInputElement,
  bleSettingSlideInterval: document.getElementById('bleSettingSlideInterval') as HTMLSelectElement,
  bleSlideIntervalLabel: document.getElementById('bleSlideIntervalLabel') as HTMLElement,
  bleSettingTransition: document.getElementById('bleSettingTransition') as HTMLSelectElement,
  bleSettingBrightness: document.getElementById('bleSettingBrightness') as HTMLInputElement,
  bleSettingBrightnessLabel: document.getElementById('bleSettingBrightnessLabel') as HTMLElement,
  bleSettingSleepEnabled: document.getElementById('bleSettingSleepEnabled') as HTMLInputElement,
  bleSettingSleepTimeout: document.getElementById('bleSettingSleepTimeout') as HTMLSelectElement,
  bleSleepTimeoutLabel: document.getElementById('bleSleepTimeoutLabel') as HTMLElement,
  bleSettingSleepBrightness: document.getElementById('bleSettingSleepBrightness') as HTMLInputElement,
  bleSettingSleepBrightnessLabel: document.getElementById('bleSettingSleepBrightnessLabel') as HTMLElement,
  btnBleApplySettings: document.getElementById('btnBleApplySettings') as HTMLButtonElement,
  btnBleRemotePrev: document.getElementById('btnBleRemotePrev') as HTMLButtonElement,
  btnBleRemoteNext: document.getElementById('btnBleRemoteNext') as HTMLButtonElement,
  bleOptBmprHeader: document.getElementById('bleOptBmprHeader') as HTMLInputElement,

  // Utilities & Pixel Art & Font Gen
  btnHeaderFontGen: document.getElementById('btnHeaderFontGen') as HTMLButtonElement,
  btnHeaderCopyClipboard: document.getElementById('btnHeaderCopyClipboard') as HTMLButtonElement,
  btnHeaderRecordAnim: document.getElementById('btnHeaderRecordAnim') as HTMLButtonElement,

  pixelArtToolbar: document.getElementById('pixelArtToolbar') as HTMLElement,
  toolPointer: document.getElementById('toolPointer') as HTMLButtonElement,
  toolPencil: document.getElementById('toolPencil') as HTMLButtonElement,
  toolEraser: document.getElementById('toolEraser') as HTMLButtonElement,
  toolText: document.getElementById('toolText') as HTMLButtonElement,
  pixelColorCustom: document.getElementById('pixelColorCustom') as HTMLInputElement,
  pixelTextInput: document.getElementById('pixelTextInput') as HTMLInputElement,
  pixelTextControlGroup: document.getElementById('pixelTextControlGroup') as HTMLElement,
  btnPixelUndo: document.getElementById('btnPixelUndo') as HTMLButtonElement,
  btnPixelClear: document.getElementById('btnPixelClear') as HTMLButtonElement,
  pixelEditBadge: document.getElementById('pixelEditBadge') as HTMLElement,

  fontModalOverlay: document.getElementById('fontModalOverlay') as HTMLElement,
  btnCloseFontModal: document.getElementById('btnCloseFontModal') as HTMLButtonElement,
  btnDismissFontModal: document.getElementById('btnDismissFontModal') as HTMLButtonElement,
  btnCopyFontHeader: document.getElementById('btnCopyFontHeader') as HTMLButtonElement,
  btnDownloadFontHeader: document.getElementById('btnDownloadFontHeader') as HTMLButtonElement,
  fontFamilySelect: document.getElementById('fontFamilySelect') as HTMLSelectElement,
  fontSizeSelect: document.getElementById('fontSizeSelect') as HTMLSelectElement,
  fontWeightSelect: document.getElementById('fontWeightSelect') as HTMLSelectElement,
  fontRangeSelect: document.getElementById('fontRangeSelect') as HTMLSelectElement,
  fontGlyphGrid: document.getElementById('fontGlyphGrid') as HTMLElement,
  fontTotalBytesLabel: document.getElementById('fontTotalBytesLabel') as HTMLElement,
  fontTestInput: document.getElementById('fontTestInput') as HTMLInputElement,
  fontTestCanvas: document.getElementById('fontTestCanvas') as HTMLCanvasElement
};

// Canvas 2D contexts
const workCanvas = document.createElement('canvas');
const workCtx = workCanvas.getContext('2d', { willReadFrequently: true })!;
const targetCtx = el.targetCanvas.getContext('2d')!;
const originalCtx = el.originalCanvas.getContext('2d')!;
const compareCtx = el.compareTargetCanvas.getContext('2d')!;

function initUI(): void {
  // Populate Presets
  DISPLAY_PRESETS.forEach(preset => {
    const opt = document.createElement('option');
    opt.value = preset.id;
    opt.textContent = `${preset.name} (${preset.width}x${preset.height})`;
    el.presetSelect.appendChild(opt);
  });
  el.presetSelect.value = state.presetId;

  // Populate Color Formats
  COLOR_FORMATS.forEach(fmt => {
    const opt = document.createElement('option');
    opt.value = fmt.id;
    opt.textContent = fmt.name;
    el.colorFormatSelect.appendChild(opt);
  });
  el.colorFormatSelect.value = state.colorFormat;

  // Populate Dithering
  DITHERING_ALGORITHMS.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = d.name;
    el.ditherSelect.appendChild(opt);
  });
  el.ditherSelect.value = state.ditherAlgorithm;

  // Populate Export Formats
  updateExportFormatsForSource();

  setupEvents();
  loadSample('cyberpunk');
}

function updateExportFormatsForSource(): void {
  const isVideoSeq = state.sourceType === 'video' && state.videoExportMode === 'sequence';
  el.exportFormatSelect.innerHTML = '';

  if (isVideoSeq) {
    const videoFormats: Array<{ id: ExportFormatId; name: string }> = [
      { id: 'binary', name: '🎬 Video Binario MicroSD (*_anim_XXfps.bin) [Recomendado ESP32]' },
      { id: 'zip_sequence', name: '📦 Paquete ZIP (*_anim_XXfps.bin + Sketch ESP32)' },
      { id: 'c_header', name: '📄 Cabecera C/C++ (*_anim_XXfps.h - Memoria Flash)' }
    ];

    videoFormats.forEach(vf => {
      const opt = document.createElement('option');
      opt.value = vf.id;
      opt.textContent = vf.name;
      el.exportFormatSelect.appendChild(opt);
    });

    if (state.exportFormat !== 'c_header' && state.exportFormat !== 'zip_sequence') {
      state.exportFormat = 'binary';
    }
    el.exportFormatSelect.value = state.exportFormat;
    el.btnExportMain.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> Exportar Video (*_anim_XXfps.bin)';
    el.btnHeaderExport.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Exportar Video';
  } else {
    EXPORT_FORMATS.forEach(ef => {
      const opt = document.createElement('option');
      opt.value = ef.id;
      opt.textContent = ef.name;
      el.exportFormatSelect.appendChild(opt);
    });
    if (state.exportFormat === 'zip_sequence') {
      state.exportFormat = 'c_header';
    }
    el.exportFormatSelect.value = state.exportFormat;
    el.btnExportMain.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> Generar & Exportar Bitmap';
    el.btnHeaderExport.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Exportar';
  }

  updateCodePreview();
}

function setupEvents(): void {
  el.presetSelect.addEventListener('change', () => {
    const p = DISPLAY_PRESETS.find(x => x.id === el.presetSelect.value);
    if (p) {
      state.presetId = p.id;
      if (p.id !== 'custom') {
        state.targetWidth = p.width;
        state.targetHeight = p.height;
        el.inputWidth.value = String(p.width);
        el.inputHeight.value = String(p.height);

        if (p.colorFormat) {
          state.colorFormat = p.colorFormat;
          el.colorFormatSelect.value = p.colorFormat;
        }
        if (p.endian) {
          state.endian = p.endian;
          el.endianSelect.value = p.endian;
        }
        if (typeof p.swapBytes === 'boolean') {
          state.swapBytes = p.swapBytes;
          el.swapBytesCheckbox.checked = p.swapBytes;
        }

        updateBezelStyle(p.shape || 'rectangle', p.name);
      }
      updatePipeline();
    }
  });

  el.inputWidth.addEventListener('change', () => {
    state.targetWidth = Math.max(8, parseInt(el.inputWidth.value) || 240);
    el.presetSelect.value = 'custom';
    updatePipeline();
  });
  el.inputHeight.addEventListener('change', () => {
    state.targetHeight = Math.max(8, parseInt(el.inputHeight.value) || 240);
    el.presetSelect.value = 'custom';
    updatePipeline();
  });

  el.btnSwapOrientation.addEventListener('click', () => {
    const tmp = state.targetWidth;
    state.targetWidth = state.targetHeight;
    state.targetHeight = tmp;
    el.inputWidth.value = String(state.targetWidth);
    el.inputHeight.value = String(state.targetHeight);
    updatePipeline();
  });

  el.scalingMode.addEventListener('change', () => {
    state.scalingMode = el.scalingMode.value as ScalingMode;
    updatePipeline();
  });
  el.bgColorPicker.addEventListener('input', () => {
    state.bgColor = el.bgColorPicker.value;
    updatePipeline();
  });

  el.colorFormatSelect.addEventListener('change', () => {
    state.colorFormat = el.colorFormatSelect.value as ColorFormatId;
    const isMono = state.colorFormat.startsWith('mono1');
    el.thresholdGroup.style.display = isMono ? 'block' : 'none';
    updatePipeline();
  });

  el.endianSelect.addEventListener('change', () => {
    state.endian = el.endianSelect.value as Endianness;
    updatePipeline();
  });
  el.swapBytesCheckbox.addEventListener('change', () => {
    state.swapBytes = el.swapBytesCheckbox.checked;
    updatePipeline();
  });
  el.invertColorsCheckbox.addEventListener('change', () => {
    state.invertColors = el.invertColorsCheckbox.checked;
    updatePipeline();
  });

  el.ditherSelect.addEventListener('change', () => {
    state.ditherAlgorithm = el.ditherSelect.value as DitherAlgorithmId;
    updatePipeline();
  });

  el.rotationSelect.addEventListener('change', () => {
    state.rotation = parseInt(el.rotationSelect.value) || 0;
    updatePipeline();
  });

  el.btnFlipH.addEventListener('click', () => {
    state.flipH = !state.flipH;
    el.btnFlipH.classList.toggle('btn-primary', state.flipH);
    updatePipeline();
  });
  el.btnFlipV.addEventListener('click', () => {
    state.flipV = !state.flipV;
    el.btnFlipV.classList.toggle('btn-primary', state.flipV);
    updatePipeline();
  });

  el.sliderBrightness.addEventListener('input', () => {
    state.brightness = parseInt(el.sliderBrightness.value);
    el.brightnessVal.textContent = String(state.brightness);
    updatePipeline();
  });
  el.sliderContrast.addEventListener('input', () => {
    state.contrast = parseInt(el.sliderContrast.value);
    el.contrastVal.textContent = String(state.contrast);
    updatePipeline();
  });
  el.sliderGamma.addEventListener('input', () => {
    state.gamma = parseFloat(el.sliderGamma.value);
    el.gammaVal.textContent = state.gamma.toFixed(1);
    updatePipeline();
  });
  el.sliderThreshold.addEventListener('input', () => {
    state.threshold = parseInt(el.sliderThreshold.value);
    el.thresholdVal.textContent = String(state.threshold);
    updatePipeline();
  });

  el.videoTargetFps.addEventListener('change', () => {
    state.videoTargetFps = parseInt(el.videoTargetFps.value) || 15;
    updateVideoStats();
  });
  el.videoExportMode.addEventListener('change', () => {
    state.videoExportMode = el.videoExportMode.value as 'single' | 'sequence';
    updateExportFormatsForSource();
  });

  el.exportFormatSelect.addEventListener('change', () => {
    state.exportFormat = el.exportFormatSelect.value as ExportFormatId;
    updateCodePreview();
  });
  el.variableNameInput.addEventListener('input', () => {
    state.variableName = el.variableNameInput.value.trim() || 'bitmap_data';
    updateCodePreview();
    updateSketches();
  });
  el.progmemCheckbox.addEventListener('change', () => {
    state.useProgmem = el.progmemCheckbox.checked;
    updateCodePreview();
  });
  el.itemsPerRowSelect.addEventListener('change', () => {
    state.itemsPerRow = parseInt(el.itemsPerRowSelect.value) || 16;
    updateCodePreview();
  });

  document.querySelectorAll<HTMLButtonElement>('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab')!;
      document.getElementById(tabId)!.classList.add('active');
      state.activeTab = tabId;
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.sketch-subtab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sketch-subtab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeSketchTab = btn.getAttribute('data-sketch') as typeof state.activeSketchTab;
      updateSketches();
    });
  });

  el.zoomSelect.addEventListener('change', () => {
    state.zoom = parseFloat(el.zoomSelect.value) || 2;
    applyZoom();
  });

  el.btnToggleGrid.addEventListener('click', () => {
    state.pixelGrid = !state.pixelGrid;
    el.btnToggleGrid.classList.toggle('btn-primary', state.pixelGrid);
    updatePixelGrid();
  });

  el.btnToggleBezel.addEventListener('click', () => {
    state.showBezel = !state.showBezel;
    el.hardwareBezel.style.border = state.showBezel ? '' : 'none';
    el.hardwareBezel.style.padding = state.showBezel ? '' : '0';
    el.hardwareBezel.style.background = state.showBezel ? '' : 'transparent';
    el.bezelLabel.style.display = state.showBezel ? 'block' : 'none';
    el.btnToggleBezel.classList.toggle('btn-primary', state.showBezel);
  });

  el.btnOpenFile.addEventListener('click', handleOpenFile);
  el.hiddenFileInput.addEventListener('change', handleFileInputChange);

  el.btnPasteClipboard.addEventListener('click', handlePasteFromClipboard);
  window.addEventListener('paste', handleWindowPaste);

  el.sampleSelect.addEventListener('change', () => {
    if (el.sampleSelect.value) {
      loadSample(el.sampleSelect.value);
      el.sampleSelect.value = '';
    }
  });

  el.videoScrubber.addEventListener('input', () => {
    if (state.sourceType === 'video') {
      if (currentGifAnimation) {
        const pct = parseFloat(el.videoScrubber.value) / 100;
        const idx = Math.min(
          currentGifAnimation.frames.length - 1,
          Math.floor(pct * currentGifAnimation.frames.length)
        );
        renderGifFrame(idx);
      } else if (el.hiddenVideo.duration) {
        const time = (parseFloat(el.videoScrubber.value) / 100) * el.hiddenVideo.duration;
        el.hiddenVideo.currentTime = time;
      }
    }
  });

  el.btnVideoPlayPause.addEventListener('click', toggleVideoPlay);
  el.btnPrevFrame.addEventListener('click', () => stepVideoFrame(-1));
  el.btnNextFrame.addEventListener('click', () => stepVideoFrame(1));

  el.btnSetInPoint.addEventListener('click', () => {
    if (state.sourceType === 'video') {
      state.videoInPoint = el.hiddenVideo.currentTime;
      updateRangeDisplay();
      updateVideoStats();
      showToast(`Punto de inicio fijado: ${state.videoInPoint.toFixed(2)}s`);
    }
  });

  el.btnSetOutPoint.addEventListener('click', () => {
    if (state.sourceType === 'video') {
      state.videoOutPoint = el.hiddenVideo.currentTime;
      updateRangeDisplay();
      updateVideoStats();
      showToast(`Punto de fin fijado: ${state.videoOutPoint.toFixed(2)}s`);
    }
  });

  el.btnResetRange.addEventListener('click', () => {
    if (state.sourceType === 'video') {
      state.videoInPoint = 0;
      state.videoOutPoint = el.hiddenVideo.duration || 0;
      updateRangeDisplay();
      updateVideoStats();
      showToast('Rango restablecido a video completo');
    }
  });

  el.videoLoopCheckbox.addEventListener('change', () => {
    state.videoLoop = el.videoLoopCheckbox.checked;
  });

  el.hiddenVideo.addEventListener('timeupdate', () => {
    if (state.sourceType === 'video') {
      const t = el.hiddenVideo.currentTime;
      const d = el.hiddenVideo.duration || 1;
      el.videoScrubber.value = String((t / d) * 100);
      el.currentTimeLabel.textContent = formatTime(t);
      const currentFrame = Math.round(t * state.videoTargetFps);
      el.currentFrameNum.textContent = `F: ${currentFrame}`;

      if (state.videoOutPoint > state.videoInPoint && t >= state.videoOutPoint) {
        if (state.videoLoop) {
          el.hiddenVideo.currentTime = state.videoInPoint;
        } else {
          el.hiddenVideo.pause();
          state.videoPlaying = false;
          updatePlayPauseIcon();
        }
      }

      renderCurrentFrame();
    }
  });

  el.hiddenVideo.addEventListener('seeked', () => {
    if (state.sourceType === 'video' && !state.videoPlaying) {
      renderCurrentFrame();
    }
  });

  el.btnCopyCode.addEventListener('click', () => {
    copyToClipboard(el.codeOutput.textContent || '');
    showToast('¡Código C/C++ copiado al portapapeles!');
  });

  el.btnCopySketch.addEventListener('click', () => {
    copyToClipboard(el.sketchOutput.textContent || '');
    showToast('¡Sketch Arduino copiado al portapapeles!');
  });

  el.btnHeaderExport.addEventListener('click', executeExport);
  el.btnExportMain.addEventListener('click', executeExport);

  // Bluetooth LE Event Listeners
  el.btnHeaderBle.addEventListener('click', openBleModal);
  el.btnBleSendSidebar.addEventListener('click', openBleModal);
  el.btnBleCloseModal.addEventListener('click', closeBleModal);
  el.btnBleDismiss.addEventListener('click', closeBleModal);
  el.btnBlePickLocalBin.addEventListener('click', handleBlePickLocalBin);
  el.btnBleStartUpload.addEventListener('click', startBleUpload);
  el.btnBleCancelUpload.addEventListener('click', cancelBleUpload);

  el.bleTabBtnUpload.addEventListener('click', () => switchBleTab('upload'));
  el.bleTabBtnBatch.addEventListener('click', () => switchBleTab('batch'));
  el.bleTabBtnManager.addEventListener('click', () => switchBleTab('manager'));
  el.bleTabBtnSettings.addEventListener('click', () => switchBleTab('settings'));
  el.btnBleRefreshFiles.addEventListener('click', () => loadBleSDFiles());
  el.btnBleAddBatchFiles.addEventListener('click', handleAddBatchFiles);
  el.btnBleClearBatch.addEventListener('click', () => {
    if (!isBatchUploading) {
      batchQueue = [];
      renderBatchList();
    }
  });
  el.btnBleStartBatchUpload.addEventListener('click', startBleBatchUpload);
  el.hiddenBatchFileInput.addEventListener('change', handleBatchFileInputChange);

  // Cargar preferencias de diapositivas y transiciones desde localStorage
  const savedSlideEn = localStorage.getItem('bm_slide_en');
  if (savedSlideEn !== null && el.bleSettingSlideshow) {
    el.bleSettingSlideshow.checked = savedSlideEn === '1';
  }
  const savedSlideSec = localStorage.getItem('bm_slide_sec');
  if (savedSlideSec !== null && el.bleSettingSlideInterval) {
    el.bleSettingSlideInterval.value = savedSlideSec;
    if (el.bleSlideIntervalLabel) el.bleSlideIntervalLabel.textContent = `${savedSlideSec} segundos`;
  }
  const savedTrans = localStorage.getItem('bm_trans_mode');
  if (savedTrans !== null && el.bleSettingTransition) {
    el.bleSettingTransition.value = savedTrans;
  }
  const savedBright = localStorage.getItem('bm_brightness');
  if (savedBright !== null && el.bleSettingBrightness) {
    el.bleSettingBrightness.value = savedBright;
    if (el.bleSettingBrightnessLabel) el.bleSettingBrightnessLabel.textContent = `${savedBright}%`;
  }

  if (el.bleSettingSlideInterval) {
    el.bleSettingSlideInterval.addEventListener('change', () => {
      const val = el.bleSettingSlideInterval.value;
      if (el.bleSlideIntervalLabel) el.bleSlideIntervalLabel.textContent = `${val} segundos`;
      localStorage.setItem('bm_slide_sec', val);
    });
  }

  if (el.bleSettingSlideshow) {
    el.bleSettingSlideshow.addEventListener('change', () => {
      localStorage.setItem('bm_slide_en', el.bleSettingSlideshow.checked ? '1' : '0');
    });
  }

  if (el.bleSettingTransition) {
    el.bleSettingTransition.addEventListener('change', () => {
      localStorage.setItem('bm_trans_mode', el.bleSettingTransition.value);
    });
  }

  if (el.bleSettingBrightness) {
    el.bleSettingBrightness.addEventListener('input', () => {
      const pct = el.bleSettingBrightness.value;
      if (el.bleSettingBrightnessLabel) el.bleSettingBrightnessLabel.textContent = `${pct}%`;
      localStorage.setItem('bm_brightness', pct);
    });
  }

  function getSleepBrightnessText(pct: number): string {
    if (pct === 0) return '0% (Luz apagada)';
    if (pct <= 10) return `${pct}% (Atenuado)`;
    if (pct <= 30) return `${pct}% (Tenue)`;
    return `${pct}% (Media luz)`;
  }

  function getSleepTimeoutText(sec: number): string {
    if (sec >= 60) {
      const min = Math.round(sec / 60);
      return `${min} minuto${min > 1 ? 's' : ''}`;
    }
    return `${sec} segundos`;
  }

  const savedSleepEn = localStorage.getItem('bm_sleep_enabled');
  if (savedSleepEn !== null && el.bleSettingSleepEnabled) {
    el.bleSettingSleepEnabled.checked = savedSleepEn === '1';
  }
  const savedSleepTimeout = localStorage.getItem('bm_sleep_timeout');
  if (savedSleepTimeout !== null && el.bleSettingSleepTimeout) {
    el.bleSettingSleepTimeout.value = savedSleepTimeout;
    if (el.bleSleepTimeoutLabel) el.bleSleepTimeoutLabel.textContent = getSleepTimeoutText(parseInt(savedSleepTimeout, 10));
  }
  const savedSleepBright = localStorage.getItem('bm_sleep_brightness');
  if (savedSleepBright !== null && el.bleSettingSleepBrightness) {
    el.bleSettingSleepBrightness.value = savedSleepBright;
    if (el.bleSettingSleepBrightnessLabel) el.bleSettingSleepBrightnessLabel.textContent = getSleepBrightnessText(parseInt(savedSleepBright, 10));
  }

  if (el.bleSettingSleepEnabled) {
    el.bleSettingSleepEnabled.addEventListener('change', () => {
      localStorage.setItem('bm_sleep_enabled', el.bleSettingSleepEnabled.checked ? '1' : '0');
    });
  }

  if (el.bleSettingSleepTimeout) {
    el.bleSettingSleepTimeout.addEventListener('change', () => {
      const val = parseInt(el.bleSettingSleepTimeout.value, 10) || 60;
      if (el.bleSleepTimeoutLabel) el.bleSleepTimeoutLabel.textContent = getSleepTimeoutText(val);
      localStorage.setItem('bm_sleep_timeout', val.toString());
    });
  }

  if (el.bleSettingSleepBrightness) {
    el.bleSettingSleepBrightness.addEventListener('input', () => {
      const pct = parseInt(el.bleSettingSleepBrightness.value, 10) || 0;
      if (el.bleSettingSleepBrightnessLabel) el.bleSettingSleepBrightnessLabel.textContent = getSleepBrightnessText(pct);
      localStorage.setItem('bm_sleep_brightness', pct.toString());
    });
  }

  if (el.btnBleApplySettings) {
    el.btnBleApplySettings.addEventListener('click', handleBleApplySettings);
  }
  if (el.btnBleRemotePrev) {
    el.btnBleRemotePrev.addEventListener('click', handleBleRemotePrev);
  }
  if (el.btnBleRemoteNext) {
    el.btnBleRemoteNext.addEventListener('click', handleBleRemoteNext);
  }

  const optBleFull = document.getElementById('bleOptVideoFull');
  const optBleFrame = document.getElementById('bleOptVideoFrame');
  if (optBleFull) optBleFull.addEventListener('change', updateBleModalFileInfo);
  if (optBleFrame) optBleFrame.addEventListener('change', updateBleModalFileInfo);

  el.bleModalOverlay.addEventListener('click', (e) => {
    if (e.target === el.bleModalOverlay) {
      closeBleModal();
    }
  });

  if (window.bitmapperAPI && window.bitmapperAPI.onBluetoothDevices) {
    window.bitmapperAPI.onBluetoothDevices((devices) => {
      const bm = devices.find(d => d.deviceName && d.deviceName.toLowerCase().includes('bitmapper'));
      if (bm) {
        el.bleDeviceNameLabel.textContent = `${bm.deviceName || 'BitMapper-ESP32'} (Detectado)`;
      }
    });
  }

  el.targetCanvas.addEventListener('mousemove', handlePixelHover);
  el.targetCanvas.addEventListener('mouseleave', () => {
    el.pixelInspector.style.display = 'none';
    el.statusPixelCoord.textContent = 'X: 0, Y: 0';
  });

  setupDragAndDrop();

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName)) return;

    if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
      e.preventDefault();
      handleOpenFile();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      executeExport();
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
      e.preventDefault();
      openBleModal();
    } else if (e.code === 'Space' && state.sourceType === 'video') {
      e.preventDefault();
      toggleVideoPlay();
    } else if (e.code === 'ArrowLeft' && state.sourceType === 'video') {
      e.preventDefault();
      stepVideoFrame(-1);
    } else if (e.code === 'ArrowRight' && state.sourceType === 'video') {
      e.preventDefault();
      stepVideoFrame(1);
    }
  });

  setupPixelArtTools();
  setupFontGenerator();
  setupPreviewRecorders();
}

function setupPixelArtTools(): void {
  const toolBtns: Array<{ btn: HTMLButtonElement; tool: PixelEditTool }> = [
    { btn: el.toolPointer, tool: 'pointer' },
    { btn: el.toolPencil, tool: 'pencil' },
    { btn: el.toolEraser, tool: 'eraser' },
    { btn: el.toolText, tool: 'text' }
  ];

  function setActiveTool(tool: PixelEditTool) {
    pixelEditor.setTool(tool);
    toolBtns.forEach(({ btn, tool: t }) => {
      if (btn) btn.classList.toggle('active', t === tool);
    });
    if (el.pixelTextControlGroup) {
      el.pixelTextControlGroup.style.display = tool === 'text' ? 'flex' : 'none';
    }
    el.targetCanvas.style.cursor = tool === 'pointer' ? 'default' : 'crosshair';
  }

  toolBtns.forEach(({ btn, tool }) => {
    if (btn) {
      btn.addEventListener('click', () => setActiveTool(tool));
    }
  });

  // Palette swatches
  const swatches = document.querySelectorAll('.swatch-btn');
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      const hex = swatch.getAttribute('data-color') || '#ffffff';
      const clean = hex.replace('#', '');
      const r = parseInt(clean.substring(0, 2), 16);
      const g = parseInt(clean.substring(2, 4), 16);
      const b = parseInt(clean.substring(4, 6), 16);
      pixelEditor.setColor(r, g, b, 255);
      if (el.pixelColorCustom) el.pixelColorCustom.value = hex;
    });
  });

  if (el.pixelColorCustom) {
    el.pixelColorCustom.addEventListener('input', () => {
      const hex = el.pixelColorCustom.value;
      const clean = hex.replace('#', '');
      const r = parseInt(clean.substring(0, 2), 16);
      const g = parseInt(clean.substring(2, 4), 16);
      const b = parseInt(clean.substring(4, 6), 16);
      pixelEditor.setColor(r, g, b, 255);
      swatches.forEach(s => s.classList.remove('active'));
    });
  }

  if (el.btnPixelUndo) {
    el.btnPixelUndo.addEventListener('click', () => {
      if (pixelEditor.undo()) {
        refreshCurrentFrame();
        updatePixelBadge();
      }
    });
  }

  if (el.btnPixelClear) {
    el.btnPixelClear.addEventListener('click', () => {
      pixelEditor.clear();
      refreshCurrentFrame();
      updatePixelBadge();
      showToast('Retoques eliminados');
    });
  }

  function updatePixelBadge() {
    if (el.pixelEditBadge) {
      el.pixelEditBadge.textContent = `${pixelEditor.getEditCount()} ed.`;
    }
  }

  let isDrawing = false;

  function applyToolAtPointer(e: MouseEvent) {
    if (pixelEditor.activeTool === 'pointer') return;
    const rect = el.targetCanvas.getBoundingClientRect();
    const scaleX = state.targetWidth / rect.width;
    const scaleY = state.targetHeight / rect.height;
    const px = Math.floor((e.clientX - rect.left) * scaleX);
    const py = Math.floor((e.clientY - rect.top) * scaleY);

    if (px < 0 || px >= state.targetWidth || py < 0 || py >= state.targetHeight) return;

    if (pixelEditor.activeTool === 'pencil') {
      pixelEditor.setPixel(px, py, state.targetWidth, state.targetHeight);
      refreshCurrentFrame();
    } else if (pixelEditor.activeTool === 'eraser') {
      pixelEditor.erasePixel(px, py, state.targetWidth, state.targetHeight);
      refreshCurrentFrame();
    } else if (pixelEditor.activeTool === 'text') {
      const txt = el.pixelTextInput ? el.pixelTextInput.value : 'ESP32';
      pixelEditor.stampText(txt, px, py, state.targetWidth, state.targetHeight);
      refreshCurrentFrame();
    }
    updatePixelBadge();
  }

  el.targetCanvas.addEventListener('mousedown', (e) => {
    if (pixelEditor.activeTool === 'pointer') return;
    isDrawing = true;
    applyToolAtPointer(e);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDrawing || pixelEditor.activeTool === 'pointer') return;
    applyToolAtPointer(e);
  });

  window.addEventListener('mouseup', () => {
    isDrawing = false;
  });
}

let currentFontResult: ReturnType<typeof generateBitmapFont> | null = null;

function setupFontGenerator(): void {
  if (el.btnHeaderFontGen) {
    el.btnHeaderFontGen.addEventListener('click', () => {
      el.fontModalOverlay.style.display = 'flex';
      updateFontPreview();
    });
  }

  const closeBtn = () => { el.fontModalOverlay.style.display = 'none'; };
  if (el.btnCloseFontModal) el.btnCloseFontModal.addEventListener('click', closeBtn);
  if (el.btnDismissFontModal) el.btnDismissFontModal.addEventListener('click', closeBtn);
  el.fontModalOverlay.addEventListener('click', (e) => {
    if (e.target === el.fontModalOverlay) closeBtn();
  });

  [el.fontFamilySelect, el.fontSizeSelect, el.fontWeightSelect, el.fontRangeSelect].forEach(sel => {
    if (sel) sel.addEventListener('change', updateFontPreview);
  });

  if (el.fontTestInput) {
    el.fontTestInput.addEventListener('input', renderFontTestText);
  }

  if (el.btnCopyFontHeader) {
    el.btnCopyFontHeader.addEventListener('click', async () => {
      if (!currentFontResult) return;
      try {
        await navigator.clipboard.writeText(currentFontResult.headerContent);
        showToast('✔ ¡Código C++ de fuente copiado al portapapeles!');
      } catch (err) {
        showToast('Error al copiar fuente al portapapeles');
      }
    });
  }

  if (el.btnDownloadFontHeader) {
    el.btnDownloadFontHeader.addEventListener('click', async () => {
      if (!currentFontResult) return;
      await saveFileOrDownload(`${currentFontResult.fontName}.h`, currentFontResult.headerContent, 'text/x-c', false);
    });
  }

  function updateFontPreview() {
    const family = el.fontFamilySelect?.value || 'monospace';
    const size = parseInt(el.fontSizeSelect?.value || '12', 10);
    const weight = el.fontWeightSelect?.value || 'normal';
    const range = el.fontRangeSelect?.value || '32-126';
    const [first, last] = range.split('-').map(Number);

    currentFontResult = generateBitmapFont({
      fontFamily: family,
      fontSize: size,
      fontWeight: weight,
      firstChar: first,
      lastChar: last
    });

    if (el.fontTotalBytesLabel) {
      el.fontTotalBytesLabel.textContent = `${currentFontResult.totalBitmapsSize} bytes Flash | yAdvance: ${currentFontResult.yAdvance}px`;
    }

    if (el.fontGlyphGrid) {
      el.fontGlyphGrid.innerHTML = '';
      currentFontResult.glyphs.forEach(g => {
        const card = document.createElement('div');
        card.className = 'font-glyph-card';
        card.title = `ASCII ${g.ascii}: '${g.char}' | ${g.width}x${g.height} px`;
        card.innerHTML = `
          <div class="font-glyph-char">${g.char === ' ' ? '&blank;' : g.char}</div>
          <div class="font-glyph-ascii">${g.ascii}</div>
        `;
        el.fontGlyphGrid.appendChild(card);
      });
    }

    renderFontTestText();
  }

  function renderFontTestText() {
    if (!el.fontTestCanvas || !el.fontTestInput) return;
    const ctx = el.fontTestCanvas.getContext('2d')!;
    const w = el.fontTestCanvas.width;
    const h = el.fontTestCanvas.height;
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, w, h);

    const family = el.fontFamilySelect?.value || 'monospace';
    const size = parseInt(el.fontSizeSelect?.value || '12', 10);
    const weight = el.fontWeightSelect?.value || 'normal';

    ctx.fillStyle = '#06b6d4';
    ctx.font = `${weight} ${size}px "${family}", monospace, sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.fillText(el.fontTestInput.value || '', 10, h / 2);
  }
}

function setupPreviewRecorders(): void {
  if (el.btnHeaderCopyClipboard) {
    el.btnHeaderCopyClipboard.addEventListener('click', async () => {
      const ok = await copyCanvasToClipboard(el.targetCanvas);
      if (ok) {
        showToast('✔ ¡Imagen copiada al portapapeles!');
      } else {
        showToast('❌ Error al copiar imagen al portapapeles');
      }
    });
  }

  if (el.btnHeaderRecordAnim) {
    el.btnHeaderRecordAnim.addEventListener('click', async () => {
      if (state.sourceType !== 'video') return;
      el.btnHeaderRecordAnim.disabled = true;
      el.btnHeaderRecordAnim.textContent = 'Grabando...';

      try {
        const total = currentGifAnimation
          ? currentGifAnimation.frames.length
          : Math.max(1, Math.round((state.videoOutPoint - state.videoInPoint) * state.videoTargetFps));

        showToast(`Grabando animación (${total} fotogramas)...`);

        const blob = await recordCanvasAnimation(
          el.targetCanvas,
          async (idx) => {
            if (currentGifAnimation) {
              renderGifFrame(idx);
            } else {
              const t = state.videoInPoint + (idx / state.videoTargetFps);
              await seekVideo(t);
              processFrame(el.hiddenVideo);
            }
          },
          total,
          state.videoTargetFps,
          (pct) => {
            el.statusReady.textContent = `Grabando animación: ${pct}%`;
          }
        );

        el.statusReady.textContent = 'Listo';
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${state.variableName}_anim_preview.webm`;
        link.click();
        showToast('✔ ¡Vista previa animada grabada y descargada!');
      } catch (err: any) {
        console.error('Error al grabar animación:', err);
        showToast(`Error al grabar: ${err?.message || err}`);
      } finally {
        el.btnHeaderRecordAnim.disabled = false;
        el.btnHeaderRecordAnim.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg> 🎬 Grabar Animación`;
      }
    });
  }
}

function updateBezelStyle(shape: string, name: string): void {
  el.hardwareBezel.className = `hardware-bezel ${shape}`;
  el.bezelLabel.textContent = name;
}

function applyZoom(): void {
  el.targetCanvas.style.width = `${state.targetWidth * state.zoom}px`;
  el.targetCanvas.style.height = `${state.targetHeight * state.zoom}px`;
}

function updatePixelGrid(): void {
  if (state.pixelGrid && state.zoom >= 3) {
    el.targetCanvas.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.15)';
    el.bezelScreenGlass.classList.add('pixel-grid-active');
  } else {
    el.targetCanvas.style.boxShadow = 'none';
    el.bezelScreenGlass.classList.remove('pixel-grid-active');
  }
}

function handlePixelHover(e: MouseEvent): void {
  const rect = el.targetCanvas.getBoundingClientRect();
  const scaleX = state.targetWidth / rect.width;
  const scaleY = state.targetHeight / rect.height;

  const x = Math.floor((e.clientX - rect.left) * scaleX);
  const y = Math.floor((e.clientY - rect.top) * scaleY);

  if (x < 0 || x >= state.targetWidth || y < 0 || y >= state.targetHeight) {
    el.pixelInspector.style.display = 'none';
    return;
  }

  const p = targetCtx.getImageData(x, y, 1, 1).data;
  const r5 = (p[0] >> 3) & 0x1f;
  const g6 = (p[1] >> 2) & 0x3f;
  const b5 = (p[2] >> 3) & 0x1f;
  const rgb565 = (r5 << 11) | (g6 << 5) | b5;
  const hex565 = '0x' + rgb565.toString(16).toUpperCase().padStart(4, '0');

  el.statusPixelCoord.textContent = `X: ${x}, Y: ${y} | RGB: (${p[0]}, ${p[1]}, ${p[2]}) | RGB565: ${hex565}`;

  el.inspectorSwatch.style.backgroundColor = `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
  el.inspectorText.textContent = `(${x}, ${y}) RGB: (${p[0]}, ${p[1]}, ${p[2]}) -> ${hex565}`;

  el.pixelInspector.style.display = 'block';
  el.pixelInspector.style.left = `${e.clientX + 15}px`;
  el.pixelInspector.style.top = `${e.clientY + 15}px`;
}

let currentGifAnimation: DecodedGifResult | null = null;
let currentGifFrameIdx = 0;
let gifPlaybackTimer: ReturnType<typeof setTimeout> | null = null;

async function handleOpenFile(): Promise<void> {
  if (window.bitmapperAPI && window.bitmapperAPI.openFile) {
    const fileInfo = await window.bitmapperAPI.openFile();
    if (!fileInfo) return;

    const fileUrl = 'file:///' + fileInfo.filePath.replace(/\\/g, '/');
    if (fileInfo.fileName.toLowerCase().endsWith('.gif')) {
      try {
        const resp = await fetch(fileUrl);
        const blob = await resp.blob();
        await loadGifMedia(blob, fileInfo.fileName, fileInfo.baseName);
        return;
      } catch (err) {
        console.warn('Error al leer GIF via fetch, usando fallback:', err);
      }
    }
    loadMediaFromUrl(fileUrl, fileInfo.fileName, fileInfo.baseName, fileInfo.isVideo);
  } else {
    el.hiddenFileInput.click();
  }
}

async function handleFileInputChange(e: Event): Promise<void> {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const baseName = file.name.replace(/\.[^/.]+$/, '');
  if (file.name.toLowerCase().endsWith('.gif') || file.type === 'image/gif') {
    await loadGifMedia(file, file.name, baseName);
    el.hiddenFileInput.value = '';
    return;
  }

  const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|avi|mkv)$/i.test(file.name);
  const url = URL.createObjectURL(file);
  loadMediaFromUrl(url, file.name, baseName, isVideo);
  el.hiddenFileInput.value = '';
}

async function loadGifMedia(fileOrBlob: Blob, fileName: string, baseName: string): Promise<void> {
  try {
    showToast(`Decodificando GIF animado "${fileName}"...`);
    const decoded = await decodeGifAnimation(fileOrBlob);
    if (!decoded.isAnimated || decoded.frames.length <= 1) {
      const url = URL.createObjectURL(fileOrBlob);
      loadMediaFromUrl(url, fileName, baseName, false);
      return;
    }

    if (gifPlaybackTimer) clearTimeout(gifPlaybackTimer);
    currentGifAnimation = decoded;
    currentGifFrameIdx = 0;

    state.sourceType = 'video';
    state.sourceFileName = fileName;
    state.sourceBaseName = baseName;
    state.variableName = baseName.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
    el.variableNameInput.value = state.variableName;

    state.sourceWidth = decoded.width;
    state.sourceHeight = decoded.height;
    state.videoDuration = decoded.totalDurationMs / 1000;
    state.videoInPoint = 0;
    state.videoOutPoint = state.videoDuration;
    state.videoTargetFps = decoded.averageFps;
    state.videoPlaying = false;

    el.sourceTypeBadge.textContent = 'GIF ANIMADO';
    el.sourceTypeBadge.style.background = 'rgba(236, 72, 153, 0.2)';
    el.sourceTypeBadge.style.color = '#f472b6';
    el.videoSection.style.display = 'block';
    el.videoTimelineBar.classList.add('visible');
    if (el.btnHeaderRecordAnim) el.btnHeaderRecordAnim.style.display = 'inline-flex';

    el.sourceDetails.innerHTML = `<strong>${fileName}</strong><br>Resolución: ${decoded.width}×${decoded.height} px<br>Fotogramas: ${decoded.frameCount} cuadros (~${decoded.averageFps} FPS)`;
    el.videoDurationBadge.textContent = `${state.videoDuration.toFixed(1)}s`;
    el.totalTimeLabel.textContent = formatTime(state.videoDuration);

    updateRangeDisplay();
    updateVideoStats();
    updateExportFormatsForSource();
    updatePlayPauseIcon();

    renderGifFrame(0);
    showToast(`✔ GIF animado: ${decoded.frameCount} fotogramas a ~${decoded.averageFps} FPS`);
  } catch (err: any) {
    console.warn('Fallback a imagen estándar para GIF:', err);
    const url = URL.createObjectURL(fileOrBlob);
    loadMediaFromUrl(url, fileName, baseName, false);
  }
}

function renderGifFrame(idx: number): void {
  if (!currentGifAnimation || !currentGifAnimation.frames[idx]) return;
  currentGifFrameIdx = idx;
  const f = currentGifAnimation.frames[idx];
  processFrame(f.bitmap);

  const currentTimeSec = (idx / currentGifAnimation.frames.length) * state.videoDuration;
  el.currentTimeLabel.textContent = formatTime(currentTimeSec);
  el.videoScrubber.value = String((idx / (currentGifAnimation.frames.length - 1 || 1)) * 100);
  el.currentFrameNum.textContent = `F: ${idx + 1}/${currentGifAnimation.frames.length}`;
}

function playNextGifFrame(): void {
  if (!currentGifAnimation || !state.videoPlaying) return;
  currentGifFrameIdx = (currentGifFrameIdx + 1) % currentGifAnimation.frames.length;
  renderGifFrame(currentGifFrameIdx);
  const delay = currentGifAnimation.frames[currentGifFrameIdx].durationMs || 100;
  gifPlaybackTimer = setTimeout(playNextGifFrame, delay);
}

function refreshCurrentFrame(): void {
  if (state.sourceType === 'video') {
    if (currentGifAnimation) {
      renderGifFrame(currentGifFrameIdx);
    } else {
      processFrame(el.hiddenVideo);
    }
  } else if (state.sourceElement) {
    processFrame(state.sourceElement);
  }
}

function loadMediaFromUrl(url: string, fileName: string, baseName: string, isVideo: boolean): void {
  if (gifPlaybackTimer) clearTimeout(gifPlaybackTimer);
  currentGifAnimation = null;

  state.sourceFileName = fileName;
  state.sourceBaseName = baseName;
  state.variableName = baseName.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
  el.variableNameInput.value = state.variableName;

  if (isVideo) {
    state.sourceType = 'video';
    state.exportFormat = 'binary';
    el.sourceTypeBadge.textContent = 'VIDEO';
    el.sourceTypeBadge.style.background = 'rgba(139, 92, 246, 0.2)';
    el.sourceTypeBadge.style.color = 'var(--accent-violet)';
    el.videoSection.style.display = 'block';
    el.videoTimelineBar.classList.add('visible');
    if (el.btnHeaderRecordAnim) el.btnHeaderRecordAnim.style.display = 'inline-flex';
    updateExportFormatsForSource();

    el.hiddenVideo.src = url;
    el.hiddenVideo.load();
    el.hiddenVideo.onloadedmetadata = () => {
      state.sourceWidth = el.hiddenVideo.videoWidth;
      state.sourceHeight = el.hiddenVideo.videoHeight;
      state.videoDuration = el.hiddenVideo.duration;
      state.videoInPoint = 0;
      state.videoOutPoint = el.hiddenVideo.duration;

      el.sourceDetails.innerHTML = `<strong>${fileName}</strong><br>Resolución: ${state.sourceWidth}×${state.sourceHeight} px<br>Duración: ${state.videoDuration.toFixed(1)}s`;
      el.videoDurationBadge.textContent = `${state.videoDuration.toFixed(1)}s`;
      el.totalTimeLabel.textContent = formatTime(state.videoDuration);

      updateRangeDisplay();
      updateVideoStats();

      el.hiddenVideo.currentTime = 0;
      showToast(`Video cargado: ${fileName}`);
    };
  } else {
    state.sourceType = 'image';
    el.sourceTypeBadge.textContent = 'IMAGEN';
    el.sourceTypeBadge.style.background = 'rgba(6, 182, 212, 0.15)';
    el.sourceTypeBadge.style.color = 'var(--accent-cyan)';
    el.videoSection.style.display = 'none';
    el.videoTimelineBar.classList.remove('visible');
    if (el.btnHeaderRecordAnim) el.btnHeaderRecordAnim.style.display = 'none';
    updateExportFormatsForSource();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      state.sourceElement = img;
      state.sourceWidth = img.naturalWidth;
      state.sourceHeight = img.naturalHeight;

      el.sourceDetails.innerHTML = `<strong>${fileName}</strong><br>Resolución: ${state.sourceWidth}×${state.sourceHeight} px`;
      showToast(`Imagen cargada: ${fileName}`);
      updatePipeline();
    };
    img.src = url;
  }
}

async function handlePasteFromClipboard(): Promise<void> {
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const item of clipboardItems) {
      for (const type of item.types) {
        if (type.startsWith('image/')) {
          const blob = await item.getType(type);
          const url = URL.createObjectURL(blob);
          loadMediaFromUrl(url, 'pasted_image.png', 'pasted_image', false);
          return;
        }
      }
    }
    showToast('No se encontró ninguna imagen en el portapapeles');
  } catch {
    showToast('Presiona Ctrl+V para pegar directamente');
  }
}

function handleWindowPaste(e: ClipboardEvent): void {
  if (e.clipboardData && e.clipboardData.items) {
    for (let i = 0; i < e.clipboardData.items.length; i++) {
      const item = e.clipboardData.items[i];
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        if (blob) {
          const url = URL.createObjectURL(blob);
          loadMediaFromUrl(url, 'pasted_image.png', 'pasted_image', false);
          return;
        }
      }
    }
  }
}

function setupDragAndDrop(): void {
  window.addEventListener('dragover', (e) => {
    e.preventDefault();
    el.dragOverlay.classList.add('active');
  });

  window.addEventListener('dragleave', (e) => {
    if (e.relatedTarget === null) {
      el.dragOverlay.classList.remove('active');
    }
  });

  window.addEventListener('drop', (e) => {
    e.preventDefault();
    el.dragOverlay.classList.remove('active');

    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      if (e.dataTransfer.files.length === 1) {
        const file = e.dataTransfer.files[0];
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        if (file.name.toLowerCase().endsWith('.gif') || file.type === 'image/gif') {
          loadGifMedia(file, file.name, baseName);
          return;
        }
        const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|avi|mkv)$/i.test(file.name);
        const url = URL.createObjectURL(file);
        loadMediaFromUrl(url, file.name, baseName, isVideo);
      } else {
        const filesToAdd: Array<{ name: string; file: File; isBin: boolean }> = [];
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          const f = e.dataTransfer.files[i];
          const isBin = f.name.toLowerCase().endsWith('.bin');
          filesToAdd.push({ name: f.name, file: f, isBin });
        }
        addFilesToBatch(filesToAdd);
        openBleModal();
        switchBleTab('batch');
        showToast(`¡${filesToAdd.length} imágenes añadidas a la cola por lote!`);
      }
    }
  });
}

function toggleVideoPlay(): void {
  if (state.sourceType !== 'video') return;

  if (currentGifAnimation) {
    if (state.videoPlaying) {
      state.videoPlaying = false;
      if (gifPlaybackTimer) clearTimeout(gifPlaybackTimer);
    } else {
      state.videoPlaying = true;
      playNextGifFrame();
    }
    updatePlayPauseIcon();
    return;
  }

  if (state.videoPlaying) {
    el.hiddenVideo.pause();
    state.videoPlaying = false;
  } else {
    if (el.hiddenVideo.currentTime >= state.videoOutPoint) {
      el.hiddenVideo.currentTime = state.videoInPoint;
    }
    el.hiddenVideo.play();
    state.videoPlaying = true;
  }
  updatePlayPauseIcon();
}

function updatePlayPauseIcon(): void {
  el.playIcon.style.display = state.videoPlaying ? 'none' : 'block';
  el.pauseIcon.style.display = state.videoPlaying ? 'block' : 'none';
}

function stepVideoFrame(dir: number): void {
  if (state.sourceType !== 'video') return;

  if (currentGifAnimation) {
    state.videoPlaying = false;
    if (gifPlaybackTimer) clearTimeout(gifPlaybackTimer);
    updatePlayPauseIcon();
    const nextIdx = (currentGifFrameIdx + dir + currentGifAnimation.frames.length) % currentGifAnimation.frames.length;
    renderGifFrame(nextIdx);
    return;
  }

  el.hiddenVideo.pause();
  state.videoPlaying = false;
  updatePlayPauseIcon();

  const step = 1 / state.videoTargetFps;
  let nextTime = el.hiddenVideo.currentTime + dir * step;
  nextTime = Math.max(0, Math.min(el.hiddenVideo.duration, nextTime));
  el.hiddenVideo.currentTime = nextTime;
}

function updateRangeDisplay(): void {
  el.rangeDisplay.textContent = `Rango: ${state.videoInPoint.toFixed(1)}s a ${state.videoOutPoint.toFixed(1)}s`;
}

function updateVideoStats(): void {
  if (state.sourceType !== 'video') return;
  const duration = Math.max(0, state.videoOutPoint - state.videoInPoint);
  const totalFrames = Math.max(1, Math.round(duration * state.videoTargetFps));
  const bytesPerPixel = (COLOR_FORMATS.find(x => x.id === state.colorFormat) || {}).bytesPerPixel || 2;
  const bytesPerFrame = state.targetWidth * state.targetHeight * bytesPerPixel;
  const totalBytes = bytesPerFrame * totalFrames;

  el.videoTotalFrames.textContent = String(totalFrames);
  el.videoEstFlash.textContent = `${(totalBytes / 1024).toFixed(1)} KB`;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.floor((sec % 1) * 100);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

function loadSample(type: string): void {
  const sCanvas = document.createElement('canvas');
  sCanvas.width = 300;
  sCanvas.height = 300;
  const sCtx = sCanvas.getContext('2d')!;

  if (type === 'cyberpunk') {
    const grad = sCtx.createLinearGradient(0, 0, 0, 300);
    grad.addColorStop(0, '#0a0a23');
    grad.addColorStop(0.6, '#4a0e4e');
    grad.addColorStop(1, '#ff007f');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 300, 300);

    sCtx.beginPath();
    sCtx.arc(150, 140, 60, 0, Math.PI * 2);
    sCtx.fillStyle = '#ffde59';
    sCtx.shadowColor = '#ff577f';
    sCtx.shadowBlur = 30;
    sCtx.fill();
    sCtx.shadowBlur = 0;

    sCtx.fillStyle = '#4a0e4e';
    for (let y = 140; y < 200; y += 8) {
      sCtx.fillRect(80, y, 140, (y - 130) * 0.08 + 2);
    }

    sCtx.fillStyle = '#050510';
    sCtx.fillRect(0, 190, 300, 110);
    sCtx.strokeStyle = '#00f0ff';
    sCtx.lineWidth = 1.5;
    for (let x = -50; x <= 350; x += 30) {
      sCtx.beginPath();
      sCtx.moveTo(x, 300);
      sCtx.lineTo(150, 190);
      sCtx.stroke();
    }
    for (let y = 195; y <= 300; y += (y - 180) * 0.4 + 4) {
      sCtx.beginPath();
      sCtx.moveTo(0, y);
      sCtx.lineTo(300, y);
      sCtx.stroke();
    }

    sCtx.font = 'bold 22px sans-serif';
    sCtx.fillStyle = '#00f0ff';
    sCtx.textAlign = 'center';
    sCtx.shadowColor = '#00f0ff';
    sCtx.shadowBlur = 15;
    sCtx.fillText('ESP32 ST7789', 150, 50);
  } else if (type === 'colorwheel') {
    sCtx.fillStyle = '#111';
    sCtx.fillRect(0, 0, 300, 300);
    const cx = 150, cy = 150, radius = 120;
    for (let angle = 0; angle < 360; angle += 1) {
      const rad = (angle * Math.PI) / 180;
      sCtx.beginPath();
      sCtx.moveTo(cx, cy);
      sCtx.arc(cx, cy, radius, rad, rad + (Math.PI / 180) * 1.5);
      sCtx.closePath();
      sCtx.fillStyle = `hsl(${angle}, 100%, 50%)`;
      sCtx.fill();
    }
  } else if (type === 'testcard') {
    const colors = ['#ffffff', '#ffff00', '#00ffff', '#00ff00', '#ff00ff', '#ff0000', '#0000ff'];
    const barW = 300 / 7;
    colors.forEach((c, idx) => {
      sCtx.fillStyle = c;
      sCtx.fillRect(idx * barW, 0, barW, 200);
    });
    sCtx.fillStyle = '#0000ff';
    sCtx.fillRect(0, 200, 300 / 6, 100);
    sCtx.fillStyle = '#ffffff';
    sCtx.fillRect(300 / 6, 200, 300 / 6, 100);
    sCtx.fillStyle = '#ff00ff';
    sCtx.fillRect((300 / 6) * 2, 200, 300 / 6, 100);
    sCtx.fillStyle = '#131313';
    sCtx.fillRect((300 / 6) * 3, 200, 300 / 2, 100);
  } else {
    sCtx.fillStyle = '#0d1117';
    sCtx.fillRect(0, 0, 300, 300);
    sCtx.fillStyle = '#1f242c';
    sCtx.fillRect(60, 60, 180, 180);
    sCtx.strokeStyle = '#f59e0b';
    sCtx.lineWidth = 4;
    sCtx.strokeRect(60, 60, 180, 180);

    sCtx.fillStyle = '#94a3b8';
    for (let i = 80; i <= 220; i += 20) {
      sCtx.fillRect(i - 4, 40, 8, 20);
      sCtx.fillRect(i - 4, 240, 8, 20);
      sCtx.fillRect(40, i - 4, 20, 8);
      sCtx.fillRect(240, i - 4, 20, 8);
    }

    sCtx.fillStyle = '#fff';
    sCtx.font = 'bold 20px monospace';
    sCtx.textAlign = 'center';
    sCtx.fillText('ESP32-S3', 150, 145);
    sCtx.font = '12px monospace';
    sCtx.fillStyle = '#10b981';
    sCtx.fillText('240MHz Dual-Core', 150, 175);
  }

  const img = new Image();
  img.onload = () => {
    state.sourceType = 'image';
    state.sourceElement = img;
    state.sourceFileName = `sample_${type}.png`;
    state.sourceBaseName = `sample_${type}`;
    state.variableName = `sample_${type}`;
    el.variableNameInput.value = state.variableName;
    state.sourceWidth = 300;
    state.sourceHeight = 300;

    el.sourceTypeBadge.textContent = 'EJEMPLO';
    el.sourceTypeBadge.style.background = 'rgba(16, 185, 129, 0.15)';
    el.sourceTypeBadge.style.color = 'var(--accent-emerald)';
    el.videoSection.style.display = 'none';
    el.videoTimelineBar.classList.remove('visible');
    el.sourceDetails.innerHTML = `<strong>Ejemplo: ${type.toUpperCase()}</strong><br>Resolución: 300×300 px`;
    updateExportFormatsForSource();
    updatePipeline();
  };
  img.src = sCanvas.toDataURL();
}

function updatePipeline(): void {
  if (state.sourceType === 'video') {
    renderCurrentFrame();
  } else if (state.sourceElement) {
    processFrame(state.sourceElement);
  }
}

function renderCurrentFrame(): void {
  if (state.sourceType === 'video' && el.hiddenVideo.readyState >= 2) {
    processFrame(el.hiddenVideo);
  }
}

function processFrame(source: HTMLImageElement | HTMLVideoElement | ImageBitmap): void {
  const tw = state.targetWidth;
  const th = state.targetHeight;

  workCanvas.width = tw;
  workCanvas.height = th;
  el.targetCanvas.width = tw;
  el.targetCanvas.height = th;
  el.compareTargetCanvas.width = tw;
  el.compareTargetCanvas.height = th;

  applyZoom();
  updatePixelGrid();
  renderOriginalCanvas(source);

  workCtx.save();
  workCtx.fillStyle = state.bgColor;
  workCtx.fillRect(0, 0, tw, th);

  workCtx.translate(tw / 2, th / 2);
  if (state.rotation !== 0) {
    workCtx.rotate((state.rotation * Math.PI) / 180);
  }
  workCtx.scale(state.flipH ? -1 : 1, state.flipV ? -1 : 1);

  const sw = (source as HTMLVideoElement).videoWidth || (source as HTMLImageElement).naturalWidth || source.width;
  const sh = (source as HTMLVideoElement).videoHeight || (source as HTMLImageElement).naturalHeight || source.height;

  let dw = tw, dh = th;
  let dx = -tw / 2, dy = -th / 2;

  if (state.scalingMode === 'stretch') {
    dw = tw; dh = th;
  } else if (state.scalingMode === 'center') {
    dw = sw; dh = sh;
    dx = -sw / 2; dy = -sh / 2;
  } else if (state.scalingMode === 'contain') {
    const scale = Math.min(tw / sw, th / sh);
    dw = sw * scale;
    dh = sh * scale;
    dx = -dw / 2;
    dy = -dh / 2;
  } else if (state.scalingMode === 'cover') {
    const scale = Math.max(tw / sw, th / sh);
    dw = sw * scale;
    dh = sh * scale;
    dx = -dw / 2;
    dy = -dh / 2;
  }

  workCtx.drawImage(source, dx, dy, dw, dh);
  workCtx.restore();

  const imgData = workCtx.getImageData(0, 0, tw, th);
  const d = imgData.data;

  const bAdj = state.brightness;
  const cFactor = (259 * (state.contrast + 255)) / (255 * (259 - state.contrast));
  const gammaVal = state.gamma;

  for (let i = 0; i < d.length; i += 4) {
    let r = d[i];
    let g = d[i + 1];
    let b = d[i + 2];

    if (bAdj !== 0) {
      r += bAdj;
      g += bAdj;
      b += bAdj;
    }

    if (state.contrast !== 0) {
      r = cFactor * (r - 128) + 128;
      g = cFactor * (g - 128) + 128;
      b = cFactor * (b - 128) + 128;
    }

    if (gammaVal !== 1.0) {
      r = 255 * Math.pow(Math.max(0, r) / 255, 1 / gammaVal);
      g = 255 * Math.pow(Math.max(0, g) / 255, 1 / gammaVal);
      b = 255 * Math.pow(Math.max(0, b) / 255, 1 / gammaVal);
    }

    d[i] = clamp(r);
    d[i + 1] = clamp(g);
    d[i + 2] = clamp(b);
  }

  const quantizedData = applyDithering(
    d,
    tw,
    th,
    state.ditherAlgorithm,
    state.colorFormat,
    state.threshold
  );

  const finalImgData = targetCtx.createImageData(tw, th);
  finalImgData.data.set(quantizedData);

  // Apply Pixel Art edits and retro font stamps
  pixelEditor.applyToImageData(finalImgData, tw, th);

  targetCtx.putImageData(finalImgData, 0, 0);
  compareCtx.putImageData(finalImgData, 0, 0);

  const encoded = encodeBitmap(finalImgData.data, tw, th, {
    colorFormat: state.colorFormat,
    endian: state.endian,
    swapBytes: state.swapBytes,
    invert: state.invertColors
  });
  state.currentEncoded = encoded;

  el.statusDim.textContent = `Resolución: ${tw} × ${th} px`;
  const fmt = COLOR_FORMATS.find(x => x.id === state.colorFormat);
  el.statusFormat.textContent = `${fmt ? fmt.name.split(' ')[0] : 'RGB565'} | Dither: ${state.ditherAlgorithm.toUpperCase()}`;
  el.statusMemory.textContent = `Memoria: ${(encoded.sizeBytes / 1024).toFixed(1)} KB`;

  updateCodePreview();
  updateSketches();
}

function renderOriginalCanvas(source: HTMLImageElement | HTMLVideoElement | ImageBitmap): void {
  const sw = (source as HTMLVideoElement).videoWidth || (source as HTMLImageElement).naturalWidth || source.width;
  const sh = (source as HTMLVideoElement).videoHeight || (source as HTMLImageElement).naturalHeight || source.height;
  el.originalCanvas.width = sw;
  el.originalCanvas.height = sh;
  originalCtx.drawImage(source, 0, 0);
}

function updateCodePreview(): void {
  if (!state.currentEncoded) return;

  const ef = state.exportFormat;
  const name = state.variableName;
  const tw = state.targetWidth;
  const th = state.targetHeight;
  const { values, bytes, dataType } = state.currentEncoded;

  const isVideoSeq = state.sourceType === 'video' && state.videoExportMode === 'sequence';
  let code = '';

  if (isVideoSeq) {
    const fps = state.videoTargetFps || 15;
    const animFileName = `${name}_anim_${fps}fps.bin`;
    if (ef === 'binary') {
      el.codePreviewTitle.textContent = `${animFileName} (Video Binario MicroSD)`;
      code = `// =============================================================================\n` +
             `// EXPORTACIÓN DIRECTA DE VIDEO CONTINUO PARA MICROSD (ESP32)\n` +
             `// =============================================================================\n` +
             `// Archivo de salida directo: ${animFileName}\n` +
             `// Resolución: ${tw}x${th} píxeles | Formato de color: ${state.colorFormat.toUpperCase()}\n` +
             `// FPS configurados: ~${fps} FPS (Detectados automáticamente por el ESP32)\n\n` +
             `// Al pulsar "Exportar Video", se guardará directamente este archivo único .bin.\n` +
             `// Cópialo directamente a la raíz de tu MicroSD (ejemplo: E:\\${animFileName})\n` +
             `// y tu ESP32 lo reproducirá automáticamente a ${fps} FPS en bucle continuo.`;
    } else if (ef === 'zip_sequence') {
      el.codePreviewTitle.textContent = `${name}_anim_${fps}fps.zip (Paquete con ${animFileName} + Sketch)`;
      code = `// =============================================================================\n` +
             `// PAQUETE ZIP PARA ESP32\n` +
             `// =============================================================================\n` +
             `// Contenido directo en la raíz del archivo ZIP:\n` +
             `// 1. ${animFileName}          -> Archivo de video a ${fps} FPS para la raíz de la MicroSD\n` +
             `// 2. esp32_video_animation.ino -> Sketch Arduino listo para compilar en PlatformIO/IDE\n` +
             `// 3. INSTRUCCIONES_MICROSD.txt -> Guía paso a paso para el usuario`;
    } else if (ef === 'c_header') {
      el.codePreviewTitle.textContent = `${name}_anim_${fps}fps.h (Cabecera C/C++ Flash)`;
      code = `// Secuencia de animación C/C++ para memoria Flash PROGMEM.\n// (Atención: Para secuencias largas de video, se recomienda usar el formato .bin en MicroSD).`;
    }
  } else if (ef === 'c_header') {
    el.codePreviewTitle.textContent = `${name}.h (C/C++ Header)`;
    code = generateCHeaderSingle(name, tw, th, values, dataType, {
      colorFormat: state.colorFormat,
      endian: state.endian,
      swapBytes: state.swapBytes,
      useProgmem: state.useProgmem,
      itemsPerLine: state.itemsPerRow
    });
  } else if (ef === 'binary') {
    el.codePreviewTitle.textContent = `${name}.bin (Raw Binary)`;
    code = `// Vista previa en texto del archivo binario (.bin)\n// Tamaño total: ${bytes.length} bytes\n\n` +
           generateHexDump(bytes.slice(0, 512), 16) +
           `\n\n... (${bytes.length - 512} bytes restantes se exportarán en el archivo .bin)`;
  } else if (ef === 'hex_dump') {
    el.codePreviewTitle.textContent = `${name}.hex (Hex Dump)`;
    code = generateHexDump(bytes, state.itemsPerRow);
  } else if (ef === 'python') {
    el.codePreviewTitle.textContent = `${name}.py (MicroPython)`;
    code = generateMicroPython(name, tw, th, bytes);
  } else if (ef === 'rle_compressed') {
    const rleRes = compressRLE(bytes);
    el.codePreviewTitle.innerHTML = `${name}_rle.h <span class="rle-badge">RLE: ${rleRes.originalSize}B &rarr; ${rleRes.compressedSize}B (${rleRes.ratioPercent}%)</span>`;
    code = generateRLECHeader(name, tw, th, bytes, {
      colorFormat: state.colorFormat,
      useProgmem: state.useProgmem
    });
  } else if (ef === 'png_preview') {
    el.codePreviewTitle.textContent = `${name}_preview.png (Imagen Renderizada)`;
    code = `// Al pulsar "Exportar", se guardará una imagen PNG exacta\n// con la resolución de pantalla (${tw}x${th}) y la paleta de colores cuantizada.`;
  } else if (ef === 'zip_sequence') {
    el.codePreviewTitle.textContent = `${name}_sequence.zip (Paquete de Fotogramas)`;
    code = `// Al exportar en formato ZIP, se empaquetarán los archivos necesarios junto al sketch maestro para ESP32.`;
  }

  el.codeOutput.textContent = code;
}

function updateSketches(): void {
  const isVideo = state.sourceType === 'video';
  const sketches = generateESP32Sketches(
    state.variableName,
    state.targetWidth,
    state.targetHeight,
    isVideo,
    state.videoTargetFps
  );
  el.sketchOutput.textContent = sketches[state.activeSketchTab] || sketches.tft_espi;
}

async function executeExport(): Promise<void> {
  if (!state.currentEncoded) {
    showToast('No hay datos de imagen para exportar');
    return;
  }

  const isVideo = state.sourceType === 'video';
  const isSequence = isVideo && state.videoExportMode === 'sequence';

  showToast('Procesando exportación...');

  if (isSequence) {
    await exportVideoSequence();
  } else {
    await exportSingleFrame();
  }
}

async function exportSingleFrame(): Promise<void> {
  if (!state.currentEncoded) return;

  const name = state.variableName;
  const ef = state.exportFormat;
  const tw = state.targetWidth;
  const th = state.targetHeight;
  const { values, bytes, dataType } = state.currentEncoded;

  if (ef === 'c_header') {
    const content = generateCHeaderSingle(name, tw, th, values, dataType, {
      colorFormat: state.colorFormat,
      endian: state.endian,
      swapBytes: state.swapBytes,
      useProgmem: state.useProgmem,
      itemsPerLine: state.itemsPerRow
    });
    await saveFileOrDownload(`${name}.h`, content, 'text/x-c', false);
  } else if (ef === 'binary') {
    await saveFileOrDownload(`${name}.bin`, bytes, 'application/octet-stream', true);
  } else if (ef === 'rle_compressed') {
    const rleRes = compressRLE(bytes);
    const rleHeader = generateRLECHeader(name, tw, th, bytes, {
      colorFormat: state.colorFormat,
      useProgmem: state.useProgmem
    });
    showToast(`✔ RLE: ${rleRes.originalSize}B -> ${rleRes.compressedSize}B (${rleRes.ratioPercent}%)`);
    await saveFileOrDownload(`${name}_rle.h`, rleHeader, 'text/x-c', false);
  } else if (ef === 'bmpr') {
    const bmprData = generateBmprBinary(tw, th, bytes, 1, 15, state.colorFormat, state.swapBytes);
    await saveFileOrDownload(`${name}.bmpr`, bmprData, 'application/octet-stream', true);
  } else if (ef === 'hex_dump') {
    const content = generateHexDump(bytes, state.itemsPerRow);
    await saveFileOrDownload(`${name}.hex`, content, 'text/plain', false);
  } else if (ef === 'python') {
    const content = generateMicroPython(name, tw, th, bytes);
    await saveFileOrDownload(`${name}.py`, content, 'text/x-python', false);
  } else if (ef === 'png_preview') {
    el.targetCanvas.toBlob(async (blob) => {
      if (!blob) return;
      const buffer = await blob.arrayBuffer();
      await saveFileOrDownload(`${name}.png`, new Uint8Array(buffer), 'image/png', true);
    });
  } else if (ef === 'zip_sequence') {
    const zip = new JSZip();
    const cHeader = generateCHeaderSingle(name, tw, th, values, dataType, {
      colorFormat: state.colorFormat,
      endian: state.endian,
      swapBytes: state.swapBytes,
      useProgmem: state.useProgmem,
      itemsPerLine: state.itemsPerRow
    });
    zip.file(`${name}.h`, cHeader);
    zip.file(`${name}.bin`, bytes);
    const sketches = generateESP32Sketches(name, tw, th, false);
    zip.file('esp32_tft_espi_demo.ino', sketches.tft_espi);

    const zipBlob = await zip.generateAsync({ type: 'uint8array' });
    await saveFileOrDownload(`${name}.zip`, zipBlob, 'application/zip', true);
  }
}

async function exportVideoSequence(): Promise<void> {
  if (!state.currentEncoded) return;

  const name = state.variableName;
  const ef = state.exportFormat;
  const tw = state.targetWidth;
  const th = state.targetHeight;
  const fps = state.videoTargetFps;
  const inP = state.videoInPoint;
  const outP = state.videoOutPoint;
  const step = 1 / Math.max(1, fps);

  // 1. Calculate estimated frames
  const expectedFrames = Math.max(1, Math.round((outP - inP) * fps) + 1);

  // If exporting as C header (.h), check for flash memory limits!
  if (ef === 'c_header' && expectedFrames > 30) {
    const bytesPerPixel = (COLOR_FORMATS.find(x => x.id === state.colorFormat)?.bytesPerPixel) || 2;
    const estMb = ((expectedFrames * tw * th * bytesPerPixel) / (1024 * 1024)).toFixed(1);
    const proceed = confirm(
      `⚠️ AVISO DE MEMORIA FLASH ESP32:\n\n` +
      `La animación seleccionada tiene ~${expectedFrames} fotogramas (${estMb} MB en Flash).\n` +
      `Un ESP32 estándar suele tener 4 MB de Flash total (con ~2.5 MB libres para código).\n\n` +
      `¿Deseas continuar con todos los fotogramas?\n` +
      `• Aceptar: Exportar toda la secuencia en el archivo .h\n` +
      `• Cancelar: Volver a la app para recortar el rango [In/Out], bajar los FPS o usar exportación ZIP / Binaria.`
    );
    if (!proceed) {
      showToast('Exportación cancelada para ajustar rango');
      return;
    }
  }

  el.statusReady.textContent = 'Iniciando extracción de fotogramas...';

  el.hiddenVideo.pause();
  state.videoPlaying = false;
  updatePlayPauseIcon();

  const frames: SequenceFrame[] = [];
  const origTime = el.hiddenVideo.currentTime;

  if (currentGifAnimation) {
    const total = currentGifAnimation.frames.length;
    for (let i = 0; i < total; i++) {
      processFrame(currentGifAnimation.frames[i].bitmap);
      if (state.currentEncoded) {
        frames.push({
          time: (i / total) * state.videoDuration,
          values: [...state.currentEncoded.values],
          bytes: new Uint8Array(state.currentEncoded.bytes)
        });
      }
      el.statusReady.textContent = `Extrayendo fotograma ${frames.length} / ${total}...`;
      await new Promise(r => setTimeout(r, 10));
    }
  } else {
    for (let t = inP; t <= outP + 0.0001; t += step) {
      await seekVideo(t);
      processFrame(el.hiddenVideo);
      if (state.currentEncoded) {
        frames.push({
          time: t,
          values: [...state.currentEncoded.values],
          bytes: new Uint8Array(state.currentEncoded.bytes)
        });
      }
      el.statusReady.textContent = `Extrayendo fotograma ${frames.length} / ${expectedFrames}...`;
      // Yield to browser UI thread so user sees real-time progress
      await new Promise(r => setTimeout(r, 15));
    }
  }

  el.hiddenVideo.currentTime = origTime;
  el.statusReady.textContent = 'Listo';

  if (frames.length === 0) {
    showToast('Error: No se pudieron extraer fotogramas del video');
    return;
  }

  // Combinar todos los fotogramas en un solo búfer binario continuo para la tarjeta MicroSD
  const singleSize = frames[0].bytes.byteLength;
  const combinedBytes = new Uint8Array(frames.length * singleSize);
  frames.forEach((f, idx) => {
    combinedBytes.set(f.bytes, idx * singleSize);
  });

  if (ef === 'c_header') {
    showToast(`Generando cabecera C/C++ (${frames.length} fotogramas)...`);
    await new Promise(r => setTimeout(r, 50));

    const headerCode = generateCHeaderSequence(name, tw, th, frames, state.currentEncoded.dataType, fps, {
      colorFormat: state.colorFormat,
      endian: state.endian,
      swapBytes: state.swapBytes,
      useProgmem: state.useProgmem,
      itemsPerLine: state.itemsPerRow
    });
    await saveFileOrDownload(`${name}_anim_${fps}fps.h`, headerCode, 'text/x-c', false);
  } else if (ef === 'zip_sequence') {
    showToast(`Empaquetando video anim.bin y sketch en ZIP...`);
    await new Promise(r => setTimeout(r, 50));

    const zip = new JSZip();
    const animFileName = `${name}_anim_${fps}fps.bin`;

    // 1. Archivo de video continuo listo para la MicroSD del ESP32 (directo en la raíz del ZIP)
    zip.file(animFileName, combinedBytes);

    // 2. Sketch de Arduino para ESP32
    const sketches = generateESP32Sketches(name, tw, th, true, fps);
    zip.file('esp32_video_animation.ino', sketches.tft_espi);

    // 3. Guía de instrucciones clara
    const readmeContent = 
`=============================================================================
  BitMapper Studio - Video Animacion para ESP32 + MicroSD
=============================================================================
Archivo de video: ${animFileName}
Resolucion: ${tw}x${th} pixeles
Fotogramas: ${frames.length} cuadros
Velocidad configurada: ~${fps} FPS (detectada automáticamente por el firmware)
Tamano total: ${combinedBytes.byteLength} bytes (${(combinedBytes.byteLength / (1024 * 1024)).toFixed(2)} MB)

INSTRUCCIONES PARA REPRODUCIR EN TU ESP32:
1. Copia el archivo "${animFileName}" directamente en la RAIZ de tu tarjeta MicroSD (ejemplo: E:\\${animFileName}).
   ¡No lo metas dentro de carpetas!
2. Inserta la MicroSD en el lector SPI de tu ESP32.
3. El firmware detectara automaticamente los ${frames.length} fotogramas y la etiqueta "_${fps}fps"
   para reproducir el video a ~${fps} FPS continuos sin saltos.
=============================================================================
`;
    zip.file('INSTRUCCIONES_MICROSD.txt', readmeContent);

    const zipData = await zip.generateAsync({ type: 'uint8array' });
    await saveFileOrDownload(`${name}_anim_${fps}fps.zip`, zipData, 'application/zip', true);
  } else if (ef === 'bmpr') {
    const animFileName = `${name}_anim_${fps}fps.bmpr`;
    showToast(`Exportando ${animFileName} con cabecera BMPR (${frames.length} cuadros a ${fps} FPS)...`);
    const bmprHeader = createBmprHeader(tw, th, frames.length, fps, state.colorFormat, state.swapBytes);
    const combined = new Uint8Array(bmprHeader.length + combinedBytes.byteLength);
    combined.set(bmprHeader, 0);
    combined.set(combinedBytes, bmprHeader.length);
    await saveFileOrDownload(animFileName, combined, 'application/octet-stream', true);
  } else {
    // Por defecto (binary o cualquier otro): ENTREGA DIRECTA DEL ARCHIVO
    const animFileName = `${name}_anim_${fps}fps.bin`;
    showToast(`Exportando ${animFileName} (${frames.length} fotogramas a ${fps} FPS)...`);
    await new Promise(r => setTimeout(r, 40));
    await saveFileOrDownload(animFileName, combinedBytes, 'application/octet-stream', true);
  }
}

function seekVideo(time: number): Promise<void> {
  return new Promise(resolve => {
    // If the video currentTime is already at target time (or within 10ms)
    if (Math.abs(el.hiddenVideo.currentTime - time) < 0.01) {
      resolve();
      return;
    }

    let settled = false;
    let fallbackTimer: ReturnType<typeof setTimeout>;

    const complete = () => {
      if (settled) return;
      settled = true;
      clearTimeout(fallbackTimer);
      el.hiddenVideo.removeEventListener('seeked', onSeeked);
      // Give a tiny tick for video texture update in Chromium
      setTimeout(resolve, 20);
    };

    const onSeeked = () => {
      complete();
    };

    // 600ms fallback so it never hangs even if the browser drops the seeked event
    fallbackTimer = setTimeout(complete, 600);

    el.hiddenVideo.addEventListener('seeked', onSeeked, { once: true });
    el.hiddenVideo.currentTime = time;
  });
}

async function saveFileOrDownload(
  defaultName: string,
  data: string | Uint8Array,
  mimeType: string,
  isBinary: boolean
): Promise<void> {
  if (window.bitmapperAPI && window.bitmapperAPI.saveFile && window.bitmapperAPI.writeFile) {
    const ext = defaultName.split('.').pop() || '';
    const filePath = await window.bitmapperAPI.saveFile({
      defaultName,
      extension: ext,
      filterName: `${ext.toUpperCase()} File`
    });

    if (!filePath) return;

    const result = await window.bitmapperAPI.writeFile({
      filePath,
      content: data,
      isBinary
    });

    if (result.success) {
      showToast(`Archivo guardado: ${defaultName}`);
      if (window.bitmapperAPI.revealInFolder) {
        window.bitmapperAPI.revealInFolder(filePath);
      }
    } else {
      showToast(`Error al guardar: ${result.error}`);
    }
  } else {
    const blob = isBinary
      ? new Blob([(data as Uint8Array).buffer as ArrayBuffer], { type: mimeType })
      : new Blob([data as string], { type: `${mimeType};charset=utf-8` });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = defaultName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Descargado: ${defaultName}`);
  }
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;
function showToast(msg: string): void {
  el.toastMessage.textContent = msg;
  el.toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.toast.classList.remove('show');
  }, 3000);
}

function copyToClipboard(text: string): void {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text);
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

// =============================================================================
// Funciones de Transmisión Bluetooth LE
// =============================================================================
let bleCustomBin: { fileName: string; bytes: Uint8Array } | null = null;
let bleAbortController: AbortController | null = null;

function updateBleModalFileInfo(): void {
  const isVideo = state.sourceType === 'video';
  const optFull = document.getElementById('bleOptVideoFull') as HTMLInputElement | null;
  const sendFullVideo = isVideo && !bleCustomBin && (optFull ? optFull.checked : true);

  if (!bleCustomBin) {
    if (isVideo && sendFullVideo) {
      const fps = state.videoTargetFps || 15;
      const inP = state.videoInPoint || 0;
      const outP = (state.videoOutPoint > inP) ? state.videoOutPoint : (state.videoDuration || 1);
      const duration = Math.max(0.1, outP - inP);
      const expectedFrames = Math.max(1, Math.round(duration * fps) + 1);
      const singleFrameBytes = state.targetWidth * state.targetHeight * 2;
      const totalEstimatedKb = ((expectedFrames * singleFrameBytes) / 1024).toFixed(1);

      const animFileName = `${state.variableName}_anim_${fps}fps.bin`;
      el.bleTargetFilename.textContent = animFileName;
      el.bleTargetFilemeta.textContent = `${state.targetWidth} × ${state.targetHeight} px | ${state.colorFormat.toUpperCase()} | ${expectedFrames} cuadros | ~${totalEstimatedKb} KB`;

      const stats = document.getElementById('bleVideoStatsText');
      if (stats) {
        stats.textContent = `Secuencia: ${expectedFrames} fotogramas (${duration.toFixed(1)}s a ${fps} fps). El ESP32 detectará ${fps} FPS automáticamente.`;
      }

      const warnBox = document.getElementById('bleVideoWarningBox');
      const warnDuration = document.getElementById('bleVideoWarnDuration');
      if (warnBox && warnDuration) {
        if (duration > 6.0) {
          warnBox.style.display = 'block';
          warnDuration.textContent = duration.toFixed(1);
        } else {
          warnBox.style.display = 'none';
        }
      }
    } else {
      if (!state.currentEncoded) {
        updatePipeline();
      }
      const name = `${state.variableName}.bin`;
      const sizeKb = state.currentEncoded
        ? (state.currentEncoded.sizeBytes / 1024).toFixed(1)
        : '0.0';
      el.bleTargetFilename.textContent = name;
      el.bleTargetFilemeta.textContent = `${state.targetWidth} × ${state.targetHeight} px | ${state.colorFormat.toUpperCase()} | 1 imagen | ~${sizeKb} KB`;

      const stats = document.getElementById('bleVideoStatsText');
      if (stats) {
        stats.textContent = 'Se transmitirá únicamente el fotograma actual que se muestra en el reproductor.';
      }

      const warnBox = document.getElementById('bleVideoWarningBox');
      if (warnBox) warnBox.style.display = 'none';
    }
  } else {
    el.bleTargetFilename.textContent = bleCustomBin.fileName;
    el.bleTargetFilemeta.textContent = `Archivo del disco | ${(bleCustomBin.bytes.byteLength / 1024).toFixed(1)} KB`;
  }
}

function openBleModal(): void {
  const isVideo = state.sourceType === 'video';
  const videoContainer = document.getElementById('bleVideoModeContainer');

  if (videoContainer) {
    videoContainer.style.display = isVideo && !bleCustomBin ? 'block' : 'none';
  }

  updateBleModalFileInfo();
  resetBleProgressUI();
  switchBleTab('upload');
  el.bleModalOverlay.classList.add('active');
}

function closeBleModal(): void {
  if (bleAbortController) {
    bleAbortController.abort();
    bleAbortController = null;
  }
  el.bleModalOverlay.classList.remove('active');
}

function resetBleProgressUI(): void {
  el.bleStatusBadge.className = 'ble-badge ble-badge-idle';
  el.bleStatusBadge.textContent = 'DESCONECTADO';
  el.bleDeviceNameLabel.textContent = 'BitMapper-ESP32 (Servicio GATT 4fafc201...)';
  el.bleProgressStatusText.textContent = 'Listo para transmitir';
  el.bleProgressPercent.textContent = '0%';
  el.bleProgressBar.style.width = '0%';
  el.bleBytesTransferred.textContent = '0 KB / 0 KB';
  el.bleTransferSpeed.textContent = '0.0 KB/s';
  el.btnBleStartUpload.style.display = 'inline-flex';
  el.btnBleCancelUpload.style.display = 'none';
  el.btnBleDismiss.style.display = 'inline-flex';
}

async function handleBlePickLocalBin(): Promise<void> {
  if (window.bitmapperAPI && window.bitmapperAPI.openBinaryFile) {
    const res = await window.bitmapperAPI.openBinaryFile();
    if (!res) return;
    bleCustomBin = {
      fileName: res.fileName,
      bytes: res.data
    };
    el.bleTargetFilename.textContent = res.fileName;
    el.bleTargetFilemeta.textContent = `Archivo local .BIN | ${(res.data.byteLength / 1024).toFixed(1)} KB`;
    const videoContainer = document.getElementById('bleVideoModeContainer');
    if (videoContainer) videoContainer.style.display = 'none';
    showToast(`Archivo cargado para BLE: ${res.fileName}`);
  } else {
    showToast('Función no disponible en modo navegador estándar');
  }
}

async function startBleUpload(): Promise<void> {
  const isVideo = state.sourceType === 'video';
  const optFull = document.getElementById('bleOptVideoFull') as HTMLInputElement | null;
  const sendFullVideo = isVideo && !bleCustomBin && (optFull ? optFull.checked : true);

  if (sendFullVideo) {
    const fps = state.videoTargetFps || 15;
    const inP = state.videoInPoint || 0;
    const outP = (state.videoOutPoint > inP) ? state.videoOutPoint : (state.videoDuration || 1);
    const duration = Math.max(0.1, outP - inP);
    const expectedFrames = Math.max(1, Math.round(duration * fps) + 1);

    if (expectedFrames > 120) {
      const estMb = ((expectedFrames * state.targetWidth * state.targetHeight * 2) / (1024 * 1024)).toFixed(1);
      const estMin = Math.round((expectedFrames * state.targetWidth * state.targetHeight * 2) / (18 * 1024 * 60));
      const ok = confirm(
        `⚠️ ATENCIÓN: SECUENCIA DE VIDEO MUY EXTENSA\n\n` +
        `El rango seleccionado dura ${duration.toFixed(1)} segundos (~${expectedFrames} cuadros = ${estMb} MB).\n` +
        `Transferir tantos datos por Bluetooth BLE tardará aproximadamente ~${estMin} minutos.\n\n` +
        `Para microcontroladores se recomienda usar clips de 2 a 5 segundos con los marcadores [ In / Out ] en la línea de tiempo.\n\n` +
        `¿Deseas continuar con la transmisión completa de todos modos?`
      );
      if (!ok) return;
    }
  }

  bleAbortController = new AbortController();
  el.btnBleStartUpload.style.display = 'none';
  el.btnBleCancelUpload.style.display = 'inline-flex';
  el.btnBleDismiss.style.display = 'none';

  // 1. CONECTAR DIRECTAMENTE EN EL GESTO DE CLICK DEL USUARIO
  // (Evita el error 'Must be handling a user gesture to show a permission request')
  try {
    await bleUploader.requestDeviceAndConnect((p) => updateBleProgressUI(p));
  } catch (connErr: any) {
    console.error('Error al conectar BLE:', connErr);
    const msg = connErr?.message || String(connErr);
    if (!msg.includes('cancel') && !msg.includes('User cancelled')) {
      showToast(`Error al conectar BLE: ${msg}`);
    }
    el.btnBleStartUpload.style.display = 'inline-flex';
    el.btnBleCancelUpload.style.display = 'none';
    el.btnBleDismiss.style.display = 'inline-flex';
    bleAbortController = null;
    return;
  }

  // 2. CONECTADOS: PROCESAR DATOS Y ENVIAR AL ESP32
  try {
    let dataToSend: Uint8Array;
    let fileName: string;

    if (bleCustomBin) {
      dataToSend = bleCustomBin.bytes;
      fileName = bleCustomBin.fileName;
    } else if (sendFullVideo) {
      el.bleProgressStatusText.textContent = 'Extrayendo fotogramas del video...';
      const fps = state.videoTargetFps || 15;
      const inP = state.videoInPoint || 0;
      const outP = (state.videoOutPoint > inP) ? state.videoOutPoint : (state.videoDuration || 1);
      const duration = Math.max(0.1, outP - inP);
      const step = 1 / Math.max(1, fps);
      const expectedFrames = Math.max(1, Math.round(duration * fps) + 1);

      el.hiddenVideo.pause();
      state.videoPlaying = false;
      updatePlayPauseIcon();

      const origTime = el.hiddenVideo.currentTime;
      const frameBuffers: Uint8Array[] = [];
      let singleFrameSize = 0;

      for (let t = inP; t <= outP + 0.0001; t += step) {
        if (bleAbortController?.signal.aborted) {
          el.hiddenVideo.currentTime = origTime;
          return;
        }
        await seekVideo(t);
        processFrame(el.hiddenVideo);
        if (state.currentEncoded) {
          const frameBytes = new Uint8Array(state.currentEncoded.bytes);
          singleFrameSize = frameBytes.byteLength;
          frameBuffers.push(frameBytes);
        }
        const pct = Math.round((frameBuffers.length / expectedFrames) * 100);
        el.bleProgressStatusText.textContent = `Extrayendo cuadro ${frameBuffers.length} / ${expectedFrames}...`;
        el.bleProgressBar.style.width = `${pct}%`;
        el.bleProgressPercent.textContent = `${pct}%`;
        await new Promise(r => setTimeout(r, 8));
      }
      el.hiddenVideo.currentTime = origTime;

      if (frameBuffers.length === 0) {
        showToast('Error: No se pudieron extraer fotogramas del video');
        resetBleProgressUI();
        return;
      }

      const totalBytes = frameBuffers.length * singleFrameSize;
      const rawData = new Uint8Array(totalBytes);
      for (let i = 0; i < frameBuffers.length; i++) {
        rawData.set(frameBuffers[i], i * singleFrameSize);
      }

      const useBmpr = el.bleOptBmprHeader ? el.bleOptBmprHeader.checked : true;
      if (useBmpr) {
        dataToSend = generateBmprBinary(
          state.targetWidth,
          state.targetHeight,
          rawData,
          frameBuffers.length,
          fps,
          state.colorFormat,
          state.swapBytes
        );
        fileName = `${state.variableName}_anim_${fps}fps.bmpr`;
      } else {
        dataToSend = rawData;
        fileName = `${state.variableName}_anim_${fps}fps.bin`;
      }
      console.log(`[BLE Video]: Secuencia de ${frameBuffers.length} cuadros preparada a ${fps} FPS (${dataToSend.byteLength} bytes, archivo: ${fileName}, BMPR=${useBmpr}).`);
    } else {
      if (!state.currentEncoded) {
        updatePipeline();
      }
      if (!state.currentEncoded) {
        showToast('Error: No hay datos de bitmap para enviar');
        return;
      }

      const useBmpr = el.bleOptBmprHeader ? el.bleOptBmprHeader.checked : true;
      if (useBmpr) {
        dataToSend = generateBmprBinary(
          state.targetWidth,
          state.targetHeight,
          state.currentEncoded.bytes,
          1,
          15,
          state.colorFormat,
          state.swapBytes
        );
        fileName = `${state.variableName}.bmpr`;
      } else {
        dataToSend = state.currentEncoded.bytes;
        fileName = `${state.variableName}.bin`;
      }
    }

    await bleUploader.transferData({
      fileName,
      bytes: dataToSend,
      signal: bleAbortController.signal,
      onProgress: (p) => updateBleProgressUI(p)
    });

    showToast(`✔ ¡Archivo ${fileName} enviado con éxito al ESP32!`);
  } catch (err: any) {
    console.error('Error durante la carga BLE:', err);
    const msg = err?.message || String(err);
    if (!msg.includes('cancelada') && !msg.includes('User cancelled')) {
      showToast(`Error BLE: ${msg}`);
    }
  } finally {
    el.btnBleStartUpload.style.display = 'inline-flex';
    el.btnBleCancelUpload.style.display = 'none';
    el.btnBleDismiss.style.display = 'inline-flex';
    bleAbortController = null;
  }
}

function cancelBleUpload(): void {
  if (bleAbortController) {
    bleAbortController.abort();
    bleAbortController = null;
    showToast('Transferencia BLE cancelada');
  }
}

function updateBleProgressUI(p: BLEProgress): void {
  el.bleProgressStatusText.textContent = p.statusText;
  el.bleProgressPercent.textContent = `${p.percentage}%`;
  el.bleProgressBar.style.width = `${p.percentage}%`;

  const sentKb = (p.bytesSent / 1024).toFixed(1);
  const totalKb = (p.totalBytes / 1024).toFixed(1);
  el.bleBytesTransferred.textContent = `${sentKb} KB / ${totalKb} KB`;

  if (p.speedKbps !== undefined) {
    el.bleTransferSpeed.textContent = `${p.speedKbps.toFixed(1)} KB/s`;
  }

  if (p.deviceName) {
    el.bleDeviceNameLabel.textContent = `${p.deviceName}`;
  }

  if (p.state === 'scanning') {
    el.bleStatusBadge.className = 'ble-badge ble-badge-scanning';
    el.bleStatusBadge.textContent = 'BUSCANDO...';
  } else if (p.state === 'connecting') {
    el.bleStatusBadge.className = 'ble-badge ble-badge-scanning';
    el.bleStatusBadge.textContent = 'CONECTANDO...';
  } else if (p.state === 'connected') {
    el.bleStatusBadge.className = 'ble-badge ble-badge-connected';
    el.bleStatusBadge.textContent = 'CONECTADO';
  } else if (p.state === 'uploading') {
    el.bleStatusBadge.className = 'ble-badge ble-badge-uploading';
    el.bleStatusBadge.textContent = 'TRANSMITIENDO';
  } else if (p.state === 'completed') {
    el.bleStatusBadge.className = 'ble-badge ble-badge-connected';
    el.bleStatusBadge.textContent = 'COMPLETADO ✔';
  } else if (p.state === 'error') {
    el.bleStatusBadge.className = 'ble-badge ble-badge-error';
    el.bleStatusBadge.textContent = 'ERROR ✖';
  }
}

interface BatchQueueItem {
  id: string;
  originalName: string;
  targetName: string;
  fileUrl?: string;
  file?: File;
  isBin: boolean;
  binData?: Uint8Array;
  displaySize: string;
  status: 'pending' | 'converting' | 'uploading' | 'completed' | 'error';
  errorMessage?: string;
}

let batchQueue: BatchQueueItem[] = [];
let isBatchUploading = false;

function updateBatchLabels(): void {
  if (el.bleBatchResLabel) {
    el.bleBatchResLabel.textContent = `${state.targetWidth} × ${state.targetHeight} px`;
  }
  if (el.bleBatchFormatLabel) {
    const fmt = COLOR_FORMATS.find(x => x.id === state.colorFormat);
    el.bleBatchFormatLabel.textContent = fmt ? fmt.name.split(' ')[0] : state.colorFormat.toUpperCase();
  }
}

function convertImageToBin(img: HTMLImageElement): Uint8Array {
  const tw = state.targetWidth;
  const th = state.targetHeight;
  const canvas = document.createElement('canvas');
  canvas.width = tw;
  canvas.height = th;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = state.bgColor;
  ctx.fillRect(0, 0, tw, th);

  const sw = img.naturalWidth || img.width;
  const sh = img.naturalHeight || img.height;

  let dw = tw, dh = th;
  let dx = 0, dy = 0;

  if (state.scalingMode === 'stretch') {
    dw = tw; dh = th;
  } else if (state.scalingMode === 'center') {
    dw = sw; dh = sh;
    dx = (tw - sw) / 2; dy = (th - sh) / 2;
  } else if (state.scalingMode === 'contain') {
    const scale = Math.min(tw / sw, th / sh);
    dw = sw * scale;
    dh = sh * scale;
    dx = (tw - dw) / 2;
    dy = (th - dh) / 2;
  } else if (state.scalingMode === 'cover') {
    const scale = Math.max(tw / sw, th / sh);
    dw = sw * scale;
    dh = sh * scale;
    dx = (tw - dw) / 2;
    dy = (th - dh) / 2;
  }

  ctx.drawImage(img, dx, dy, dw, dh);
  const imgData = ctx.getImageData(0, 0, tw, th);
  const d = imgData.data;

  const bAdj = state.brightness;
  const cFactor = (259 * (state.contrast + 255)) / (255 * (259 - state.contrast));
  const gammaVal = state.gamma;

  for (let i = 0; i < d.length; i += 4) {
    let r = d[i];
    let g = d[i + 1];
    let b = d[i + 2];

    if (bAdj !== 0) {
      r += bAdj;
      g += bAdj;
      b += bAdj;
    }
    if (state.contrast !== 0) {
      r = cFactor * (r - 128) + 128;
      g = cFactor * (g - 128) + 128;
      b = cFactor * (b - 128) + 128;
    }
    if (gammaVal !== 1.0) {
      r = 255 * Math.pow(Math.max(0, r) / 255, 1 / gammaVal);
      g = 255 * Math.pow(Math.max(0, g) / 255, 1 / gammaVal);
      b = 255 * Math.pow(Math.max(0, b) / 255, 1 / gammaVal);
    }

    d[i] = clamp(r);
    d[i + 1] = clamp(g);
    d[i + 2] = clamp(b);
  }

  const quantizedData = applyDithering(
    d,
    tw,
    th,
    state.ditherAlgorithm,
    state.colorFormat,
    state.threshold
  );

  const encoded = encodeBitmap(quantizedData, tw, th, {
    colorFormat: state.colorFormat,
    endian: state.endian,
    swapBytes: state.swapBytes,
    invert: state.invertColors
  });

  return encoded.bytes;
}

function addFilesToBatch(files: Array<{ name: string; url?: string; file?: File; isBin: boolean; data?: Uint8Array }>): void {
  const estBytes = state.targetWidth * state.targetHeight * 2;
  const estKb = (estBytes / 1024).toFixed(1);

  files.forEach(f => {
    let base = f.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_\-]/g, '_').toLowerCase();
    if (!base) base = 'image';

    let targetName = `${base}.bin`;
    let count = 1;
    while (batchQueue.some(item => item.targetName === targetName)) {
      count++;
      targetName = `${base}_${count}.bin`;
    }

    let displaySize = `${estKb} KB`;
    if (f.isBin && f.data) {
      displaySize = `${(f.data.byteLength / 1024).toFixed(1)} KB`;
    } else if (f.file) {
      displaySize = `${(f.file.size / 1024).toFixed(1)} KB orig → ~${estKb} KB`;
    }

    batchQueue.push({
      id: 'batch_' + Math.random().toString(36).substring(2, 9),
      originalName: f.name,
      targetName,
      fileUrl: f.url,
      file: f.file,
      isBin: f.isBin,
      binData: f.data,
      displaySize,
      status: 'pending'
    });
  });

  updateBatchLabels();
  renderBatchList();
}

function renderBatchList(): void {
  if (el.btnBleStartBatchUpload) {
    el.btnBleStartBatchUpload.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
      Subir Lote al ESP32 (${batchQueue.length})
    `;
  }

  if (batchQueue.length === 0) {
    el.bleBatchFilesContainer.innerHTML = `
      <div class="ble-files-placeholder" id="bleBatchPlaceholder">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        <div>No hay imágenes añadidas al lote</div>
        <div style="font-size: 11px; color: var(--text-muted);">Haz clic en "Añadir Imágenes..." o arrastra y suelta fotos aquí</div>
      </div>
    `;
    return;
  }

  el.bleBatchFilesContainer.innerHTML = '';
  batchQueue.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = `ble-batch-item ${item.status === 'uploading' ? 'active' : ''} ${item.status === 'completed' ? 'completed' : ''}`;
    row.id = `batch_row_${item.id}`;

    const left = document.createElement('div');
    left.className = 'ble-batch-item-left';

    const thumb = document.createElement('div');
    thumb.className = 'ble-batch-item-thumb';
    if (item.fileUrl) {
      const img = document.createElement('img');
      img.src = item.fileUrl;
      thumb.appendChild(img);
    } else if (item.file && !item.isBin) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(item.file);
      thumb.appendChild(img);
    } else {
      thumb.textContent = item.isBin ? '📦' : '🖼️';
    }

    const info = document.createElement('div');
    info.className = 'ble-batch-item-info';

    const name = document.createElement('div');
    name.className = 'ble-batch-item-name';
    name.title = item.targetName;
    name.textContent = `${index + 1}. ${item.targetName}`;

    const meta = document.createElement('div');
    meta.className = 'ble-batch-item-meta';
    meta.textContent = `${item.originalName} • ${item.displaySize}`;

    info.appendChild(name);
    info.appendChild(meta);
    left.appendChild(thumb);
    left.appendChild(info);

    const right = document.createElement('div');
    right.className = 'ble-batch-item-right';

    const badge = document.createElement('span');
    badge.className = `ble-batch-badge badge-${item.status}`;
    if (item.status === 'pending') badge.textContent = 'PENDIENTE';
    else if (item.status === 'converting') badge.textContent = 'PROCESANDO';
    else if (item.status === 'uploading') badge.textContent = 'SUBIENDO...';
    else if (item.status === 'completed') badge.textContent = 'ENVIADO ✔';
    else if (item.status === 'error') badge.textContent = 'ERROR ✖';

    right.appendChild(badge);

    if (!isBatchUploading) {
      const btnRemove = document.createElement('button');
      btnRemove.className = 'btn-batch-remove';
      btnRemove.title = 'Quitar del lote';
      btnRemove.innerHTML = '&times;';
      btnRemove.addEventListener('click', (e) => {
        e.stopPropagation();
        batchQueue = batchQueue.filter(x => x.id !== item.id);
        renderBatchList();
      });
      right.appendChild(btnRemove);
    }

    row.appendChild(left);
    row.appendChild(right);
    el.bleBatchFilesContainer.appendChild(row);
  });
}

async function handleAddBatchFiles(): Promise<void> {
  if (isBatchUploading) return;

  if (window.bitmapperAPI && window.bitmapperAPI.openMultipleFiles) {
    try {
      const files = await window.bitmapperAPI.openMultipleFiles();
      if (!files || files.length === 0) return;

      const formatted = files.map(f => ({
        name: f.fileName,
        url: 'file:///' + f.filePath.replace(/\\/g, '/'),
        isBin: f.isBin,
        data: f.data
      }));
      addFilesToBatch(formatted);
      showToast(`¡${formatted.length} archivos añadidos al lote!`);
      return;
    } catch (ipcErr) {
      console.warn('IPC openMultipleFiles no disponible, usando selector alternativo:', ipcErr);
    }
  }
  el.hiddenBatchFileInput.click();
}

function handleBatchFileInputChange(e: Event): void {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const formatted: Array<{ name: string; file: File; isBin: boolean }> = [];
  for (let i = 0; i < target.files.length; i++) {
    const f = target.files[i];
    formatted.push({
      name: f.name,
      file: f,
      isBin: f.name.toLowerCase().endsWith('.bin')
    });
  }
  addFilesToBatch(formatted);
  showToast(`¡${formatted.length} archivos añadidos al lote!`);
  el.hiddenBatchFileInput.value = '';
}

async function startBleBatchUpload(): Promise<void> {
  if (batchQueue.length === 0) {
    showToast('Añade al menos una imagen a la cola antes de iniciar');
    return;
  }
  if (isBatchUploading) return;

  try {
    await bleUploader.requestDeviceAndConnect((p) => updateBleProgressUI(p));
  } catch (connErr: any) {
    console.error('Error al conectar BLE:', connErr);
    const msg = connErr?.message || String(connErr);
    if (!msg.includes('cancel') && !msg.includes('User cancelled')) {
      showToast(`Error al conectar BLE: ${msg}`);
    }
    return;
  }

  isBatchUploading = true;
  bleAbortController = new AbortController();

  el.btnBleStartBatchUpload.style.display = 'none';
  el.btnBleCancelUpload.style.display = 'inline-flex';
  el.btnBleDismiss.style.display = 'none';
  el.bleBatchProgressBox.style.display = 'block';

  let successCount = 0;
  const total = batchQueue.length;

  try {
    for (let i = 0; i < batchQueue.length; i++) {
      if (bleAbortController?.signal.aborted) break;

      const item = batchQueue[i];
      const overallPct = Math.round((i / total) * 100);

      el.bleBatchOverallStatus.textContent = `Transmitiendo imagen ${i + 1} de ${total}: ${item.targetName}`;
      el.bleBatchOverallPercent.textContent = `${overallPct}%`;
      el.bleBatchOverallBar.style.width = `${overallPct}%`;
      el.bleBatchFileStatus.textContent = `Preparando ${item.targetName}...`;

      item.status = 'converting';
      renderBatchList();

      let bytesToSend: Uint8Array;
      try {
        if (item.isBin && item.binData) {
          bytesToSend = item.binData;
        } else if (item.file && item.isBin) {
          const buf = await item.file.arrayBuffer();
          bytesToSend = new Uint8Array(buf);
        } else {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('No se pudo cargar la imagen'));
          });
          img.src = item.fileUrl || (item.file ? URL.createObjectURL(item.file) : '');
          await loadPromise;
          bytesToSend = convertImageToBin(img);
        }
      } catch (convErr: any) {
        console.error('Error convirtiendo imagen:', convErr);
        item.status = 'error';
        item.errorMessage = convErr?.message || 'Error de conversión';
        renderBatchList();
        continue;
      }

      item.status = 'uploading';
      renderBatchList();

      try {
        await bleUploader.transferData({
          fileName: item.targetName,
          bytes: bytesToSend,
          signal: bleAbortController.signal,
          onProgress: (p) => {
            updateBleProgressUI(p);
            el.bleBatchFileStatus.textContent = `Enviando "${item.targetName}" (${(p.bytesSent / 1024).toFixed(1)} / ${(p.totalBytes / 1024).toFixed(1)} KB)`;
            if (p.speedKbps !== undefined) {
              el.bleBatchSpeed.textContent = `${p.speedKbps.toFixed(1)} KB/s`;
            }
          }
        });

        item.status = 'completed';
        successCount++;
        renderBatchList();

        await new Promise(r => setTimeout(r, 250));
      } catch (uploadErr: any) {
        if (bleAbortController?.signal.aborted) {
          item.status = 'pending';
          renderBatchList();
          break;
        }
        console.error(`Error al subir ${item.targetName}:`, uploadErr);
        item.status = 'error';
        item.errorMessage = uploadErr?.message || 'Error BLE';
        renderBatchList();
      }
    }

    el.bleBatchOverallPercent.textContent = '100%';
    el.bleBatchOverallBar.style.width = '100%';
    el.bleBatchOverallStatus.textContent = `Lote completado: ${successCount} de ${total} subidos con éxito`;
    showToast(`✔ ¡Lote completado! ${successCount} de ${total} imágenes transmitidas al ESP32.`);
  } catch (err: any) {
    console.error('Error en carga por lote:', err);
    showToast(`Error durante el lote: ${err?.message || err}`);
  } finally {
    isBatchUploading = false;
    bleAbortController = null;
    el.btnBleStartBatchUpload.style.display = 'inline-flex';
    el.btnBleCancelUpload.style.display = 'none';
    el.btnBleDismiss.style.display = 'inline-flex';
    renderBatchList();
  }
}

function switchBleTab(tab: 'upload' | 'batch' | 'manager' | 'settings'): void {
  el.bleTabBtnUpload.classList.toggle('active', tab === 'upload');
  el.bleTabBtnBatch.classList.toggle('active', tab === 'batch');
  el.bleTabBtnManager.classList.toggle('active', tab === 'manager');
  el.bleTabBtnSettings.classList.toggle('active', tab === 'settings');

  el.blePaneUpload.style.display = tab === 'upload' ? 'block' : 'none';
  el.blePaneBatch.style.display = tab === 'batch' ? 'block' : 'none';
  el.blePaneManager.style.display = tab === 'manager' ? 'block' : 'none';
  el.blePaneSettings.style.display = tab === 'settings' ? 'block' : 'none';

  if (tab === 'upload') {
    el.btnBleStartUpload.style.display = 'inline-flex';
    el.btnBleStartBatchUpload.style.display = 'none';
  } else if (tab === 'batch') {
    el.btnBleStartUpload.style.display = 'none';
    el.btnBleStartBatchUpload.style.display = 'inline-flex';
    updateBatchLabels();
    renderBatchList();
  } else if (tab === 'manager') {
    el.btnBleStartUpload.style.display = 'none';
    el.btnBleStartBatchUpload.style.display = 'none';

    if (bleUploader.isConnected) {
      loadBleSDFiles();
    } else {
      renderBleFilesPlaceholder(false);
    }
  } else if (tab === 'settings') {
    el.btnBleStartUpload.style.display = 'none';
    el.btnBleStartBatchUpload.style.display = 'none';
  }
}

async function handleBleApplySettings(): Promise<void> {
  try {
    if (!bleUploader.isConnected) {
      showToast('Conectando al ESP32...');
      await bleUploader.requestDeviceAndConnect((p) => updateBleProgressUI(p));
    }

    const slideshowOn = el.bleSettingSlideshow.checked;
    const slideSec = parseInt(el.bleSettingSlideInterval.value, 10) || 5;
    const transitionMode = el.bleSettingTransition.value;
    const brightnessPct = parseInt(el.bleSettingBrightness.value, 10) || 60;
    const brightnessDuty = Math.round((brightnessPct / 100) * 255);

    const sleepEnabled = el.bleSettingSleepEnabled ? el.bleSettingSleepEnabled.checked : true;
    const sleepTimeoutSec = el.bleSettingSleepTimeout ? parseInt(el.bleSettingSleepTimeout.value, 10) || 60 : 60;
    const sleepDimPct = el.bleSettingSleepBrightness ? parseInt(el.bleSettingSleepBrightness.value, 10) || 5 : 5;
    const sleepDimDuty = Math.round((sleepDimPct / 100) * 255);

    el.btnBleApplySettings.disabled = true;
    el.btnBleApplySettings.textContent = 'Enviando...';

    // 1. Enviar configuración de diapositivas
    await bleUploader.sendSlideshowConfig(slideshowOn, slideSec);
    await new Promise(r => setTimeout(r, 60));

    // 2. Enviar configuración de transición
    await bleUploader.sendTransitionConfig(transitionMode);
    await new Promise(r => setTimeout(r, 60));

    // 3. Enviar brillo
    await bleUploader.sendBrightnessConfig(brightnessDuty);
    await new Promise(r => setTimeout(r, 60));

    // 4. Enviar configuración de reposo (atenuación de pantalla)
    await bleUploader.sendSleepConfig(sleepEnabled, sleepTimeoutSec, sleepDimDuty);

    showToast('✔ ¡Ajustes y modo reposo aplicados en el ESP32!');
  } catch (err: any) {
    console.error('Error al aplicar ajustes en ESP32:', err);
    showToast(`Error al enviar ajustes: ${err?.message || err}`);
  } finally {
    el.btnBleApplySettings.disabled = false;
    el.btnBleApplySettings.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
      Enviar Ajustes a ESP32
    `;
  }
}

async function handleBleRemotePrev(): Promise<void> {
  try {
    if (!bleUploader.isConnected) {
      await bleUploader.requestDeviceAndConnect();
    }
    await bleUploader.sendGenericCommand('PREV');
    showToast('Comando: Foto anterior');
  } catch (err: any) {
    showToast(`Error: ${err?.message || err}`);
  }
}

async function handleBleRemoteNext(): Promise<void> {
  try {
    if (!bleUploader.isConnected) {
      await bleUploader.requestDeviceAndConnect();
    }
    await bleUploader.sendGenericCommand('NEXT');
    showToast('Comando: Siguiente foto');
  } catch (err: any) {
    showToast(`Error: ${err?.message || err}`);
  }
}

let currentSDFiles: SDBinFile[] = [];
let isLoadingSDFiles = false;


function renderBleFilesPlaceholder(loading: boolean = false): void {
  if (loading) {
    el.bleFilesContainer.innerHTML = `
      <div class="ble-files-placeholder">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2" class="spin"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
        <div>Consultando archivos en la MicroSD del ESP32...</div>
      </div>
    `;
    el.bleManagerStatusText.textContent = 'Leyendo tarjeta MicroSD...';
    el.bleManagerBadge.className = 'ble-badge ble-badge-scanning';
    el.bleManagerBadge.textContent = 'LEYENDO...';
  } else {
    el.bleFilesContainer.innerHTML = `
      <div class="ble-files-placeholder" id="bleFilesPlaceholder">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        <div>Conecta al ESP32 para explorar y eliminar archivos .BIN de tu tarjeta MicroSD</div>
        <button id="btnBleConnectFromManager" class="btn btn-accent" style="font-size: 11px; padding: 6px 14px; margin-top: 6px;">
          Conectar ESP32
        </button>
      </div>
    `;
    el.bleManagerStatusText.textContent = 'Conecta al ESP32 para ver los archivos';
    el.bleManagerBadge.className = 'ble-badge ble-badge-idle';
    el.bleManagerBadge.textContent = 'DESCONECTADO';

    const connectBtn = document.getElementById('btnBleConnectFromManager');
    if (connectBtn) {
      connectBtn.addEventListener('click', () => loadBleSDFiles());
    }
  }
}

async function loadBleSDFiles(): Promise<void> {
  if (isLoadingSDFiles) return;

  if (!bleUploader.isConnected) {
    try {
      await bleUploader.requestDeviceAndConnect((p) => updateBleProgressUI(p));
    } catch (connErr: any) {
      console.error('Error al conectar BLE:', connErr);
      const msg = connErr?.message || String(connErr);
      if (!msg.includes('cancel') && !msg.includes('User cancelled')) {
        showToast(`Error al conectar BLE: ${msg}`);
      }
      renderBleFilesPlaceholder(false);
      return;
    }
  }

  isLoadingSDFiles = true;
  renderBleFilesPlaceholder(true);

  try {
    const files = await bleUploader.listSDFiles();
    currentSDFiles = files;
    renderBleFilesList(files);
  } catch (err: any) {
    console.error('Error al obtener lista de archivos:', err);
    showToast(`Error al leer MicroSD: ${err?.message || err}`);
    el.bleManagerStatusText.textContent = 'Error al leer MicroSD';
    el.bleManagerBadge.className = 'ble-badge ble-badge-error';
    el.bleManagerBadge.textContent = 'ERROR';
  } finally {
    isLoadingSDFiles = false;
  }
}

function renderBleFilesList(files: SDBinFile[]): void {
  el.bleManagerStatusText.textContent = `Dispositivo: ${bleUploader.deviceName}`;
  el.bleManagerBadge.className = 'ble-badge ble-badge-connected';
  el.bleManagerBadge.textContent = `${files.length} ARCHIVO${files.length === 1 ? '' : 'S'}`;

  if (files.length === 0) {
    el.bleFilesContainer.innerHTML = `
      <div class="ble-files-placeholder">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        <div>No se encontraron archivos .BIN en la tarjeta MicroSD</div>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Usa la pestaña "Subir Archivo al ESP32" para cargar una imagen o video animado.</div>
      </div>
    `;
    return;
  }

  el.bleFilesContainer.innerHTML = '';
  files.forEach(f => {
    const item = document.createElement('div');
    item.className = 'ble-file-item';

    const left = document.createElement('div');
    left.className = 'ble-file-item-left';

    const icon = document.createElement('div');
    icon.className = `ble-file-type-icon ${f.isVideo ? 'video' : ''}`;
    icon.textContent = f.isVideo ? '🎬' : '🖼️';

    const info = document.createElement('div');
    info.className = 'ble-file-item-info';

    const name = document.createElement('div');
    name.className = 'ble-file-item-name';
    name.title = f.name;
    name.textContent = f.name;

    const meta = document.createElement('div');
    meta.className = 'ble-file-item-meta';
    meta.textContent = `${f.displaySize} ${f.isVideo ? `• Animación (~${f.totalFrames} f)` : '• Imagen fija'}`;

    info.appendChild(name);
    info.appendChild(meta);
    left.appendChild(icon);
    left.appendChild(info);

    const actions = document.createElement('div');
    actions.className = 'ble-file-item-actions';

    const btnShow = document.createElement('button');
    btnShow.className = 'btn-file-action';
    btnShow.title = 'Mostrar este archivo ahora en la pantalla del ESP32';
    btnShow.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Mostrar`;
    btnShow.addEventListener('click', () => handleBleShowFile(f.name));

    const btnDel = document.createElement('button');
    btnDel.className = 'btn-file-action btn-file-delete';
    btnDel.title = 'Eliminar permanentemente este archivo de la MicroSD';
    btnDel.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Eliminar`;
    btnDel.addEventListener('click', () => handleBleDeleteFile(f.name));

    actions.appendChild(btnShow);
    actions.appendChild(btnDel);

    item.appendChild(left);
    item.appendChild(actions);

    el.bleFilesContainer.appendChild(item);
  });
}

async function handleBleShowFile(fileName: string): Promise<void> {
  try {
    await bleUploader.showSDFile(fileName);
    showToast(`Mostrando "${fileName}" en el ESP32`);
  } catch (err: any) {
    showToast(`Error al mostrar archivo: ${err?.message || err}`);
  }
}

async function handleBleDeleteFile(fileName: string): Promise<void> {
  const confirmed = confirm(
    `¿Estás seguro de que deseas eliminar permanentemente el archivo "${fileName}" de la tarjeta MicroSD del ESP32?\n\nEsta acción no se puede deshacer.`
  );
  if (!confirmed) return;

  try {
    showToast(`Eliminando "${fileName}"...`);
    const ok = await bleUploader.deleteSDFile(fileName);
    if (ok) {
      showToast(`✔ Archivo "${fileName}" eliminado con éxito`);
      await loadBleSDFiles();
    } else {
      showToast(`❌ No se pudo eliminar "${fileName}"`);
    }
  } catch (err: any) {
    showToast(`Error al eliminar: ${err?.message || err}`);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUI);
} else {
  initUI();
}

