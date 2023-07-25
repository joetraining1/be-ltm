const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db')

const Status = sequelize.define("statuses", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
});

exports.Status = Status