const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db')

const User = sequelize.define("users", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  name: DataTypes.STRING,
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  alamat: {
    type: DataTypes.STRING,
    allowNull: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: DataTypes.STRING,
  password: DataTypes.STRING,
});

exports.User = User;