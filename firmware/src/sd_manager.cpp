#include "sd_manager.h"

SDManager sdManager;

SDManager::SDManager() : mounted(false), activeSpeed(16000000) {}

bool SDManager::init() {
  pinMode(5, INPUT_PULLUP); // Pull-up interno en MISO
  SPI.begin(4, 5, 6, SD_CS_PIN);
  delay(100);

  Serial.println("[SD] Probando inicialización de MicroSD a 16 MHz...");
  activeSpeed = 16000000;
  mounted = SD.begin(SD_CS_PIN, SPI, 16000000);

  const uint32_t fallbacks[] = {12000000, 8000000, 4000000, 1000000, 400000};
  for (uint32_t speed : fallbacks) {
    if (mounted) break;
    Serial.printf("[SD] Reintentando SD a %u MHz...\n", (unsigned int)(speed / 1000000));
    delay(50);
    activeSpeed = speed;
    mounted = SD.begin(SD_CS_PIN, SPI, speed);
  }

  if (mounted) {
    Serial.printf("✔ [SD] MicroSD montada a %u MHz. Total: %llu MB\n",
                  (unsigned int)(activeSpeed / 1000000), SD.totalBytes() / (1024 * 1024));
  } else {
    Serial.println("❌ [SD] No se pudo inicializar la MicroSD.");
  }
  return mounted;
}

void SDManager::scanPhotos() {
  photoList.clear();
  if (!mounted) return;

  File root = SD.open("/");
  if (!root || !root.isDirectory()) {
    Serial.println("[SD] Error al abrir directorio raíz /");
    return;
  }

  File file = root.openNextFile();
  while (file) {
    if (!file.isDirectory()) {
      String name = file.name();
      String lower = name;
      lower.toLowerCase();

      if (!name.startsWith("._") && !lower.startsWith("system") &&
          (lower.endsWith(".bin") || lower.endsWith(".bmpr"))) {
        String fullPath = name.startsWith("/") ? name : "/" + name;
        photoList.push_back(fullPath);
      }
    }
    file = root.openNextFile();
  }
  root.close();

  Serial.printf("[SD] Escaneo completado: %u archivos encontrados (.bin / .bmpr)\n",
                (unsigned int)photoList.size());
}

String SDManager::getPhotoPath(int index) const {
  if (photoList.empty()) return "";
  if (index < 0) index = photoList.size() - 1;
  if (index >= (int)photoList.size()) index = 0;
  return photoList[index];
}

int SDManager::findPhotoIndex(const String &path) const {
  for (size_t i = 0; i < photoList.size(); i++) {
    if (photoList[i] == path) return (int)i;
  }
  return -1;
}

bool SDManager::deletePhoto(const String &path) {
  if (!mounted) return false;
  String target = path.startsWith("/") ? path : "/" + path;
  bool ok = false;
  if (SD.exists(target)) {
    ok = SD.remove(target);
  }
  if (ok) {
    scanPhotos();
  }
  return ok;
}

int SDManager::parseFpsFromFilename(const String &filename) {
  String lower = filename;
  lower.toLowerCase();
  int fpsIdx = lower.indexOf("fps");
  if (fpsIdx > 0) {
    int endDigits = fpsIdx;
    while (endDigits > 0 && (lower[endDigits - 1] == ' ' || lower[endDigits - 1] == '_' || lower[endDigits - 1] == '-')) {
      endDigits--;
    }
    int startDigits = endDigits;
    while (startDigits > 0 && isDigit(lower[startDigits - 1])) {
      startDigits--;
    }
    if (startDigits < endDigits) {
      int val = lower.substring(startDigits, endDigits).toInt();
      if (val >= 1 && val <= 60) {
        return val;
      }
    }
  }
  return 0;
}

// Inspecciona si el archivo cuenta con cabecera BMPR o es Legacy Raw
bool SDManager::inspectPhoto(const String &path, BmprHeader &header, bool &isBmpr,
                             int &origW, int &origH, int &totalFrames, int &fps, size_t &fileSize) {
  if (!mounted) return false;

  File f = SD.open(path, FILE_READ);
  if (!f) return false;

  fileSize = f.size();
  isBmpr = false;

  // 1. Probar si contiene cabecera BMPR de 16 bytes
  if (fileSize >= sizeof(BmprHeader)) {
    size_t readLen = f.read((uint8_t *)&header, sizeof(BmprHeader));
    if (readLen == sizeof(BmprHeader) && memcmp(header.magic, BMPR_MAGIC, 4) == 0) {
      isBmpr = true;
      origW = header.width;
      origH = header.height;
      totalFrames = (header.totalFrames > 0) ? header.totalFrames : 1;
      fps = (header.fps > 0 && header.fps <= 60) ? header.fps : 15;
      f.close();
      Serial.printf("[SD] Archivo BMPR detectado: %s (%dx%d, %d cuadros, %d FPS)\n",
                    path.c_str(), origW, origH, totalFrames, fps);
      return true;
    }
  }
  f.close();

  // 2. Fallback a Legacy Raw (40960 = 128x160, 115200 = 240x240, 153600 = 240x320)
  if (fileSize >= 40960 && (fileSize % 40960 == 0)) {
    origW = IMAGE_WIDTH;
    origH = IMAGE_HEIGHT;
    totalFrames = fileSize / 40960;
  } else if (fileSize >= 115200 && (fileSize % 115200 == 0)) {
    origW = 240;
    origH = 240;
    totalFrames = fileSize / 115200;
  } else if (fileSize >= 153600 && (fileSize % 153600 == 0)) {
    origW = 240;
    origH = 320;
    totalFrames = fileSize / 153600;
  } else {
    // Archivo no compatible
    return false;
  }

  int detectedFps = parseFpsFromFilename(path);
  fps = (detectedFps > 0) ? detectedFps : 15;
  Serial.printf("[SD] Archivo Legacy Raw detectado: %s (%dx%d, %d cuadros, %d FPS)\n",
                path.c_str(), origW, origH, totalFrames, fps);
  return true;
}
