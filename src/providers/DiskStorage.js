const fs = require("fs");
const path = require("path");
const uploadConfig = require("../configs/upload");

class DiskStorage {
  async saveFile(file) {
    try {
      await fs.promises.rename(
        path.resolve(uploadConfig.TMP_FOLDER, file),
        path.resolve(uploadConfig.UPLOADS_FOLDER, file)
      );

      return { success: true, file: file};
    } catch (error) {
      return { success: false, error: error.message };
    };
  };

  async deleteFile(file) {
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

    try {
      await fs.promises.stat(filePath);
      await fs.promises.unlink(filePath);
    } catch (error) {
      return { success: false, error: error.message };
    };

    return { success: true, file: file };
  };
};

module.exports = DiskStorage;