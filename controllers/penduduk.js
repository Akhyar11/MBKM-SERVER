const { DataTypes } = require("sequelize");
const db = require("../utils/db.js");
const fs = require("fs")
const PendudukF = require("../models/penduduk.js");

const Penduduk = PendudukF(db, DataTypes);

class PendudukController {
  async all(req, res) {
    try {
      const penduduk = await Penduduk.findAll();
      return res.status(200).json({ penduduk });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }

  async getId(req, res) {
    const { id } = req.params;
    try {
      const penduduk = await Penduduk.findAll({
        where: {
          id,
        },
      });
      if (penduduk[0] == undefined)
        return res
          .status(400)
          .json({ msg: "Penduduk dengan id tersebut tidak tersedia" });

      return res.status(200).json({ penduduk });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }

  async add(req, res) {
    const { name, no_kk, no_induk, nama_ibu, jk } = req.body;
    try {
      const pendudukCheck = await Penduduk.findAll({
        where: {
          no_kk,
          no_induk,
        },
      });

      if (pendudukCheck[0] != undefined)
        return res.status(400).json({
          msg: "Penduduk telah tersedia, ganti atau gunakan judul lain",
        });
      await Penduduk.create({
        name,
        no_kk,
        no_induk,
        nama_ibu,
        jk,
        foto: "",
      });
      return res.status(200).json({ msg: "Memebuat Penduduk berhasil" });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { name, no_kk, no_induk, nama_ibu, jk } = req.body;
    try {
      const pendudukCheck = await Penduduk.findAll({ where: { id } });

      if (pendudukCheck[0] == undefined)
        return res.status(400).json({
          msg: "Penduduk tidak tersedia",
        });
      await Penduduk.update(
        {
          name,
          no_kk,
          no_induk,
          nama_ibu,
          jk,
        },
        { where: { id } }
      );
      return res.status(200).json({ msg: "Mengupdate Penduduk berhasil" });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }

  async drop(req, res) {
    const { id } = req.params;
    try {
      const penduduk = await Penduduk.findAll({ where: { id } });
      if (penduduk[0] === undefined)
        return res
          .status(400)
          .json({ msg: "Menghapus gagal, Penduduk tidak tersedia" });
      const path = penduduk[0].foto;
      fs.unlinkSync("." + path);
      Penduduk.destroy({ where: { id } });
      return res.status(200).json({ msg: "Menghapus berhasil" });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }
}

module.exports = new PendudukController();
