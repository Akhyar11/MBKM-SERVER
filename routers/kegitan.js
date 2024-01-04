const express = require("express");
const KegiatanController = require("../controllers/kegitan.js");
const verifyToken = require("../middelware/verify.js");
const multer = require("multer");
const imgKegiatanController = require("../controllers/imgKegiatan.js");

class Kegiatan {
  constructor() {
    this.router = express.Router();
    this.storage = multer.diskStorage({
      destination: (_, res, cb) => {
        cb(null, "./public/img/kegiatan/");
      },
      filename: (_, file, cb) => {
        const name = file.originalname;
        cb(null, name);
      },
    });
    this.uplaod = multer({ storage: this.storage });
    this.useRouters();
  }

  useRouters() {
    // User general
    this.router.get("/", KegiatanController.all);
    this.router.get("/:id", KegiatanController.getId);
    this.router.post("/", verifyToken, KegiatanController.add);
    this.router.put("/:id", verifyToken, KegiatanController.update);
    this.router.delete("/:id", verifyToken, KegiatanController.drop);

    // Img Body
    this.router.post(
      "/img/:title",
      verifyToken,
      this.uplaod.single("kegiatan"),
      imgKegiatanController.add
    );

    this.router.put(
      "/img/edit/:title",
      verifyToken,
      this.uplaod.single("kegiatan"),
      imgKegiatanController.update
    );
  }
}

module.exports = new Kegiatan().router;
