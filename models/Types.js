const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db')

const Type = sequelize.define("types", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
});

exports.Type = Type