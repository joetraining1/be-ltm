const { DataTypes } = require("sequelize");

const { sequelize } = require('../config/db');
const { BankAccount } = require("./BankAccounts");
const { Cart } = require("./Carts");
const { Order } = require("./Orders");

const User = sequelize.define("users", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  name: DataTypes.STRING,
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  alamat: {
    type: DataTypes.STRING,
    allowNull: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: DataTypes.STRING,
  password: DataTypes.STRING,
});

User.hasMany(BankAccount, {
  foreignKey: {
      name: 'user_id'
  },
})
User.hasOne(Cart, {
  foreignKey: {
      name: 'user_id'
  },
  onDelete: 'CASCADE'
})
User.hasMany(Order, {
  foreignKey: {
      name: 'user_id'
  },
  onDelete: 'CASCADE'
})

Cart.belongsTo(User, {
  foreignKey: {
    name: 'user_id'
},
})
Order.belongsTo(User, {
  foreignKey: {
      name: 'user_id'
  },
})
BankAccount.belongsTo(User, {
  foreignKey: {
      name: 'user_id'
  },
})
exports.User = User;