const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db')

const OrderDetail = sequelize.define("order_detail", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  qty: DataTypes.INTEGER,
  amount: DataTypes.INTEGER,
});

exports.OrderDetail = OrderDetail