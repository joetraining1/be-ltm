const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db');
const { Order } = require("./Orders");

const Status = sequelize.define("statuses", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
});

Status.hasMany(Order, {
  foreignKey: {
      name: 'status_id'
  }
})

exports.Status = Status