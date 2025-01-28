"use strict";
const { hashPassword } = require("../helpers/bcrypt");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.PendingOrder, {
        foreignKey: "userId",
        as: "pendingOrders",
      });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Email already in use",
        },
        validate: {
          notNull: {
            msg: "Email can not be null",
          },
          notEmpty: {
            msg: "Email can not be empty",
          },
          isEmail: {
            msg: "Email format is invalid",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password can not be null",
          },
          notEmpty: {
            msg: "Password can not be empty",
          },
          len: {
            args: [8],
            msg: "Password must be at least 8 characters long",
          },
          // is: {
          //   args: /^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
          //   msg: "Password must contain at least one uppercase letter and one special character (!@#$%^&*)",
          // },
        },
      },
      role: {
        type: DataTypes.ENUM("employee", "owner"),
        allowNull: false,
        defaultValue: "employee",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.beforeCreate(async (user, options) => {
    const existingUser = await User.findOne({ where: { email: user.email } });
    if (existingUser) {
      throw { name: "Email already registered" };
    }
    user.password = hashPassword(user.password);
  });
  return User;
};
