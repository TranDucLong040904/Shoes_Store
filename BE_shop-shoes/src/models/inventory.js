"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Inventory.belongsTo(models.Product, { foreignKey: "productId" });
      // define association here
    }
  }
  Inventory.init(
    {
      productId: DataTypes.INTEGER,
      sizeId: DataTypes.INTEGER,
      quantityInStock: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Inventory",
    }
  );
  return Inventory;
};
