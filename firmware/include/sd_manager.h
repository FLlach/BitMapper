#pragma once

#include "config.h"
#include <SD.h>
#include <SPI.h>
#include <vector>

class SDManager {
public:
  SDManager();
  bool init();
  void scanPhotos();
  bool isMounted() const { return mounted; }

  size_t getPhotoCount() const { return photoList.size(); }
  String getPhotoPath(int index) const;
  int findPhotoIndex(const String &path) const;

  bool deletePhoto(const String &path);

  // Inspección de archivo para detectar si es BMPR o Legacy Raw
  bool inspectPhoto(const String &path, BmprHeader &header, bool &isBmpr,
                    int &origW, int &origH, int &totalFrames, int &fps, size_t &fileSize);

  static int parseFpsFromFilename(const String &filename);

  const std::vector<String> &getPhotoList() const { return photoList; }

private:
  bool mounted;
  uint32_t activeSpeed;
  std::vector<String> photoList;
};

extern SDManager sdManager;
