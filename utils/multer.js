const multer = require("multer");

class Multer {
  constructor(dest){
    this.storage = multer.diskStorage({
      destination: (_, res, cb) => {
        cb(null, dest);
      },
      filename: (_, file, cb) => {
        const name = file.originalname;
        cb(null, name);
      },
    });
    this.uplaod = multer({ storage: this.storage });
  }
}

module.exports = Multer