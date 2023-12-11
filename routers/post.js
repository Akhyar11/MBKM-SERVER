const express = require("express");
const PostController = require("../controllers/post.js");
const verifyToken = require("../middelware/verify.js");

class Post {
  constructor() {
    this.router = express.Router();
    this.useRouters();
  }

  useRouters() {
    this.router.get("/", PostController.all);
    this.router.get("/:id", PostController.getId);
    this.router.post("/", verifyToken, PostController.add);
    this.router.put("/:id", verifyToken, PostController.update);
    this.router.delete("/:id", verifyToken, PostController.drop);
  }
}

module.exports = new Post().router;
