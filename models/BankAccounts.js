const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db')

const BankAccount = sequelize.define("accounts", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  bank: DataTypes.STRING,
  norek: DataTypes.STRING,
});

exports.BankAccount = BankAccount