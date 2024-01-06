const express = require("express");
const verifyToken = require("../middelware/verify.js");
const PengurusController = require("../controllers/pengurus.js");
const multer = require("multer");
const ImgPengurusController = require("../controllers/imgPengurus.js");

class Pengurus {
  constructor() {
    this.router = express.Router();
    this.storage = multer.diskStorage({
      destination: (_, res, cb) => {
        cb(null, "./public/img/pengurus/");
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
    // Json Body
    this.router.get("/", PengurusController.all);
    this.router.get("/:id", PengurusController.getId);
    this.router.post("/", verifyToken, PengurusController.add);
    this.router.put("/:id", verifyToken, PengurusController.update);
    this.router.delete("/:id", verifyToken, PengurusController.drop);

    // Img Body
    this.router.post(
      "/img/:jabatan/:nama",
      verifyToken,
      this.uplaod.single("pengurus"),
      ImgPengurusController.add
    );

    this.router.put(
      "/img/edit/:jabatan/:nama",
      verifyToken,
      this.uplaod.single("pengurus"),
      ImgPengurusController.update
    );
  }
}

module.exports = new Pengurus().router;
