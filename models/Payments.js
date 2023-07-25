const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db');
const { Order } = require("./Orders");

const Payment = sequelize.define("payments", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
});

Payment.hasMany(Order, {
  foreignKey: {
      name: 'payment_id'
  }
})

exports.Payment = Payment