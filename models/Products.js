const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db')

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

exports.Product = Product