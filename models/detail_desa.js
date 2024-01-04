'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detail_desa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  detail_desa.init({
    name: DataTypes.STRING,
    alamat: DataTypes.STRING,
    provensi: DataTypes.STRING,
    kota: DataTypes.STRING,
    kode_pos: DataTypes.STRING,
    foto: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'detail_desa',
  });
  return detail_desa;
};