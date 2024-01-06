const { DataTypes } = require("sequelize");
const db = require("../utils/db.js");
const fs = require("fs");
const PengurusF = require("../models/pengurus.js");

const Pengurus = PengurusF(db, DataTypes);

class ImgpengurusController {
  async add(req, res) {
    const nama = req.params.nama;
    const jabatan = req.params.jabatan;
    const path =
      (req.file.destination + req.file.originalname).split(".")[1] +
      "." +
      (req.file.destination + req.file.originalname).split(".")[2];
    try {
      const pengurus = await Pengurus.findAll({ where: { foto: path } });
      if (pengurus[0] !== undefined) {
        await Pengurus.destroy({ where: { jabatan, nama } });
        return res.status(400).json({
          msg: "Maaf gunakan foto lain, foto sudah tersedia di database",
        });
      }

      await Pengurus.update({ foto: path }, { where: { nama, jabatan } });

      return res.status(200).json({ msg: "Berhasil menambahkan gambar" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal upload gambar" });
    }
  }

  async update(req, res) {
    const nama = req.params.nama;
    const jabatan = req.params.jabatan;
    const path =
      (req.file.destination + req.file.originalname).split(".")[1] +
      "." +
      (req.file.destination + req.file.originalname).split(".")[2];
    try {
      const pengurus = await Pengurus.findAll({ where: { foto: path } });
      const pengurus2 = await Pengurus.findAll({ where: { jabatan, nama } });
      if (pengurus[0] !== undefined) {
        return res.status(400).json({
          msg: "Maaf gunakan foto lain, foto sudah tersedia di database",
        });
      }
      if (pengurus2[0].foto !== "") fs.unlinkSync("." + pengurus2[0].foto);
      await Pengurus.update({ foto: path }, { where: { nama, jabatan } });

      return res.status(200).json({ msg: "Berhasil menambahkan gambar" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal upload gambar" });
    }
  }
}

module.exports = new ImgpengurusController();
