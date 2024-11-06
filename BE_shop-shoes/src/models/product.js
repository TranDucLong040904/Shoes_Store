"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasMany(models.Image, {
        foreignKey: "productId",
        as: "images",
      });
      Product.hasMany(models.Inventory, {
        as: "inventories",
        foreignKey: "productId",
      });
      Product.hasMany(models.OrderDetail, {
        foreignKey: "productId",
        as: "orderdetails",
      });
      Product.hasMany(models.Review, {
        foreignKey: "productId",
        as: "reviews",
      });
      // define association here
    }
  }
  Product.init(
    {
      productName: DataTypes.STRING,
      image: DataTypes.BLOB("long"),
      description: DataTypes.BLOB("long"),
      price: DataTypes.STRING,
      discount: DataTypes.STRING,
      supplier: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      // categoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
