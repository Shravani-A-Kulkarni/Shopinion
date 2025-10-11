"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Ratings", "reviewText", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("Ratings", "sentimentLabel", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Ratings", "sentimentScore", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Ratings", "reviewText");
    await queryInterface.removeColumn("Ratings", "sentimentLabel");
    await queryInterface.removeColumn("Ratings", "sentimentScore");
  },
};
