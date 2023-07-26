const bcrypt = require("bcrypt");

const { connect } = require("../config/db");
const { User } = require("../models/Users");
const { JWTController } = require("../controllers/JWTCon");
const { UserController } = require("../controllers/UserCon");
const Type = require("../models/Types");
const { Cart } = require("../models/Carts");
const { CartController } = require("./CartCon");

exports.HomeController = {
  async register(req, res) {
    await connect();

    let user = await UserController.getUserByEmail(req.body.email);

    if (user) {
      return res.status(400).json({ errors: { msg: "Email already taken." } });
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    user = await User.create({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      password: hashedPassword,
      type_id: 1,
    });

    const type = await Type.findByPk(user.type_id);
    const cart = await CartController.createByUser(user.id);

    const token = JWTController.createToken({ email: user.email }, true);

    res.cookie("refresh_token", token.refresh_token, {
      expires: new Date(Date.now() + 30 * 24 * 360000),
      httpOnly: true,
    });

    res.send({
      result: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        type: type.title,
      },
      access_token: token.access_token,
    });
  },
  async login(req, res) {
    await connect();

    let user = await UserController.getUserByEmail(req.body.email);

    if (!user)
      return res.status(404).json({ errors: { msg: "User not found." } });

    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = JWTController.createToken({ email: user.email }, true);
      const type = await Type.findByPk(user.type_id);
      const cart = await Cart.findOne({
        where: {
          user_id: user.id
        }
      })

      res.cookie("refresh_token", token.refresh_token, {
        expires: new Date(Date.now() + 30 * 24 * 360000),
        httpOnly: true,
      });
      res.send({
        result: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          type: type.title,
        },
        access_token: token.access_token,
      });
    } else res.status(400).json({ errors: { msg: "Incorrect Password" } });
  },
};
