const Types = require("../models/Types");

exports.TypeController = {
  async getAll(req, res) {
    const type = await Types.findAll();

    res.send({
      msg: "Type Collected Succesfully",
      result: type,
    });
  },

  async create(req, res) {
    const type = await Types.create({
      title: req?.body?.title,
      description: req?.body?.description,
    });

    res.send({
      msg: "Type added.",
      result: type,
    });
  },

  async update(req, res) {
    const type = await Types.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    res.send({
      message: "Type updated successfully.",
    });
  },

  async delete(req, res) {
    const type = await Types.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.send({ message: "Type deleted successfully" });
  },

  async get(req, res) {
    const type = await Types.findByPk(req.params.id);

    res.send({
      msg: "Type found.",
      result: type,
    });
  },
};
