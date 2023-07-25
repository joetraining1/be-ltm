const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db')

const Payment = sequelize.define("payments", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
});

exports.Payment = Payment