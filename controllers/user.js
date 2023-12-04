const { DataTypes } = require("sequelize");
const db = require("../utils/db.js");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const UserF = require("../models/user.js");

const User = UserF(db, DataTypes);
dotenv.config();

class UserController {
  async login(req, res) {
    const { username, pass } = req.body;
    try {
      const user = await User.findAll({
        where: {
          username,
        },
      });

      const confPass = await bcrypt.compare(pass, user[0].pass);
      if (!confPass) return res.status(400).json({ msg: "Password salah" });
      const userId = user[0].id;
      const admin = user[0].is_admin;
      const accessToken = jwt.sign(
        { userId, username, admin },
        process.env.ACCSESS_TOKEN_SECRET,
        { expiresIn: "20s" }
      );
      const refreshToken = jwt.sign(
        { userId, username, admin },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "5m" }
      );

      res.cookie("token", refreshToken, {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });

      return res.status(200).json({ accessToken });
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }

  async register(req, res) {
    const { username, pass, is_admin } = req.body;
    try {
      const user = await User.findAll({
        where: {
          username,
        },
      });

      if (user[0] != undefined)
        return res
          .status(400)
          .json({ msg: "Username telah tersedia gunakan username lain" });

      const salt = await bcrypt.genSalt();
      const bcryptOfPass = await bcrypt.hash(pass, salt);

      await User.create({ username, pass: bcryptOfPass, is_admin });
      return res.status(200).json({ msg: "User berhasil dibuat" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "err dari sisi server" });
    }
  }

  logout() {
    try {
      res.clearCookie("token");
      return res.status(200).json({ msg: "berhasil keluar" });
    } catch (err) {
      return res.status(400);
    }
  }
}

module.exports = new UserController();
