const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db');
const { Product } = require("./Products");

const Categories = sequelize.define("categories", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
});

Categories.hasMany(Product, {
  foreignKey: {
      name: 'ctg_id',
  },
});

Product.belongsTo(Categories, {
  foreignKey: {
    name: 'ctg_id'
  }
})

exports.Categories = Categories