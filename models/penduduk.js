'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class penduduk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  penduduk.init({
    name: DataTypes.STRING,
    no_kk: DataTypes.STRING,
    no_induk: DataTypes.STRING,
    nama_ibu: DataTypes.STRING,
    jk: DataTypes.STRING,
    foto: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'penduduk',
  });
  return penduduk;
};