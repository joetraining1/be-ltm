const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db');
const { Order } = require("./Orders");

const BankAccount = sequelize.define("accounts", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  bank_name: DataTypes.STRING,
  norek: DataTypes.STRING,
});

BankAccount.hasMany(Order, {
  foreignKey: {
      name: 'account_id'
  }
})
Order.belongsTo(BankAccount, {
  foreignKey: {
    name: 'account_id'
  }
})

exports.BankAccount = BankAccount