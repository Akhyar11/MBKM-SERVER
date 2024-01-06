const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const db = require("./utils/db.js");
const Auth = require("./routers/auth.js");
const Post = require("./routers/post.js");
const Penduduk = require("./routers/penduduk.js");
const Kegiatan = require("./routers/kegitan.js");
const Detail = require("./routers/detail.js");
const Pengurus = require("./routers/pengurus.js");

class App {
  constructor() {
    this.app = express();
    this.port = 5000;
  }

  async #con() {
    try {
      await db.authenticate();
      console.log("Database connection...");
    } catch (err) {
      console.log(err);
    }
  }

  #plugins() {
    this.app.use("/public", express.static(path.join("public")));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  #router() {
    // User auth
    this.app.use("/api/user", Auth);

    // Post
    this.app.use("/api/post", Post);

    // Penduduk
    this.app.use("/api/penduduk", Penduduk);

    // Kegiatan
    this.app.use("/api/kegiatan", Kegiatan);

    // Detail Desa
    this.app.use("/api/detail", Detail);

    // Pengurus Desa
    this.app.use("/api/pengurus", Pengurus)

  }

  async run() {
    await this.#con();
    this.#plugins();
    this.#router();
    this.app.listen(this.port, () => console.log("server on!"));
  }
}

const server = new App();
server.run();
