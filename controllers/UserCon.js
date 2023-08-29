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
        type_id: req?.type_id ? req.body.type_id : 3,
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
            type_id: req.body.type_id ? req.body.type_id : 3,
          });
          res.status(201).json({ msg: "User added." });
        } catch (error) {
          console.log(error.message);
        }
      });
    }
  },

  async me(req, res) {
    // const token = cookieParser("accessToken", req.headers.cookie);
    const token = req.headers["authorization"].split(" ")[1];
    console.log(token, 'provided by me')
    console.log('im running..')
    const decoded = JWTController.verifyToken(token);
    console.log(decoded)
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
          return res.status(422).json({ msg: "Format file salah." });
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
      console.log("checking clear photo :", req.body?.image);
      const user = await User.update(
        {
          name: req?.body?.name ? req.body.name : findUser.name,
          phone: req?.body?.phone ? req.body.phone : findUser.phone,
          alamat: req?.body?.alamat ? req.body.alamat : findUser.alamat,
          image: req?.files?.image
            ? fileImage.image
            : req.body.image
            ? null
            : findUser.image,
          url: req?.files?.image
            ? fileImage.url
            : req.body.image
            ? null
            : findUser.url,
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
      `SELECT users.id, users.name, users.phone, users.email, users.alamat, users.url, users.createdAt, types.title as "type" FROM users INNER join types on users.type_id = types.id`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    let completeSet = [];

    for (const element of userQ) {
      const countDone = await Order.count({
        where: {
          [Op.and]: [{ user_id: element.id }, { status_id: 7 }],
        },
      });
      const active = await Order.count({
        where: {
          [Op.and]: [
            { user_id: element.id },
            {
              status_id: {
                [Op.not]: 7,
              },
            },
          ],
        },
      });
      completeSet = [
        ...completeSet,
        {
          ...element,
          done: countDone,
          active: active,
        },
      ];
    }

    if (!userQ) res.status(404).json({ errors: { msg: "User not found" } });
    else {
      res.status(200).send({
        msg: "User found.",
        result: completeSet,
      });
    }
  },

  async searchByUserEmail(req, res) {
    let arrKeys = "";
    const keyword = req.body.keyword;
    console.log(keyword);
    let arrResult = [];
    let uniqArr = [];
    let uniqObj = {};
    try {
      if (/\s/g.test(keyword)) {
        arrKeys = keyword.split(" ");
        for (const keys of arrKeys) {
          const qParam = `SELECT users.id, users.name, users.phone, users.email, users.alamat, users.url, users.createdAt, types.title as "type" `;
          const qRelate = `from users INNER JOIN types on users.type_id = types.id `;
          const qClause = `WHERE users.name LIKE "%${keys}%" OR users.email LIKE "%${keys}%"`;
          const product = await sequelize.query(
            qParam.concat(qRelate).concat(qClause),
            { type: Sequelize.QueryTypes.SELECT }
          );
          arrResult = [...arrResult, ...product];
        }
        for (let i in arrResult) {
          const objTitle = arrResult[i]["title"];
          uniqObj[objTitle] = arrResult[i];
        }
        for (i in uniqObj) {
          uniqArr.push(uniqObj[i]);
        }

        let completeSet = [];

        for (const element of uniqArr) {
          const countDone = await Order.count({
            where: {
              [Op.and]: [{ user_id: element.id }, { status_id: 7 }],
            },
          });
          const active = await Order.count({
            where: {
              [Op.and]: [
                { user_id: element.id },
                {
                  status_id: {
                    [Op.not]: 7,
                  },
                },
              ],
            },
          });
          completeSet = [
            ...completeSet,
            {
              ...element,
              done: countDone,
              active: active,
            },
          ];
        }
        res.status(200).send({
          msg: "OK",
          result: completeSet,
        });
      } else {
        const qParam = `SELECT users.id, users.name, users.phone, users.email, users.alamat, users.url, users.createdAt, types.title as "type" `;
        const qRelate = `from users INNER JOIN types on users.type_id = types.id `;
        const qClause = `WHERE users.name LIKE "%${keyword}%" OR users.email LIKE "%${keyword}%"`;
        const product = await sequelize.query(
          qParam.concat(qRelate).concat(qClause),
          { type: Sequelize.QueryTypes.SELECT }
        );
        arrResult = [...arrResult, ...product];

        let completeSet = [];

        for (const element of arrResult) {
          const countDone = await Order.count({
            where: {
              [Op.and]: [{ user_id: element.id }, { status_id: 7 }],
            },
          });
          const active = await Order.count({
            where: {
              [Op.and]: [
                { user_id: element.id },
                {
                  status_id: {
                    [Op.not]: 7,
                  },
                },
              ],
            },
          });
          completeSet = [
            ...completeSet,
            {
              ...element,
              done: countDone,
              active: active,
            },
          ];
        }
        res.status(200).send({
          msg: "OK",
          result: completeSet,
        });
      }
    } catch (error) {
      console.log(error);

      res.status(500).send({
        msg: "error occured.",
      });
    }
  },

  async getUser(req, res) {
    await connect();
    try {
      const userQ = await sequelize.query(
        `SELECT users.id, users.name, users.phone, users.alamat, users.url, users.email, users.createdAt, types.title as "type" FROM users INNER join types on users.type_id = types.id WHERE users.id = ${req.params.id}`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      const LastOrder = await sequelize.query(
        `SELECT orders.id, orders.variant, orders.unit, orders.amount FROM orders WHERE orders.user_id = ${req.params.id} AND orders.cp IS NULL ORDER BY orders.id DESC LIMIT 1`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      const countDone = await Order.count({
        where: {
          [Op.and]: [{ user_id: req.params.id }, { status_id: 7 }],
        },
      });
      const active = await Order.count({
        where: {
          [Op.and]: [
            { user_id: req.params.id },
            {
              status_id: {
                [Op.not]: 7,
              },
            },
          ],
        },
      });

      res.status(200).send({
        msg: "data found.",
        result: userQ[0],
        last: LastOrder,
        done: countDone,
        active: active,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        msg: "data not found.",
      });
      return;
    }
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
