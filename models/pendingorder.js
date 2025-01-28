"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PendingOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Relasi PendingOrder dengan User (many-to-one)
      PendingOrder.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      // Relasi PendingOrder dengan PendingOrderItems (one-to-many)
      PendingOrder.hasMany(models.PendingOrderItem, {
        foreignKey: "pendingOrderId",
        as: "item",
      });

      // Relasi PendingOrder ke Checkout (one-to-one)
      PendingOrder.hasOne(models.Checkout, {
        foreignKey: "pendingOrderId",
        as: "checkout",
      });
    }
  }
  PendingOrder.init(
    {
      customerName: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "success"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "PendingOrder",
    }
  );
  return PendingOrder;
};
