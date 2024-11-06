"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Image.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
      // define association here
    }
  }
  Image.init(
    {
      productId: DataTypes.INTEGER,
      image: DataTypes.BLOB("long"),
    },
    {
      sequelize,
      modelName: "Image",
    }
  );
  return Image;
};
