const { Categories } = require("../models/Categories");

exports.CtgController = {
  async getAll(req, res) {
    const ctg = await Categories.findAll();

    res.send({
      msg: "Categories Collected Succesfully",
      result: ctg,
    });
  },

  async create(req, res) {
    const ctg = await Categories.create({
      title: req?.body?.title,
      description: req?.body?.description,
    });

    res.send({
      msg: "Categories added.",
      result: ctg,
    });
  },

  async update(req, res) {
    const ctg = await Categories.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    res.send({
      message: "Categories updated successfully.",
    });
  },

  async delete(req, res) {
    const ctg = await Categories.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.send({ message: "Categories deleted successfully" });
  },

  async get(req, res) {
    const ctg = await Categories.findByPk(req.params.id);

    res.send({
      msg: "Categories found.",
      result: ctg,
    });
  },
};
