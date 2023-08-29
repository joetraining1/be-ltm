const { Sequelize, json } = require("sequelize");
const { sequelize } = require("../config/db");
const { OrderDetail } = require("../models/OrderDetail");
const { Order } = require("../models/Orders");
const path = require("path");
const fs = require("fs");
const { Cart } = require("../models/Carts");
const { ImageHandler } = require("../utils/ImageHandler");
const { OrderDetailController } = require("./OrderDetailCon");
const { User } = require("../models/Users");
const { CartDetail } = require("../models/CartDetails");
const { Product } = require("../models/Products");

exports.OrderController = {
  // admin display data
  async getAll(req, res) {
    const Qprop = `SELECT orders.id, orders.total, orders.createdAt, payments.title as "pembayaran", statuses.title as "status", users.name, users.email, users.url `;
    const Qrelate =
      "FROM orders INNER JOIN users on orders.user_id = users.id INNER JOIN payments on orders.payment_id = payments.id INNER JOIN statuses on orders.status_id = statuses.id ORDER BY orders.id DESC";

    const order = await sequelize.query(Qprop.concat(Qrelate), {
      type: Sequelize.QueryTypes.SELECT,
    });

    res.send({
      msg: "Orders Collected Succesfully",
      result: order,
    });
  },

  async getAllByStatusId(req, res) {
    const Qprop = `SELECT orders.id, orders.total, orders.createdAt, payments.title as "pembayaran", statuses.title as "status", users.name, users.email, users.url `;
    const Qrelate = `FROM orders INNER JOIN users on orders.user_id = users.id INNER JOIN payments on orders.payment_id = payments.id INNER JOIN statuses on orders.status_id = statuses.id WHERE orders.status_id = ${req.params.id}`;

    const order = await sequelize.query(Qprop.concat(Qrelate), {
      type: Sequelize.QueryTypes.SELECT,
    });

    res.send({
      msg: "Orders Collected Succesfully",
      result: order,
    });
  },
  async getAllByUserNstat(req, res) {
    console.log(req.body, "here payload");
    const Qprop = `SELECT orders.id, orders.total, orders.createdAt, payments.title as "pembayaran", statuses.title as "status", users.name, users.email, users.url `;
    const Qrelate = `FROM orders INNER JOIN users on orders.user_id = users.id INNER JOIN payments on orders.payment_id = payments.id INNER JOIN statuses on orders.status_id = statuses.id WHERE orders.status_id = ${req.body.status_id} AND orders.user_id = ${req.params.user_id}`;

    const order = await sequelize.query(Qprop.concat(Qrelate), {
      type: Sequelize.QueryTypes.SELECT,
    });

    res.send({
      msg: "Orders Collected Succesfully",
      result: order,
    });
  },

  //try loop create

  async loopingCreate(req, res) {
    const Qprop = `SELECT cart_details.qty, cart_details.amount, cart_details.product_id, products.title as "produk", products.price `;
    const Qrelate = `FROM cart_details INNER JOIN products on cart_details.product_id = products.id `;
    const Qclause = `WHERE cart_details.cart_id = ${req.params.id}`;
    const cartData = await sequelize.query(
      Qprop.concat(Qrelate).concat(Qclause),
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const loops = await OrderDetailController.loopCreateById(
      req.body.order_id,
      cartData
    ).then((response) => {
      return response;
    });
    console.log(loops);
    res.status(200).send(loops);
  },

  async getById(req, res) {
    const Qprop = `SELECT orders.id, orders.name as "penerima", orders.variant, orders.unit, orders.amount, orders.cp, orders.address, orders.shipping, orders.total, orders.ship_url, orders.proof_url, orders.createdAt, orders.note, `;
    const Qassoc = `payments.title as "pembayaran", accounts.bank_name as "bank", accounts.norek, statuses.title as "status", statuses.id as "sId", users.name, users.url, users.email `;
    const Qrelate = `FROM orders INNER JOIN accounts on orders.account_id = accounts.id INNER JOIN payments on orders.payment_id = payments.id INNER JOIN statuses on orders.status_id = statuses.id INNER JOIN users on orders.user_id = users.id `;
    const Qclause = `WHERE orders.id = ${req.params.id}`;

    const order = await sequelize.query(
      Qprop.concat(Qassoc).concat(Qrelate).concat(Qclause),
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    res.send({
      msg: "Orders Collected Succesfully",
      result: order[0],
    });
  },

  // quick look display data
  async getQuick(req, res) {
    const findOrder = await Order.findByPk(req.params.id);
    if (findOrder) {
      const Qprop = `SELECT orders.id, orders.name as "penerima", orders.variant, orders.unit, orders.amount, orders.cp, orders.address, orders.shipping, orders.total, orders.ship_url, orders.proof_url, orders.createdAt, orders.note, `;
      const Qassoc = `payments.title as "pembayaran", accounts.bank_name as "bank", accounts.norek, statuses.title as "status", users.name, users.url, users.email `;
      const Qrelate = `FROM orders INNER JOIN accounts on orders.account_id = accounts.id INNER JOIN payments on orders.payment_id = payments.id INNER JOIN statuses on orders.status_id = statuses.id INNER JOIN users on orders.user_id = users.id `;
      const Qclause = `WHERE orders.id = ${req.params.id}`;

      const Dprop = `SELECT order_details.qty, order_details.amount, products.title as "produk", products.price `;
      const Drelate = `FROM order_details INNER JOIN products on order_details.product_id = products.id `;
      const Dclause = `WHERE order_details.order_id = ${req.params.id}`;

      const order = await sequelize.query(
        Qprop.concat(Qassoc).concat(Qrelate).concat(Qclause),
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      const dataset = await sequelize.query(
        Dprop.concat(Drelate).concat(Dclause),
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      res.send({
        msg: "Orders Collected Succesfully",
        result: {
          metadata: order[0],
          items: dataset,
        },
      });
    } else {
      res.status(404).send({
        msg: "Order not found.",
      });
    }
  },

  // invoice display data
  async getInvoice(req, res) {
    const findOrder = await Order.findByPk(req.params.order_id);
    if (findOrder) {
      const Qprop = `SELECT orders.id, orders.variant, orders.unit, orders.amount, orders.shipping, orders.total, orders.createdAt, orders.cp, orders.address, orders.name as "penerima", orders.ship_url, orders.proof_url, orders.note, `;
      const Qassoc = `payments.title as "pembayaran", accounts.bank_name as "bank", accounts.norek, statuses.title as "status", statuses.description as "info", users.name, users.url, users.email `;
      const Qrelate = `FROM orders INNER JOIN accounts on orders.account_id = accounts.id INNER JOIN payments on orders.payment_id = payments.id INNER JOIN statuses on orders.status_id = statuses.id INNER JOIN users on orders.user_id = users.id `;
      const Qclause = `WHERE orders.id = ${req.params.order_id}`;

      const Dprop = `SELECT order_details.qty, order_details.amount, products.title as "produk", products.price, products.url, categories.title as "kategori" `;
      const Drelate = `FROM order_details INNER JOIN products on order_details.product_id = products.id INNER JOIN categories on products.ctg_id = categories.id `;
      const Dclause = `WHERE order_details.order_id = ${req.params.order_id}`;

      const order = await sequelize.query(
        Qprop.concat(Qassoc).concat(Qrelate).concat(Qclause),
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      const dataset = await sequelize.query(
        Dprop.concat(Drelate).concat(Dclause),
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      res.send({
        msg: "Orders Collected Succesfully",
        result: {
          metadata: order[0],
          items: dataset,
        },
      });
    } else {
      res.status(404).send({
        msg: "Order not found.",
      });
    }
  },

  // user display data
  async getAllbyId(req, res) {
    const Qprop = `SELECT orders.id, orders.unit, orders.total, orders.cp, statuses.title as "status", orders.createdAt `;
    const Qrelate =
      "FROM orders INNER JOIN statuses on orders.status_id = statuses.id ";
    const Qparam = `WHERE orders.user_id = ${req.params.user_id}`;
    const ol = await sequelize.query(Qprop.concat(Qrelate).concat(Qparam), {
      type: Sequelize.QueryTypes.SELECT,
    });

    res.send({
      msg: "displaying order by user.",
      result: ol,
    });
  },

  // new order, admin
  async create(req, res) {
    let imagesHolder = {};
    if (req?.files?.ship || req?.files?.proof) {
      if (req?.files?.ship) {
        const file = req.files.ship;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const url = `${req.protocol}://${req.get("host")}/all/${fileName}`;
        const allowedType = [".png", ".jpg", ".jpeg"];

        if (!allowedType.includes(ext.toLowerCase()))
          return res.status(422).json({ msg: "Invalid image extension." });
        if (fileSize > 2000000)
          return res.status(422).json({ msg: "Image must be less than 2 MB" });

        file.mv(`./public/all/${fileName}`, async (err) => {
          if (err) return res.status(500).json({ msg: err.message });
        });
        imagesHolder = { ...imagesHolder, ship: fileName, ship_url: url };
      }
      if (req?.files?.proof) {
        const file = req.files.proof;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const url = `${req.protocol}://${req.get("host")}/all/${fileName}`;
        const allowedType = [".png", ".jpg", ".jpeg"];

        if (!allowedType.includes(ext.toLowerCase()))
          return res.status(422).json({ msg: "Invalid image extension." });
        if (fileSize > 2000000)
          return res.status(422).json({ msg: "Image must be less than 2 MB" });

        file.mv(`./public/all/${fileName}`, async (err) => {
          if (err) return res.status(500).json({ msg: err.message });
        });

        imagesHolder = { ...imagesHolder, proof: fileName, proof_url: url };
      }
    }

    if (req.body.dataset && req.body.metadata) {
      const decodeData = JSON.parse(req.body.dataset);
      const decodeMeta = JSON.parse(req.body.metadata);

      const order = await Order.create({
        ...decodeMeta,
        ship_url: req?.files?.ship ? imagesHolder?.ship_url : null,
        ship: req?.files?.ship ? imagesHolder?.ship : null,
        proof_url: req?.files?.proof ? imagesHolder?.proof_url : null,
        proof: req?.files?.proof ? imagesHolder?.proof : null,
      });

      for (const elet of decodeData) {
        console.log(elet, "here the dataset");
        console.log(order.id, "here the dataset");
        const product = await OrderDetail.create({
          qty: elet.qty,
          amount: elet.amount,
          order_id: order.id,
          product_id: elet.product_id,
        });
        console.log(product, "this is created data");
      }

      res.send({
        msg: "Order added.",
        result: order,
      });
    } else {
      const order = await Order.create({
        ...req.body,
        ship_url: req?.files?.ship ? imagesHolder?.ship_url : null,
        ship: req?.files?.ship ? imagesHolder?.ship : null,
        proof_url: req?.files?.proof ? imagesHolder?.proof_url : null,
        proof: req?.files?.proof ? imagesHolder?.proof : null,
      });
      res.send({
        msg: "Order added.",
        result: order,
      });
    }
  },

  // new order, user step 1
  // body (user_id, cart_id)
  async checkout(req, res) {
    // extract cart items using cart id
    const Qprop = `SELECT cart_details.qty, cart_details.amount, cart_details.product_id, products.title as "produk", products.price `;
    const Qrelate = `FROM cart_details INNER JOIN products on cart_details.product_id = products.id `;
    const Qclause = `WHERE cart_details.cart_id = ${req.body.cart_id}`;
    const cartData = await sequelize.query(
      Qprop.concat(Qrelate).concat(Qclause),
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const cartProp = await Cart.findOne({
      where: {
        id: req.body.cart_id,
      },
    });

    // bikin order baru dan ambil id
    const order = await Order.create({
      variant: cartProp?.dataValues?.variant,
      unit: cartProp?.dataValues?.unit,
      amount: cartProp?.dataValues?.total,
      user_id: req.body.user_id,
      status_id: 1,
    });

    // kalkulasi stock
    const prodIds = cartData.map((item) => {
      return {
        id: item.product_id,
        qty: item.qty,
      };
    });

    for (const ele of prodIds) {
      const product = await Product.findByPk(ele.id);
      const newQty = product.dataValues.stock - ele.qty;
      const upStock = await Product.update(
        {
          stock: newQty,
        },
        {
          where: {
            id: ele.id,
          },
        }
      );
    }

    // migrasi ke item order
    const multiCreate = cartData.map(async function (item, index) {
      await OrderDetail.create({
        qty: item.qty,
        amount: item.amount,
        order_id: order.id,
        product_id: item.product_id,
      });
      return;
    });

    // clearing cart details
    const cart = await Cart.update(
      {
        variant: null,
        unit: null,
        total: null,
      },
      {
        where: {
          user_id: req.body.user_id,
        },
      }
    );
    const clearCart = await CartDetail.destroy({
      where: {
        cart_id: req.body.cart_id,
      },
    });

    res.status(200).send({
      msg: "Pesanan berhasil ditambahkan.",
      result: {
        order_id: order.id,
      },
    });
  },

  // send data to payment form
  async paymentForm(req, res) {
    const order = await Order.findByPk(req.params.id);

    const Dprop = `SELECT order_details.qty, order_details.amount, products.title as "produk", products.price, products.url, categories.title as "kategori" `;
    const Drelate = `FROM order_details INNER JOIN products on order_details.product_id = products.id INNER JOIN categories on products.ctg_id = categories.id `;
    const Dclause = `WHERE order_details.order_id = ${req.params.id}`;

    const dataset = await sequelize.query(
      Dprop.concat(Drelate).concat(Dclause),
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (order) {
      return res.status(200).send({
        msg: "Order found.",
        metadata: {
          id: order.id,
          variant: order.variant,
          unit: order.unit,
          amount: order.amount,
        },
        dataset: dataset,
      });
    } else {
      return res.status(404).send({
        msg: "Order not found.",
      });
    }
  },

  async getCompletion(req, res) {
    const LastOrder = await sequelize.query(
      `SELECT orders.id, orders.variant, orders.unit, orders.amount FROM orders WHERE orders.user_id = ${req.params.user_id} AND orders.cp IS NULL ORDER BY orders.id DESC LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (LastOrder.length !== 0) {
      const Dprop = `SELECT order_details.qty, order_details.amount, products.title as "produk", products.price, products.url, categories.title as "kategori" `;
      const Drelate = `FROM order_details INNER JOIN products on order_details.product_id = products.id INNER JOIN categories on products.ctg_id = categories.id `;
      const Dclause = `WHERE order_details.order_id = ${LastOrder[0].id}`;

      const OrderData = await sequelize
        .query(Dprop.concat(Drelate).concat(Dclause), {
          type: Sequelize.QueryTypes.SELECT,
        })
        .catch((error) => {
          console.log(error);
          return;
        });

      res.status(200).send({
        msg: "OK",
        metadata: LastOrder[0],
        dataset: OrderData,
      });
    }

    return LastOrder;
  },

  // new order, user step 2
  async completion(req, res) {
    let fileImage;
    if (req?.files?.image) {
      const file = req.files.image;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const fileName = file.md5 + ext;
      const url = `${req.protocol}://${req.get("host")}/all/${fileName}`;
      const allowedType = [".png", ".jpg", ".jpeg"];

      if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: "Invalid image extension." });
      if (fileSize > 2000000)
        return res.status(422).json({ msg: "Image must be less than 2 MB" });

      file.mv(`./public/all/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });

      fileImage = {
        image: fileName,
        url: url,
      };
    }
    const order = await Order.update(
      {
        name: req.body.name,
        cp: req.body.cp,
        address: req.body.address,
        proof_url: req?.files?.image ? fileImage.url : null,
        proof: req?.files?.image ? fileImage.image : null,
        payment_id: req.body.payment_id,
        account_id: req.body.account_id,
        status_id: req.body.status_id,
      },
      {
        where: {
          id: req.params.order_id,
        },
      }
    );

    res.status(200).send({
      msg: "Informasi berhasil ditambahkan.",
    });
  },

  // update order, user or admin
  // parameter order id, body (user id, ship, proof, status || note, shipping)

  async update(req, res) {
    const findOrder = await Order.findByPk(req.params.id);
    if (findOrder) {
      let imagesHolder;
      let shipPrice;
      if (req.body.shipping) {
        shipPrice = parseInt(req.body.shipping);
      }
      if (req?.files?.ship || req?.files?.proof) {
        if (req?.files?.ship) {
          const file = req.files.ship;
          const fileSize = file.data.length;
          const ext = path.extname(file.name);
          const fileName = file.md5 + ext;
          const url = `${req.protocol}://${req.get("host")}/all/${fileName}`;
          const allowedType = [".png", ".jpg", ".jpeg"];

          if (!allowedType.includes(ext.toLowerCase()))
            return res.status(422).json({ msg: "Invalid image extension." });
          if (fileSize > 2000000)
            return res
              .status(422)
              .json({ msg: "Image must be less than 2 MB" });

          file.mv(`./public/all/${fileName}`, async (err) => {
            if (err) return res.status(500).json({ msg: err.message });
          });
          imagesHolder = { ...imagesHolder, ship: fileName, ship_url: url };
        }
        if (req?.files?.proof) {
          const file = req.files.proof;
          const fileSize = file.data.length;
          const ext = path.extname(file.name);
          const fileName = file.md5 + ext;
          const url = `${req.protocol}://${req.get("host")}/all/${fileName}`;
          const allowedType = [".png", ".jpg", ".jpeg"];

          if (!allowedType.includes(ext.toLowerCase()))
            return res.status(422).json({ msg: "Invalid image extension." });
          if (fileSize > 2000000)
            return res
              .status(422)
              .json({ msg: "Image must be less than 2 MB" });

          file.mv(`./public/all/${fileName}`, async (err) => {
            if (err) return res.status(500).json({ msg: err.message });
          });

          imagesHolder = { ...imagesHolder, proof: fileName, proof_url: url };
        }
      }
      const order = await Order.update(
        {
          ...req.body,
          total: req.body.shipping
            ? findOrder.amount + shipPrice
            : findOrder.total,
          ship_url: req?.files?.ship
            ? imagesHolder?.ship_url
            : findOrder.ship_url,
          ship: req?.files?.ship ? imagesHolder?.ship : findOrder.ship,
          proof_url: req?.files?.proof
            ? imagesHolder?.proof_url
            : findOrder.proof_url,
          proof: req?.files?.proof ? imagesHolder?.proof : findOrder.proof,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      res.send({
        message: "Order updated successfully.",
      });
    } else {
      return res.status(404).send({
        msg: "Order not found.",
      });
    }
  },

  async delete(req, res) {
    const order = await Order.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.send({ message: "Order deleted successfully" });
  },

  async get(req, res) {
    const ba = await BankAccount.findByPk(req.params.id);

    res.send({
      msg: "Bank Account found.",
      result: ba,
    });
  },
};
