const { Status } = require("../models/Statuses");

exports.StatusController = {
  async getAll(req, res) {
    const status = await Status.findAll();

    res.send({
      msg: "Status Collected Succesfully",
      result: status,
    });
  },

  async create(req, res) {
    const status = await Status.create({
      title: req?.body?.title,
      description: req?.body?.description,
    });

    res.send({
      msg: "Status added.",
      result: status,
    });
  },

  async update(req, res) {
    const status = await Status.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    res.send({
      message: "Status updated successfully.",
    });
  },

  async delete(req, res) {
    const status = await Status.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.send({ message: "Status deleted successfully" });
  },

  async get(req, res) {
    const status = await Status.findByPk(req.params.id);

    res.send({
      msg: "Status found.",
      result: status,
    });
  },
};
