const express = require("express");
const UserController = require("../controllers/user.js");

class Auth {
  constructor() {
    this.router = express.Router();
    this.useRouters();
  }

  useRouters() {
    // User general
    this.router.post("/login", UserController.login);
    this.router.post("/register", UserController.register);
    this.router.delete("/logout", UserController.logout);
  }
}

module.exports = new Auth().router;
