const express = require("express");
const verifyToken = require("../middelware/verify.js");
const PendudukController = require("../controllers/penduduk.js");
const multer = require("multer");
const ImgPendudukController = require("../controllers/imgPenduduk.js")

class Penduduk {
  constructor() {
    this.router = express.Router();
    this.storage = multer.diskStorage({
      destination: (_, res, cb) => {
        cb(null, "./public/img/penduduk/");
      },
      filename: (_, file, cb) => {
        const name = file.originalname
        cb(null, name);
      },
    });
    this.uplaod = multer({ storage: this.storage });
    this.useRouters();
  }

  useRouters() {
    // Json Body
    this.router.get("/", PendudukController.all);
    this.router.get("/:id", PendudukController.getId);
    this.router.post("/", verifyToken, PendudukController.add);
    this.router.put("/:id", verifyToken, PendudukController.update);
    this.router.delete("/:id", verifyToken, PendudukController.drop);

    // Img Body
    this.router.post(
      "/img/:kk/:induk",
      verifyToken,
      this.uplaod.single("penduduk"),
      ImgPendudukController.add
    );

    this.router.put(
      "/img/edit/:kk/:induk",
      verifyToken,
      this.uplaod.single("penduduk"),
      ImgPendudukController.update
    );
  }
}

module.exports = new Penduduk().router;
