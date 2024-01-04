const { DataTypes } = require("sequelize");
const db = require("../utils/db.js");
const fs = require("fs");
const PostF = require("../models/post.js");

const Post = PostF(db, DataTypes);

class ImgPostController {
  async add(req, res) {
    const title = req.params.title;
    const author = req.params.author;
    const path =
      (req.file.destination + req.file.originalname).split(".")[1] +
      "." +
      (req.file.destination + req.file.originalname).split(".")[2];
    try {
      const post = await Post.findAll({ where: { picture: path } });
      if (post[0] !== undefined) {
        await Post.destroy({ where: { title } });
        return res.status(400).json({
          msg: "Maaf gunakan foto lain, foto sudah tersedia di database",
        });
      }
      
      await Post.update({ picture: path }, { where: { title, author } });

      return res.status(200).json({ msg: "Berhasil menambahkan gambar" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal upload gambar" });
    }
  }

  async update(req, res) {
    const id = req.params.id;
    const path =
      (req.file.destination + req.file.originalname).split(".")[1] +
      "." +
      (req.file.destination + req.file.originalname).split(".")[2];
    try {
      const post = await Post.findAll({ where: { picture: path } });
      if (post[0] !== undefined)
        return res.status(400).json({
          msg: "Maaf gunakan foto lain, foto sudah tersedia di database",
        });
      
      const post2 = await Post.findAll({ where: { id } });
      if (post2[0].picture !== "") fs.unlinkSync("." + post2[0].picture);
      await Post.update({ picture: path }, { where: { id } });

      return res.status(200).json({ msg: "Berhasil menambahkan gambar" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal upload gambar" });
    }
  }
}

module.exports = new ImgPostController();
