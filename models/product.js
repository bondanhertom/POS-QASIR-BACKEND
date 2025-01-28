"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relasi Product dengan Category (many-to-one)
      Product.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });

      // Relasi Product dengan Reciepe (one-to-many)
      Product.hasMany(models.Recipe, {
        foreignKey: "productId",
        as: "recipes",
      });

      // Relasi Product dengan PendingOrderItems (one-to-many)
      Product.hasMany(models.PendingOrderItem, {
        foreignKey: "productId",
        as: "pendingOrderItems",
      });
    }
  }
  Product.init(
    {
      name: {
        type : DataTypes.STRING,
        allowNull:false,
      },
      price:{
        type : DataTypes.FLOAT,
        allowNull:false,
      },
      costPrice: DataTypes.FLOAT,
      categoryId: {
        type : DataTypes.INTEGER,
        allowNull:false,
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
