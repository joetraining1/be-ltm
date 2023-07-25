const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db');
const { User } = require("./Users");
const { CartDetail } = require("./CartDetails");

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

Cart.hasMany(CartDetail, {
  foreignKey: {
      name: 'cart_id'
  },
  onDelete: 'CASCADE'
})

exports.Cart = Cart