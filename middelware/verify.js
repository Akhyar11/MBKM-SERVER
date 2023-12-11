const jwt = require("jsonwebtoken");
const user = require("../models/user.js");
const { DataTypes } = require("sequelize");
const db = require("../utils/db.js");

const User = user(db, DataTypes);

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(400).json({
      msg: "Tidak ada akses token, tolong gunakan authorization token",
    });

  try {
    jwt.verify(token, process.env.ACCSESS_TOKEN_SECRET, async (err, decode) => {
      if (err) return res.status(200).json({ msg: "Harap login dulu" });
      const userId = decode.userId;
      const username = decode.username;
      const admin = decode.admin;
      const user = await User.findAll({
        where: { id: userId, username, is_admin: admin },
      });
      if (user[0] == undefined)
        return res.status(400).json({ msg: "Token dengan user tidak cocok" });
      next();
    });
  } catch (err) {
    console.log(err);
    res.status(400);
  }
};

module.exports = verifyToken;
