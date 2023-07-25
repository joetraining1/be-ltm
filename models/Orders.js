const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db')

const Order = sequelize.define("orders", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  name: DataTypes.STRING,
  cp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  variant: DataTypes.INTEGER,
  unit: DataTypes.INTEGER,
  amount: DataTypes.INTEGER,
  shipping: DataTypes.STRING,
  total: DataTypes.INTEGER,
  shipment: {
    type: DataTypes.STRING,
    allowNull: true
  },
  proof: {
    type: DataTypes.STRING,
    allowNull: true
  },
});

exports.Order = Order;