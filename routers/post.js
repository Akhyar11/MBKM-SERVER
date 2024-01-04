const express = require("express");
const PostController = require("../controllers/post.js");
const verifyToken = require("../middelware/verify.js");
const multer = require("multer");
const ImgPostController = require("../controllers/imgPost.js");

class Post {
  constructor() {
    this.router = express.Router();
    this.storage = multer.diskStorage({
      destination: (_, res, cb) => {
        cb(null, "./public/img/berita/");
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
    this.router.get("/", PostController.all);
    this.router.get("/:id", PostController.getId);
    this.router.post("/", verifyToken, PostController.add);
    this.router.put("/:id", verifyToken, PostController.update);
    this.router.delete("/:id", verifyToken, PostController.drop);

    // Img Body
    this.router.post(
      "/img/:title/:author",
      verifyToken,
      this.uplaod.single("berita"),
      ImgPostController.add
    );

    this.router.put(
      "/img/edit/:id",
      verifyToken,
      this.uplaod.single("berita"),
      ImgPostController.update
    );
  }
}

module.exports = new Post().router;
