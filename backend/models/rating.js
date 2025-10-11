"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
      Rating.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Rating.belongsTo(models.Store, { foreignKey: "storeId", as: "store" });
    }
  }
  Rating.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      storeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
      reviewText: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sentimentLabel: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sentimentScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Rating",
    }
  );
  return Rating;
};
