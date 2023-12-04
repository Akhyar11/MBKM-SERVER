const express = require("express");
const PostController = require("../controllers/post.js");

class Post {
  constructor() {
    this.router = express.Router();
    this.useRouters();
  }

  useRouters() {
    this.router.get("/", PostController.all);
    this.router.get("/:id", PostController.getId);
    this.router.post("/", PostController.add);
    this.router.put("/:id", PostController.update);
    this.router.delete("/:id", PostController.drop);
  }
}

module.exports = new Post().router;
