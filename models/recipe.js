"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //relasi ke product many to one
      Recipe.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });

      // Relasi ke Raw Material many to one
      Recipe.belongsTo(models.RawMaterial, {
        foreignKey: "rawMaterialId",
        as: "rawMaterial",
      });
    }
  }
  Recipe.init(
    {
      productId:{
        type : DataTypes.INTEGER,
        allowNull:false,
      },
      rawMaterialId:{
        type : DataTypes.INTEGER,
        allowNull:false,
      },
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Recipe",
    }
  );
  return Recipe;
};
