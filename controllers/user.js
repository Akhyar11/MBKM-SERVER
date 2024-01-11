const { DataTypes } = require("sequelize");
const db = require("../utils/db.js");
const bcryptjs = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const UserF = require("../models/user.js");

const User = UserF(db, DataTypes);
dotenv.config();

class UserController {
  async all(_, res) {
    try {
      const user = await User.findAll({
        attributes: ["id", "username", "email", "foto"],
      });

      res.status(200).json({ user });
    } catch (err) {
      res.status(400).json({ msg: "tidak ada data user" });
    }
  }

  async getById(req, res) {
    const id = req.params.id;
    try {
      const user = await User.findAll({
        where: {
          id,
        },
        attributes: ["username", "email", "foto"],
      });

      res.status(200).json({ user });
    } catch (err) {
      console.log({ err });
      res.status(400).json({ msg: "Tidak dapat menampilkan data user" });
    }
  }

  async login(req, res) {
    const { username, pass } = req.body;
    console.clear();
    console.log({ username, pass });
    try {
      const user = await User.findAll({
        where: {
          username,
        },
        attributes: ["id", "username", "email"],
      });

      const user1 = await User.findAll({
        where: {
          username,
        },
        attributes: ["pass"],
      });

      if (user[0] == undefined)
        return res.status(400).json({ msg: "Username tidak tersedia" });
      const confPass = await bcryptjs.compare(pass, user1[0].pass);
      if (!confPass) return res.status(400).json({ msg: "Password salah" });
      const userId = user[0].id;
      const email = user[0].email;
      const refreshToken = jwt.sign(
        { userId, username, email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "5m" },
      );

      await User.update({ token: refreshToken }, { where: { id: userId } });

      return res.status(200).json({ refreshToken, user });
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }

  async regiserFristAdmin(req, res) {
    const { username, pass, email } = req.body;
    try {
      const user = await User.findAll();
      if (user[0] !== undefined)
        return res.status(400).json({
          msg: "Akun admin sudah dibuat, hubungi admin jika ingin membuat akun",
        });

      const salt = await bcryptjs.genSalt();
      const bcryptOfPass = await bcryptjs.hash(pass, salt);
      await User.create({
        username,
        pass: bcryptOfPass,
        email,
        token: "",
        foto: "",
      });
      return res.status(200).json({ msg: "berhasil membuat akun admin" });
    } catch (err) {
      console.log({ err });
      return res.status(400).json({ msg: "err disisi server" });
    }
  }

  async register(req, res) {
    const { username, pass, email } = req.body;
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

      await User.create({
        username,
        pass: bcryptOfPass,
        email,
        token: "",
        foto: "",
      });
      return res.status(200).json({ msg: "User berhasil dibuat" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "err dari sisi server" });
    }
  }

  token(req, res) {
    try {
      const { token } = req.body;
      jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decode) => {
          if (err) return res.status(400).json({ msg: "Harap login dulu" });
          const userId = decode.userId;
          const username = decode.username;
          const email = decode.email;
          const user = await User.findAll({ where: { id: userId } });
          if (user[0] == undefined)
            return res
              .status(400)
              .json({ msg: "Token dengan user tidak cocok" });
          const accessToken = jwt.sign(
            { userId, username, email },
            process.env.ACCSESS_TOKEN_SECRET,
            { expiresIn: "20s" },
          );
          return res.status(200).json({ accessToken });
        },
      );
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "Harap login dulu" });
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
