const { DataTypes } = require("sequelize");
const db = require("../utils/db.js");
const bcryptjs = require("bcryptjs");
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

      if (user[0] == undefined)
        return res.status(400).json({ mag: "Username tidak tersedia" });
      const confPass = await bcryptjs.compare(pass, user[0].pass);
      if (!confPass) return res.status(400).json({ msg: "Password salah" });
      const userId = user[0].id;
      const admin = user[0].is_admin;

      const accessToken = jwt.sign(
        { userId, username, admin },
        process.env.ACCSESS_TOKEN_SECRET,
        { expiresIn: "20s" },
      );
      const refreshToken = jwt.sign(
        { userId, username, admin },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "5m" },
      );

      await User.update({ token: refreshToken }, { where: { id: userId } });

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

      const salt = await bcryptjs.genSalt();
      const bcryptOfPass = await bcryptjs.hash(pass, salt);

      await User.create({ username, pass: bcryptOfPass, is_admin, token: "" });
      return res.status(200).json({ msg: "User berhasil dibuat" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "err dari sisi server" });
    }
  }

  token(req, res) {
    try {
      const { token } = req.cookies;
      jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decode) => {
          if (err) return res.status(200).json({ msg: "Harap login dulu" });
          const userId = decode.userId;
          const username = decode.username;
          const admin = decode.admin;
          const user = await User.findAll({ where: { id: userId } });
          if (user[0] == undefined)
            return res
              .status(400)
              .json({ msg: "Token dengan user tidak cocok" });
          const accessToken = jwt.sign(
            { userId, username, admin },
            process.env.ACCSESS_TOKEN_SECRET,
            { expiresIn: "20s" },
          );
          return res.status(200).json({ accessToken });
        },
      );
    } catch (err) {
      console.log(err);
      res.status(400);
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
