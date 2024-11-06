"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.hasMany(models.OrderDetail, {
        foreignKey: "orderId",
        as: "orderDetail",
      });
    }
  }
  Order.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      addressDetail: DataTypes.STRING,
      note: DataTypes.STRING,
      totalMoney: DataTypes.STRING,
      paymentType: DataTypes.STRING,
      deliveryType: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      province: DataTypes.STRING,
      district: DataTypes.STRING,
      ward: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
