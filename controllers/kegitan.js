const { DataTypes } = require("sequelize");
const db = require("../utils/db.js");
const fs = require("fs");
const KegiatanF = require("../models/kegitan.js");

const Kegiatan = KegiatanF(db, DataTypes);

class KegiatanController {
  async all(req, res) {
    try {
      const kegiatan = await Kegiatan.findAll();
      return res.status(200).json({ kegiatan });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }

  async getId(req, res) {
    const { id } = req.params;
    try {
      const kegiatan = await Kegiatan.findAll({
        where: {
          id,
        },
      });
      if (kegiatan[0] == undefined)
        return res
          .status(400)
          .json({ msg: "kegiatan dengan id tersebut tidak tersedia" });

      return res.status(200).json({ kegiatan });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }

  async add(req, res) {
    const { title, description } = req.body;
    try {
      const kegiatanCheck = await Kegiatan.findAll({
        where: {
          title
        },
      });

      if (kegiatanCheck[0] != undefined)
        return res.status(400).json({
          msg: "kegiatan telah tersedia, ganti atau gunakan judul lain",
        });
      await Kegiatan.create({
        title,
        description,
        picture: "",
      });
      return res.status(200).json({ msg: "Memebuat kegiatan berhasil" });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
      const kegiatanCheck = await Kegiatan.findAll({ where: { id } });

      if (kegiatanCheck[0] == undefined)
        return res.status(400).json({
          msg: "kegiatan tidak tersedia",
        });
      await Kegiatan.update(
        {
          title,
          description
        },
        { where: { id } }
      );
      return res.status(200).json({ msg: "Mengupdate kegiatan berhasil" });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }

  async drop(req, res) {
    const { id } = req.params;
    try {
      const kegiatan = await Kegiatan.findAll({ where: { id } });
      if (kegiatan[0] === undefined)
        return res
          .status(400)
          .json({ msg: "Menghapus gagal, kegiatan tidak tersedia" });
      const path = kegiatan[0].picture;
      fs.unlinkSync("." + path);
      Kegiatan.destroy({ where: { id } });
      return res.status(200).json({ msg: "Menghapus berhasil" });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }
}

module.exports = new KegiatanController();
