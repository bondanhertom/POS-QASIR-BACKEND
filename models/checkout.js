'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Checkout extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Relasi Checkout dengan PendingOrder (many-to-one)
      Checkout.belongsTo(models.PendingOrder, {
        foreignKey: 'pendingOrderId',
        as: 'pendingOrder'
      });
    }
  }
  Checkout.init({
    pendingOrderId: {
      type : DataTypes.INTEGER,
      allowNull:false,
    },
    totalAmount: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Checkout',
  });
  return Checkout;
};