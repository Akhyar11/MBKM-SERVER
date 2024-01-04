const { DataTypes } = require("sequelize");
const db = require("../utils/db.js");
const fs = require("fs")
const PostF = require("../models/post.js");

const Post = PostF(db, DataTypes);

class PostController {
  async all(req, res) {
    try {
      const post = await Post.findAll();
      return res.status(200).json({ post });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }

  async getId(req, res) {
    const { id } = req.params;
    try {
      const post = await Post.findAll({
        where: {
          id,
        },
      });
      if (post[0] == undefined)
        return res
          .status(400)
          .json({ msg: "Postingan dengan id tersebut tidak tersedia" });

      return res.status(200).json({ post });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }

  async add(req, res) {
    const { title, description, author, link } = req.body;
    try {
      const postCheck = await Post.findAll({
        where: {
          title,
          author,
        },
      });

      if (postCheck[0] != undefined)
        return res.status(400).json({
          msg: "Postingan telah tersedia, ganti atau gunakan judul lain",
        });
      await Post.create({
        title,
        description,
        author,
        picture: "",
        link,
      });
      return res.status(200).json({ msg: "Memebuat postingan berhasil" });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { title, description, author, link } = req.body;
    try {
      const postCheck = await Post.findAll({ where: { id } });

      if (postCheck[0] == undefined)
        return res.status(400).json({
          msg: "Postingan tidak tersedia",
        });
      await Post.update(
        {
          title,
          description,
          author,
          link,
        },
        { where: { id } }
      );
      return res.status(200).json({ msg: "Mengupdate postingan berhasil" });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }

  async drop(req, res) {
    const { id } = req.params;
    try {
      const post = await Post.findAll({ where: { id } });
      if (post[0] === undefined)
        return res
          .status(400)
          .json({ msg: "Menghapus gagal, Postingan tidak tersedia" });
      const path = post[0].picture;
      fs.unlinkSync("." + path);
      Post.destroy({ where: { id } });
      return res.status(200).json({ msg: "Menghapus berhasil" });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }
}

module.exports = new PostController();
