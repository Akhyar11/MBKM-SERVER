const { DataTypes } = require("sequelize");
const db = require("../utils/db.js");
const fs = require("fs");
const PendudukF = require("../models/penduduk.js");

const Penduduk = PendudukF(db, DataTypes);

class ImgPendudukController {
  async add(req, res) {
    const no_kk = req.params.kk;
    const no_induk = req.params.induk;
    const path =
      (req.file.destination + req.file.originalname).split(".")[1] +
      "." +
      (req.file.destination + req.file.originalname).split(".")[2];
    try {
      const penduduk = await Penduduk.findAll({ where: { foto: path } });
      if (penduduk[0] !== undefined) {
        await Penduduk.destroy({ where: { no_induk, no_kk } });
        return res.status(400).json({
          msg: "Maaf gunakan foto lain, foto sudah tersedia di database",
        });
      }

      await Penduduk.update({ foto: path }, { where: { no_kk, no_induk } });

      return res.status(200).json({ msg: "Berhasil menambahkan gambar" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal upload gambar" });
    }
  }

  async update(req, res) {
    const no_kk = req.params.kk;
    const no_induk = req.params.induk;
    const path =
      (req.file.destination + req.file.originalname).split(".")[1] +
      "." +
      (req.file.destination + req.file.originalname).split(".")[2];
    try {
      const penduduk = await Penduduk.findAll({ where: { foto: path } });
      const penduduk2 = await Penduduk.findAll({ where: { no_induk, no_kk } });
      if (penduduk[0] !== undefined) {
        return res.status(400).json({
          msg: "Maaf gunakan foto lain, foto sudah tersedia di database",
        });
      }
      if (penduduk2[0].foto !== "") fs.unlinkSync("." + penduduk2[0].foto);
      await Penduduk.update({ foto: path }, { where: { no_kk, no_induk } });

      return res.status(200).json({ msg: "Berhasil menambahkan gambar" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal upload gambar" });
    }
  }
}

module.exports = new ImgPendudukController();
