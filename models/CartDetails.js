const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db')

const CartDetail = sequelize.define("cart_detail", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  qty: DataTypes.INTEGER,
  amount: DataTypes.INTEGER,
});

exports.CartDetail = CartDetail