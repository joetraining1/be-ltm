const { Bank } = require("../models/Banks");
const path = require("path");
const fs = require("fs");

exports.BankController = {
  async getAll(req, res) {
    const bank = await Bank.findAll();

    res.send({
      msg: "Bank Collected Succesfully",
      result: bank,
    });
  },

  async create(req, res) {
    if (req.files === null) {
      const bank = await Bank.create({
        title: req?.body?.title,
        acronim: req?.body?.acronim,
      });

      res.send({
        msg: "Bank added.",
        result: bank,
      });
    } else {
      const name = req.body.title;
      const file = req.files.image;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const fileName = file.md5 + ext;
      const url = `${req.protocol}://${req.get("host")}/internal/${fileName}`;
      const allowedType = [".png", ".jpg", ".jpeg"];

      if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: "Invalid image extension." });
      if (fileSize > 2000000)
        return res.status(422).json({ msg: "Image must be less than 2 MB" });

      file.mv(`./public/internal/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
          await Bank.create({
            title: name,
            acronim: req.body.acronim,
            image: fileName,
            url: url,
          });
          res.status(201).json({ msg: "Bank added." });
        } catch (error) {
          console.log(error.message);
        }
      });
    }
  },

  async update(req, res) {
    const findBank = await Bank.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (findBank) {
      let fileImage;
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

        if(findBank.image){
          const filepath = `./public/internal/${findBank.image}`;
          fs.unlinkSync(filepath);
        }

        file.mv(`./public/internal/${fileName}`, (err) => {
          if (err) return res.status(500).json({ msg: err.message });
        });
        const url = `${req.protocol}://${req.get("host")}/internal/${fileName}`;

        fileImage = {
          image: fileName,
          url: url,
        };
      }
      const bank = await Bank.update(
        {
          title: req?.body?.title ? req.body.title : findBank.title,
          acronim: req?.body?.acronim ? req.body.acronim : findBank.acronim,
          image: req?.files?.image ? fileImage.image : findBank.image,
          url: req?.files?.image ? fileImage.url : findBank.url,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      res.send({
        message: "Bank updated successfully.",
      });
    } else {
      return res.status(404).send({
        msg: "Bank not found.",
      });
    }
  },

  async delete(req, res) {
    const bank = await Bank.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.send({ message: "Bank deleted successfully" });
  },

  async get(req, res) {
    const bank = await Bank.findByPk(req.params.id);

    res.send({
      msg: "Bank found.",
      result: bank,
    });
  },
};
