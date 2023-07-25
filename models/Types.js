const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db');
const { User } = require("./Users");

const Type = sequelize.define("types", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
});

Type.hasMany(User, {
  foreignKey: {
    name: 'type_id'
  }
})


module.exports = Type