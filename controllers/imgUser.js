const { DataTypes } = require("sequelize");
const db = require("../utils/db.js");
const fs = require("fs");
const UserF = require("../models/user.js");

const User = UserF(db, DataTypes);

class imgControllerUser {
  async add(req, res) {
    console.log("hallo");
    const id = req.params.id;
    const path =
      (req.file.destination + req.file.originalname).split(".")[1] +
      "." +
      (req.file.destination + req.file.originalname).split(".")[2];
    try {
      const user = await User.findAll({ where: { foto: path } });
      const user2 = await User.findAll({ where: { id } });
      if (user[0] !== undefined) {
        return res.status(400).json({
          msg: "Maaf gunakan foto lain, foto sudah tersedia di database",
        });
      }
      if (user2[0].foto !== "") fs.unlinkSync("." + user2[0].foto);
      await User.update({ foto: path }, { where: { id } });

      return res.status(200).json({ msg: "Berhasil menambahkan gambar" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal upload gambar" });
    }
  }
}

module.exports = new imgControllerUser();
