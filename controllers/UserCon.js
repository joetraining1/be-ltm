const { Sequelize, Op } = require("sequelize");
const { connect, sequelize } = require("../config/db");
const Type = require("../models/Types");
const { User } = require("../models/Users");
const { userFilter } = require("../utils/JSONfilter");
const { CartController } = require("./CartCon");
const path = require("path");
const fs = require("fs");
const { JWTController } = require("./JWTCon");
const { Cart } = require("../models/Carts");
const { cookieParser } = require("../utils/CookieParser");
const bcrypt = require("bcrypt");
const { Order } = require("../models/Orders");

exports.UserController = {
  async create(req, res) {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    if (req.files === null) {
      const user = await User.create({
        name: req?.body?.name,
        phone: req?.body?.phone,
        alamat: req?.body?.alamat,
        email: req?.body?.email,
        password: hashedPassword,
        type_id: 1,
      });

      const cart = await CartController.createByUser(user.id);

      res.send({
        msg: "User added.",
        result: user,
      });
    } else {
      const name = req.body.title;
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
        try {
          await User.create({
            name: req?.body?.name,
            phone: req?.body?.phone,
            alamat: req?.body?.alamat,
            url: url,
            image: fileName,
            email: req?.body?.email,
            password: hashedPassword,
            type_id: 1,
          });
          res.status(201).json({ msg: "User added." });
        } catch (error) {
          console.log(error.message);
        }
      });
    }
  },

  async me(req, res) {
    const token = cookieParser("accessToken", req.headers.cookie);
    const decoded = JWTController.verifyToken(token);
    if (!decoded) {
      res.status(405).json({
        msg: "Invalid token.",
      });
    } else {
      const user = await User.findOne({
        where: { email: decoded.email },
      });
      const type = await Type.findByPk(user.type_id);
      const cart = await Cart.findOne({
        where: {
          user_id: user.id,
        },
      });

      res.status(200).send({
        msg: "User found.",
        result: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          avapic: user.url,
          type: type.title,
          cart_id: cart.id,
        },
      });
    }
  },

  async getUserByEmail(email) {
    const user = await User.findOne({
      where: { email: email },
    });

    return user;
  },

  async updateUser(req, res) {
    await connect();

    console.log(req.files.image);

    const findUser = await User.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (findUser) {
      let fileImage;
      let password;
      if (req.body.password) {
        password = bcrypt.hashSync(req.body.password, 10);
      }

      if (req?.files?.image) {
        const file = req.files.image;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const allowedType = [".png", ".jpg", ".jpeg"];

        if (!allowedType.includes(ext.toLowerCase()))
          return res.status(422).json({ msg: "Invalid image extension." });
        if (fileSize > 2000000)
          return res.status(422).json({ msg: "Image must be less than 2 MB." });

        if (findUser.url === null) {
          file.mv(`./public/all/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
          });
        } else {
          const filepath = `./public/all/${findUser.image}`;
          fs.unlinkSync(filepath);
        }

        const url = `${req.protocol}://${req.get("host")}/all/${fileName}`;

        fileImage = {
          image: fileName,
          url: url,
        };
      }
      const user = await User.update(
        {
          name: req?.body?.name ? req.body.name : findUser.name,
          phone: req?.body?.phone ? req.body.phone : findUser.phone,
          alamat: req?.body?.alamat ? req.body.alamat : findUser.alamat,
          image: req?.files?.image ? fileImage.image : findUser.image,
          url: req?.files?.image ? fileImage.url : findUser.url,
          email: req?.body?.email ? req.body.email : findUser.email,
          password: req?.body?.password ? password : findUser.password,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      res.send({
        msg: "User updated successfully.",
        result: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          avapic: user.url,
          alamat: user.alamat,
        },
      });
    } else {
      return res.status(404).send({
        msg: "User not found.",
      });
    }
  },

  async getAll(req, res) {
    await connect();

    const userQ = await sequelize.query(
      "SELECT users.id, users.name, users.phone, users.alamat, users.url, types.title as `type` FROM `users` INNER join types on users.type_id = types.id ",
      { type: Sequelize.QueryTypes.SELECT }
    );

    // const user = await User.findAll({
    //   attributes: ["id", "name", "phone", "alamat", "email", "url"],
    //   include: [{
    //     model: Type,
    //   }]
    // });
    // const type = await Type.findByPk(user.type_id);
    if (!userQ) res.status(404).json({ errors: { msg: "User not found" } });
    else {
      // const userParsing = {
      //   type: type.title,
      // };
      res.status(200).send({
        msg: "User found.",
        result: userQ,
      });
    }
  },

  async getUser(req, res) {
    await connect();

    const userQ = await sequelize.query(
      `SELECT users.id, users.name, users.phone, users.alamat, users.url, users.email, users.createdAt, types.title as "type" FROM users INNER join types on users.type_id = types.id WHERE users.id = ${req.params.id}`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const LastOrder = await sequelize.query(
      `SELECT * FROM orders WHERE orders.user_id = ${req.params.id} AND orders.cp IS NULL ORDER BY id DESC LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );


    res.status(200).send({
      msg: 'data found.',
      result: userQ[0],
      last: LastOrder
    })

    // // const user = await User.findOne({
    // //   where: {
    // //     id: req.params.id,
    // //   },
    // //   attributes: ["id", "name", "phone", "alamat", "email", "url"],
    // // });
    // // const type = await Type.findByPk(user.type_id);

    // if (!userQ) res.status(404).send({ errors: { msg: "User not found" } });
    // else {
    //   res.send({
    //     msg: "User found.",
    //     result: userQ,
    //   });
    // }
  },

  async deleteUser(req, res) {
    await connect();

    let user = await User.findByPk(req.params.id);

    if (!user) res.status(404).json({ errors: { msg: "User not found" } });
    else {
      user.destroy();
      res.send({ message: "User deleted successfully" });
    }
  },
};
