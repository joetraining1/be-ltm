const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db');
const { OrderDetail } = require("./OrderDetail");

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
  variant: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  unit: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  shipping: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  ship_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ship: {
    type: DataTypes.STRING,
    allowNull: true
  },
  proof_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  proof: {
    type: DataTypes.STRING,
    allowNull: true
  },
});

Order.hasMany(OrderDetail, {
  foreignKey: {
      name: 'order_id'
  },
})

exports.Order = Order;