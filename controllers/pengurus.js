const { DataTypes } = require("sequelize");
const db = require("../utils/db.js");
const fs = require("fs");
const PengurusF = require("../models/pengurus.js");

const Pengurus = PengurusF(db, DataTypes);

class PengurusController {
  async all(req, res) {
    try {
      const pengurus = await Pengurus.findAll();
      return res.status(200).json({ pengurus });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }

  async getId(req, res) {
    const { id } = req.params;
    try {
      const pengurus = await Pengurus.findAll({
        where: {
          id,
        },
      });
      if (pengurus[0] == undefined)
        return res
          .status(400)
          .json({ msg: "pengurus dengan id tersebut tidak tersedia" });

      return res.status(200).json({ pengurus });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }

  async add(req, res) {
    const { nama, jabatan, tanggal_lahir, email, jk } = req.body;
    try {
      const pengurusCheck = await Pengurus.findAll({
        where: {
          nama,
          jabatan,
        },
      });

      if (pengurusCheck[0] != undefined)
        return res.status(400).json({
          msg: "pengurus telah tersedia, ganti atau gunakan judul lain",
        });
      await Pengurus.create({
        nama,
        jabatan,
        tanggal_lahir,
        email,
        jk,
        foto: "",
      });
      return res.status(200).json({ msg: "Memebuat pengurus berhasil" });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { nama, jabatan, tanggal_lahir, email, jk } = req.body;
    try {
      const pengurusCheck = await Pengurus.findAll({ where: { id } });

      if (pengurusCheck[0] == undefined)
        return res.status(400).json({
          msg: "pengurus tidak tersedia",
        });
      await Pengurus.update(
        {
          nama,
          jabatan,
          email,
          tanggal_lahir,
          jk,
        },
        { where: { id } }
      );
      return res.status(200).json({ msg: "Mengupdate pengurus berhasil" });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }

  async drop(req, res) {
    const { id } = req.params;
    try {
      const pengurus = await Pengurus.findAll({ where: { id } });
      if (pengurus[0] === undefined)
        return res
          .status(400)
          .json({ msg: "Menghapus gagal, pengurus tidak tersedia" });
      const path = pengurus[0].foto;
      Pengurus.destroy({ where: { id } });
      fs.unlinkSync("." + path);
      return res.status(200).json({ msg: "Menghapus berhasil" });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }
}

module.exports = new PengurusController();
