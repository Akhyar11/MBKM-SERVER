"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {
      username: DataTypes.STRING,
      pass: DataTypes.STRING,
      is_admin: DataTypes.TINYINT,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
