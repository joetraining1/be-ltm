const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db');
const { BankAccount } = require("./BankAccounts");

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

Bank.hasMany(BankAccount, {
  foreignKey: {
      name: 'bank_id'
  }
})

exports.Bank = Bank