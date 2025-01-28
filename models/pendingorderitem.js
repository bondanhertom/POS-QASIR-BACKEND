"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PendingOrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Relasi PendingOrderItem dengan Product (many-to-one)
      PendingOrderItem.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });

      // Relasi PendingOrderItem dengan PendingOrder (many-to-one)
      PendingOrderItem.belongsTo(models.PendingOrder, {
        foreignKey: "pendingOrderId",
        as: "pendingOrder",
      });
    }
  }
  PendingOrderItem.init(
    {
      pendingOrderId:{
        type : DataTypes.INTEGER,
        allowNull:false,
      },
      productId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      manualMenuName: DataTypes.STRING,
      manualMenuPrice: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "PendingOrderItem",
    }
  );
  return PendingOrderItem;
};
