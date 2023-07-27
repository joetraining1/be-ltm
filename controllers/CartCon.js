const { Sequelize } = require("sequelize");
const { sequelize } = require("../config/db");
const { CartDetail } = require("../models/CartDetails");
const { Cart } = require("../models/Carts");

exports.CartController = {
  // get all record of cart
  async getAll(req, res) {
    const Qprop = `SELECT carts.id, carts.variant, carts.unit, carts.total, users.name, users.email, users.url `;
    const Qrelate = "FROM carts INNER JOIN users on carts.user_id = users.id";

    const cd = await sequelize.query(Qprop.concat(Qrelate), {
      type: Sequelize.QueryTypes.SELECT,
    });

    res.send({
      msg: "Carts Collected Succesfully",
      result: cd,
    });
  },

  // get all record of cart based on cart id using user_id
  async getAllbyUser(req, res) {
    const cart = await Cart.findOne({
      where: {
        user_id: req.params?.user_id,
      },
    });
    if (cart) {
      const Qprop = `SELECT cart_details.id, cart_details.qty, cart_details.amount, products.url, products.price, products.title as "nama_produk", categories.title as "kategori" `;
      const Qrelate =
        "FROM cart_details INNER JOIN products on cart_details.product_id = products.id LEFT OUTER JOIN categories on products.ctg_id = categories.id ";
      const Qparam = `WHERE cart_details.cart_id = ${cart?.id}`;
      const cd = await sequelize.query(Qprop.concat(Qrelate).concat(Qparam), {
        type: Sequelize.QueryTypes.SELECT,
      });

      res.send({
        msg: "Cart Detail Collected Succesfully",
        result: {
          metadata: cart,
          dataset: cd
        }
      });
    } else {
      res.status(404).send({
        msg: "Cart not found.",
      });
    }
  },

  async getAllbyId(req, res) {
    const cart = await Cart.findOne({
      where: {
        user_id: req.params?.id,
      },
    });
    if (cart) {
      const Qprop = `SELECT cart_details.id, cart_details.qty, cart_details.amount, products.url, products.price, products.title as "nama_produk", categories.title as "kategori" `;
      const Qrelate =
        "FROM cart_details INNER JOIN products on cart_details.product_id = products.id INNER join categories on products.ctg_id = categories.id ";
      const Qparam = `WHERE cart_details.cart_id = ${cart?.id}`;
      const cd = await sequelize.query(Qprop.concat(Qrelate).concat(Qparam), {
        type: Sequelize.QueryTypes.SELECT,
      });

      res.send({
        msg: "Cart Detail Collected Succesfully",
        result: {
          metadata: cart,
          dataset: cd
        }
      });
    } else {
      res.status(404).send({
        msg: "Cart not found.",
      });
    }
  },

  async create(req, res) {
    const cart = await Cart.create({
      variant: req?.body?.variant,
      unit: req.body?.unit,
      total: req.body?.total,
      user_id: req.body?.user_id,
    });

    res.send({
      msg: "Bank Account added.",
      result: ba,
    });
  },

  async createByUser(user_id) {
    const cart = await Cart.create({
      variant: null,
      unit: null,
      total: null,
      user_id: user_id,
    });
    return;
  },

  async deleteByUser(user_id) {
    const cart = await Cart.destroy({
      where: {
        user_id: user_id,
      },
    });
  },

  async updateByUser(payload, user_id) {
    const findCart = await Cart.findOne({
      where: {
        user_id: user_id,
      },
    });
    if (findCart) {
      const cart = await Cart.update(payload, {
        where: {
          user_id: user_id,
        },
      });
      return;
    } else {
      return;
    }
  },

  async update(req, res) {
    const ba = await BankAccount.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    res.send({
      message: "Bank Account updated successfully.",
    });
  },

  async delete(req, res) {
    const ba = await BankAccount.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.send({ message: "Bank Account deleted successfully" });
  },

  async get(req, res) {
    const ba = await BankAccount.findByPk(req.params.id);

    res.send({
      msg: "Bank Account found.",
      result: ba,
    });
  },
};
