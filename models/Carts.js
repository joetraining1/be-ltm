const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db')

const Cart = sequelize.define("carts", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  variant: DataTypes.INTEGER,
  unit: DataTypes.INTEGER,
  total: DataTypes.INTEGER,
});

exports.Cart = Cart