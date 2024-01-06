'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pengurus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pengurus.init({
    nama: DataTypes.STRING,
    jabatan: DataTypes.STRING,
    email: DataTypes.STRING,
    foto: DataTypes.STRING,
    tanggal_lahir: DataTypes.DATE,
    jk: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pengurus',
  });
  return Pengurus;
};