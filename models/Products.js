const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db');
const { CartDetail } = require("./CartDetails");
const { OrderDetail } = require("./OrderDetail");

const Product = sequelize.define("products", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true
  },
});

Product.hasMany(CartDetail, {
  foreignKey: {
    name: 'product_id'
  }
})
Product.hasMany(OrderDetail, {
  foreignKey: {
    name: 'product_id'
  }
})

exports.Product = Product