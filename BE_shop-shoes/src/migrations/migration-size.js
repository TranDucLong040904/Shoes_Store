"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Sizes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sizeShoes: {
        type: Sequelize.INTEGER,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.bulkInsert("Sizes", [
      { sizeShoes: 36, createdAt: new Date(), updatedAt: new Date() },
      { sizeShoes: 37, createdAt: new Date(), updatedAt: new Date() },
      { sizeShoes: 38, createdAt: new Date(), updatedAt: new Date() },
      { sizeShoes: 39, createdAt: new Date(), updatedAt: new Date() },
      { sizeShoes: 40, createdAt: new Date(), updatedAt: new Date() },
      { sizeShoes: 41, createdAt: new Date(), updatedAt: new Date() },
      { sizeShoes: 42, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Sizes");
  },
};
