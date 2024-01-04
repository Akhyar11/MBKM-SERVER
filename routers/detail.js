const express = require("express");
const DetailController = require("../controllers/detail.js");
const verifyToken = require("../middelware/verify.js");
const multer = require("multer");
const imgDetailController = require("../controllers/imgDetail.js");

class Detail {
  constructor() {
    this.router = express.Router();
    this.storage = multer.diskStorage({
      destination: (_, res, cb) => {
        cb(null, "./public/img/detail/");
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
    this.router.get("/", DetailController.all);
    this.router.get("/:id", DetailController.getId);
    this.router.post("/", verifyToken, DetailController.add);
    this.router.put("/:id", verifyToken, DetailController.update);
    this.router.delete("/:id", verifyToken, DetailController.drop);

    // Img Body
    this.router.post(
      "/img/:kode_pos/:name",
      verifyToken,
      this.uplaod.single("detail"),
      imgDetailController.add
    );
  }
}

module.exports = new Detail().router;
