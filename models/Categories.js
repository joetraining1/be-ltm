const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db')

const Categories = sequelize.define("categories", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
});

exports.Categories = Categories