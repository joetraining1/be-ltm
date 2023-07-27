const { DataTypes } = require("sequelize");

const { sequelize } = require("../config/db");
const { CartDetail } = require("./CartDetails");

const Cart = sequelize.define("carts", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  variant: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  unit: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Cart.hasMany(CartDetail, {
  foreignKey: {
    name: "cart_id",
  },
  onDelete: "CASCADE",
});
CartDetail.belongsTo(Cart, {
  foreignKey: {
    name: 'cart_id'
  }
})

exports.Cart = Cart;
