const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db')

const Bank = sequelize.define("banks", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  title: DataTypes.STRING,
  acronim: DataTypes.STRING,
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true
  },
});

exports.Bank = Bank