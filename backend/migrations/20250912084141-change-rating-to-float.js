module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Ratings", "rating", {
      type: Sequelize.FLOAT,
      allowNull: false,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Ratings", "rating", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
