"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    static associate(models) {
      // store belongs to an owner(user)
      Store.belongsTo(models.User, { foreignKey: "ownerId", as: "owner" });

      // store can have many ratings
      Store.hasMany(models.Rating, { foreignKey: "storeId", as: "ratings" });
    }
  }
  Store.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: DataTypes.STRING,
      address: DataTypes.STRING(400),
      ownerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Store",
    }
  );
  return Store;
};
