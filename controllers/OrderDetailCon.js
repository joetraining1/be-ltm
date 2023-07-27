const { Sequelize } = require("sequelize");
const { sequelize } = require("../config/db");
const { CartDetail } = require("../models/CartDetails");
const { Cart } = require("../models/Carts");
const { Product } = require("../models/Products");
const { SumFunc } = require("../utils/ArraySum");
const { OrderDetail } = require("../models/OrderDetail");

exports.OrderDetailController = {
  async loopCreate(req, res) {},
  async loopCreateById(order_id, data) {
    const multiCreate = data.map(async function (item, index) {
      await OrderDetail.create({
        qty: item.qty,
        amount: item.amount,
        order_id: order_id,
        product_id: item.product_id,
      });
      return;
    });

    return { msg : "Datasets created successfully." };
  },

  async getAll(req, res) {
    const cd = await sequelize.query(
      "SELECT accounts.id, accounts.bank_name, accounts.norek, banks.url, users.name FROM `accounts` INNER join banks on accounts.bank_id = banks.id INNER JOIN users on accounts.user_id = users.id",
      { type: Sequelize.QueryTypes.SELECT }
    );

    res.send({
      msg: "Cart Detail Collected Succesfully",
      result: cd,
    });
  },

  async getAllbyId(req, res) {
    const cart = await Cart.findOne({
      where: {
        user_id: req.params?.user_id,
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
        result: cd,
      });
    } else {
      res.status(404).send({
        msg: "Cart not found.",
      });
    }
  },

  async getAllbyId(cart_id) {
    const cart = await Cart.findOne({
      where: {
        user_id: cart_id,
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
        result: cd,
      });
    } else {
      res.status(404).send({
        msg: "Cart not found.",
      });
    }
  },

  async create(req, res) {
    const extractPiD = await CartDetail.findOne({
      where: {
        product_id: req.body.product_id,
      },
    });
    console.log(extractPiD);
    if (extractPiD) {
      const newPqty = extractPiD.dataValues.qty + req.body.qty;
      const newPamount = extractPiD.dataValues.amount + req.body.amount;
      const cd = await CartDetail.update(
        {
          qty: newPqty,
          amount: newPamount,
        },
        {
          where: {
            product_id: req.body.product_id,
          },
        }
      );
      const takeRp = await sequelize.query(
        `SELECT SUM(amount) from cart_details WHERE cart_details.cart_id = ${req.body.cart_id}`,
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      );
      const takeQty = await sequelize.query(
        `SELECT SUM(qty) from cart_details WHERE cart_details.cart_id = ${req.body.cart_id}`,
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      );
      console.log(takeRp[0]);
      console.log(takeQty[0]);
      const newCalc = await Cart.update(
        {
          unit: Object.values(takeQty[0])[0],
          total: Object.values(takeRp[0])[0],
        },
        {
          where: {
            id: req.body.cart_id,
          },
        }
      );
    } else {
      const cd = await CartDetail.create({
        qty: req.body.qty,
        amount: req.body.amount,
        cart_id: req.body.cart_id,
        product_id: req.body.product_id,
      });
      const extractCount = await CartDetail.count({
        where: {
          cart_id: req.body.cart_id,
        },
      });
      const takeRp = await sequelize.query(
        `SELECT SUM(amount) from cart_details WHERE cart_details.cart_id = ${req.body.cart_id}`,
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      );
      const takeQty = await sequelize.query(
        `SELECT SUM(qty) from cart_details WHERE cart_details.cart_id = ${req.body.cart_id}`,
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      );
      console.log(takeRp[0]);
      console.log(takeQty[0]);
      console.log(extractCount);
      const newCalc = await Cart.update(
        {
          variant: extractCount,
          unit: Object.values(takeQty[0])[0],
          total: Object.values(takeRp[0])[0],
        },
        {
          where: {
            id: req.body.cart_id,
          },
        }
      );
    }

    res.send({
      msg: "Product added to cart.",
    });
  },

  async update(req, res) {
    const product = await Product.findByPk(req.body.product_id);
    const itemAmount = req.body.qty * product.price;
    const cartD = await CartDetail.update(
      {
        qty: req.body.qty,
        amount: itemAmount,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    const extractRp = await CartDetail.findAll({
      where: {
        cart_id: req.body.cart_id,
      },
      attributes: ["amount"],
    });
    const extractQty = await CartDetail.findAll({
      where: {
        cart_id: req.body.cart_id,
      },
      attributes: ["qty"],
    });
    const newRp = SumFunc(extractRp);
    const newQty = SumFunc(extractQty);
    const newCalc = await Cart.update(
      {},
      {
        where: {
          id: req.body.cart_id,
        },
      }
    );

    res.send({
      message: "Cart Detail updated successfully.",
    });
  },

  async delete(req, res) {
    const cd = await CartDetails.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.send({ message: "Product removed successfully." });
  },

  async get(req, res) {
    const ba = await BankAccount.findByPk(req.params.id);

    res.send({
      msg: "Bank Account found.",
      result: ba,
    });
  },
};
