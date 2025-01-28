'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RawMaterial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RawMaterial.hasMany(models.Recipe, {
        foreignKey: 'rawMaterialId',
        as: 'recipes',
      });
    }
  }
  RawMaterial.init({
    name: DataTypes.STRING,
    unit: DataTypes.STRING,
    stock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RawMaterial',
  });
  return RawMaterial;
};