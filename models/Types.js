const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db');
const { User } = require("./Users");

const Types = sequelize.define("types", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
});

Types.hasMany(User, {
  foreignKey: {
    name: 'type_id'
  }
})

User.belongsTo(Types, {
  foreignKey: {
    name: 'type_id'
  }
})


module.exports = Types