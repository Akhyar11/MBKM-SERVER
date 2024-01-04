const { DataTypes } = require("sequelize");
const db = require("../utils/db.js");
const fs = require("fs");
const KegiatanF = require("../models/kegitan.js");

const Kegiatan = KegiatanF(db, DataTypes);

class imgKegiatanController {
  async add(req, res) {
    const title = req.params.title;
    const path =
      (req.file.destination + req.file.originalname).split(".")[1] +
      "." +
      (req.file.destination + req.file.originalname).split(".")[2];
    try {
      const kegiatan = await Kegiatan.findAll({ where: { picture: path } });
      if (kegiatan[0] !== undefined) {
        await Kegiatan.destroy({ where: { title } });
        return res.status(400).json({
          msg: "Maaf gunakan foto lain, foto sudah tersedia di database",
        });
      }

      await Kegiatan.update(
        { picture: path },
        { where: { title } }
      );

      return res.status(200).json({ msg: "Berhasil menambahkan gambar" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal upload gambar" });
    }
  }

  async update(req, res) {
    const title = req.params.title;
    const path =
      (req.file.destination + req.file.originalname).split(".")[1] +
      "." +
      (req.file.destination + req.file.originalname).split(".")[2];
    try {
      const kegiatan = await Kegiatan.findAll({ where: { picture: path } });
      const kegiatan2 = await Kegiatan.findAll({ where: { title } });
      if (kegiatan[0] !== undefined) {
        return res.status(400).json({
          msg: "Maaf gunakan foto lain, foto sudah tersedia di database",
        });
      }
      if (kegiatan2[0].picture !== "") fs.unlinkSync("." + kegiatan2[0].picture);
      await Kegiatan.update(
        { picture: path },
        { where: { title } }
      );

      return res.status(200).json({ msg: "Berhasil menambahkan gambar" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal upload gambar" });
    }
  }
}

module.exports = new imgKegiatanController();
