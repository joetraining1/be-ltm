const { Sequelize } = require("sequelize");
const { sequelize } = require("../config/db");
const { BankAccount } = require("../models/BankAccounts");

exports.AccountController = {
  async getAll(req, res) {
    // const ba = await BankAccount.findAll();
    const ba = await sequelize.query(
        "SELECT accounts.id, accounts.bank_name, accounts.norek, banks.url, users.name FROM `accounts` INNER join banks on accounts.bank_id = banks.id INNER JOIN users on accounts.user_id = users.id",
        { type: Sequelize.QueryTypes.SELECT }
      );

    res.send({
      msg: "Bank Account Collected Succesfully",
      result: ba,
    });
  },

  async create(req, res) {
    const ba = await BankAccount.create({
      bank_name: req?.body?.bank_name,
      norek: req?.body?.norek,
      bank_id: req?.body?.bank_id,
      user_id: 2,
    });

    res.send({
      msg: "Bank Account added.",
      result: ba,
    });
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
