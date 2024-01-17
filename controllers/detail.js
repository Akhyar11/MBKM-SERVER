const { DataTypes } = require("sequelize");
const db = require("../utils/db.js");
const fs = require("fs");
const DetailF = require("../models/detail_desa.js");

const Detail = DetailF(db, DataTypes);

class DetailController {
  async all(req, res) {
    try {
      const detail = await Detail.findAll();
      return res.status(200).json({ detail });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }

  async getId(req, res) {
    const { id } = req.params;
    try {
      const detail = await Detail.findAll({
        where: {
          id,
        },
      });
      if (detail[0] == undefined)
        return res
          .status(400)
          .json({ msg: "detail dengan id tersebut tidak tersedia" });

      return res.status(200).json({ detail });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }

  async add(req, res) {
    const { name, alamat, provensi, kota, kode_pos } = req.body;
    try {
      const detailCheck = await Detail.findAll({
        where: {
          kode_pos,
          name,
        },
      });

      if (detailCheck[0] != undefined)
        return res.status(400).json({
          msg: "detail telah tersedia, ganti atau gunakan judul lain",
        });
      await Detail.create({
        name,
        alamat,
        provensi,
        kota,
        kode_pos,
        foto: "",
      });
      return res.status(200).json({ msg: "Memebuat detail berhasil" });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { name, alamat, provensi, kota, kode_pos } = req.body;
    try {
      const detailCheck = await Detail.findAll({ where: { id } });

      if (detailCheck[0] == undefined)
        return res.status(400).json({
          msg: "detail tidak tersedia",
        });
      await Detail.update(
        {
          name,
          alamat,
          provensi,
          kota,
          kode_pos,
        },
        { where: { id } }
      );
      return res.status(200).json({ msg: "Mengupdate detail berhasil" });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }

  async drop(req, res) {
    const { id } = req.params;
    try {
      const detail = await Detail.findAll({ where: { id } });
      if (detail[0] === undefined)
        return res
          .status(400)
          .json({ msg: "Menghapus gagal, detail tidak tersedia" });
      const path = detail[0].foto;
      fs.unlinkSync("." + path);
      Detail.destroy({ where: { id } });
      return res.status(200).json({ msg: "Menghapus berhasil" });
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }
}

module.exports = new DetailController();
