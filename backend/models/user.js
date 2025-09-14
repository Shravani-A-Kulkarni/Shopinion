"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      //User can own may stores
      User.hasMany(models.Store, { foreignKey: "ownerId", as: "stores" });
      //user can have many ratings
      User.hasMany(models.Rating, { foreignKey: "userId", as: "ratings" });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(400),
      },
      role: {
        type: DataTypes.ENUM("admin", "user", "owner"),
        defaultValue: "user",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
