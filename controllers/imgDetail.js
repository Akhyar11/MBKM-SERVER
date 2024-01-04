const { DataTypes } = require("sequelize");
const db = require("../utils/db.js");
const fs = require("fs");
const DetailF = require("../models/detail_desa.js");

const Detail = DetailF(db, DataTypes);

class imgDetailController {
  async add(req, res) {
    console.log("hallo");
    const kode_pos = req.params.kode_pos;
    const name = req.params.name;
    const path =
      (req.file.destination + req.file.originalname).split(".")[1] +
      "." +
      (req.file.destination + req.file.originalname).split(".")[2];
    try {
      const detail = await Detail.findAll({ where: { foto: path } });
      const detail2 = await Detail.findAll({ where: { kode_pos, name } });
      if (detail[0] !== undefined) {
        return res.status(400).json({
          msg: "Maaf gunakan foto lain, foto sudah tersedia di database",
        });
      }
      if (detail2[0].foto !== "") fs.unlinkSync("." + detail2[0].foto);
      await Detail.update({ foto: path }, { where: { kode_pos, name } });

      return res.status(200).json({ msg: "Berhasil menambahkan gambar" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal upload gambar" });
    }
  }
}

module.exports = new imgDetailController();
