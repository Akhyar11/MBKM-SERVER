const express = require("express");
const UserController = require("../controllers/user.js");
const verifyToken = require("../middelware/verify.js");
const multer = require("multer");
const imgControllerUser = require("../controllers/imgUser.js");

class Auth {
  constructor() {
    this.router = express.Router();
    this.storage = multer.diskStorage({
      destination: (_, res, cb) => {
        cb(null, "./public/img/user/");
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
    this.router.get("/", UserController.all);
    this.router.get("/:id", UserController.getById);
    this.router.post("/login", UserController.login);
    this.router.post("/register", verifyToken, UserController.register);
    this.router.post("/register/admin", UserController.regiserFristAdmin);
    this.router.put("/pass/:id", verifyToken, UserController.updatePass);
    this.router.patch("/:id", verifyToken, UserController.updateUser);
    this.router.post("/token", UserController.token);
    this.router.delete("/logout", verifyToken, UserController.logout);
    this.router.delete("/:id", verifyToken, UserController.drop);

    // Img Body
    this.router.post(
      "/img/:id",
      verifyToken,
      this.uplaod.single("user"),
      imgControllerUser.add
    );
  }
}

module.exports = new Auth().router;
