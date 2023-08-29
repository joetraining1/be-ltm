const { Product } = require("../models/Products");
const path = require("path");
const fs = require("fs");
const { Categories } = require("../models/Categories");
const { Op, Sequelize } = require("sequelize");
const { sequelize } = require("../config/db");

exports.ProductController = {
  async getAll(req, res) {
    const product = await Product.findAll();

    res.send({
      msg: "Product Collected Succesfully",
      result: product,
    });
  },

  async getAllWithCtg(req, res) {
    // const product = await Product.findAll();
    const product = await sequelize.query(
      `SELECT products.id, products.title, products.price, categories.title as "kategori" from products INNER JOIN categories on products.ctg_id = categories.id`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    res.send({
      msg: "Product Collected Succesfully",
      result: product,
    });
  },

  async showcaseById(req, res) {
    try {
      const ctg = await Categories.findByPk(req.params.ctg_id);
      const product = await Product.findAll({
        where: {
          ctg_id: req.params.ctg_id,
        },
        attributes: ["id", "url", "title", "price", "stock"],
      });
      
      res.status(200).send({
        msg: 'OK',
        ctg: ctg,
        result: product
      })
    } catch (error) {
      console.log(error);

      res.status(500).send({
        msg: "error occured.",
      });
    }
  },
  async showcase(req, res) {
    let completeSet = [];
    try {
      const ctg = await Categories.findAll({
        attributes: [["id", "ctg_id"], "title"],
      });
      for (const element of ctg) {
        const product = await Product.findAll({
          where: {
            ctg_id: element.dataValues.ctg_id,
          },
          attributes: ["id", "url", "title", "price", "stock"],
        });
        completeSet = [
          ...completeSet,
          {
            ...element,
            result: product
          },
        ];
      }
      res.status(200).send({
        msg: 'OK',
        ctgs: ctg,
        dataset: completeSet,
      })
    } catch (error) {
      console.log(error);

      res.status(500).send({
        msg: "error occured.",
      });
    }
  },

  async searchProduct(req, res) {
    let arrKeys = "";
    const keyword = req.body.keyword;
    console.log(keyword);
    let arrResult = [];
    let uniqArr = [];
    let uniqObj = {};
    try {
      if (/\s/g.test(keyword)) {
        arrKeys = keyword.split(" ");
        arrKeys = arrKeys.filter(
          (item) =>
            !(
              item === "Susu" ||
              item === "Yoghurt" ||
              item === "susu" ||
              item === "yoghurt"
            )
        );
        for (const keys of arrKeys) {
          const qParam = `SELECT products.id, products.title, products.price, products.stock, products.url `;
          const qRelate = `from products INNER JOIN categories on products.ctg_id = categories.id `;
          const qClause = `WHERE products.title LIKE "%${keys}%" OR categories.title LIKE "%${keys}%"`;
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
        res.status(200).send({
          msg: "OK",
          result: uniqArr,
        });
      } else {
        const qParam = `SELECT products.id, products.title, products.price, products.stock, products.url `;
        const qRelate = `from products INNER JOIN categories on products.ctg_id = categories.id `;
        const qClause = `WHERE products.title LIKE "%${keyword}%" OR categories.title LIKE "%${keyword}%"`;
        const product = await sequelize.query(
          qParam.concat(qRelate).concat(qClause),
          { type: Sequelize.QueryTypes.SELECT }
        );
        arrResult = [...arrResult, ...product];
        res.status(200).send({
          msg: "OK",
          result: arrResult,
        });
      }
    } catch (error) {
      console.log(error);

      res.status(500).send({
        msg: "error occured.",
      });
    }
  },

  async display(req, res) {
    let completeSet = [];
    try {
      const ctg = await Categories.findAll({
        attributes: ["id", "title"],
      });
      for (const rows of ctg) {
        const product = await Product.findAll({
          where: {
            ctg_id: rows.id,
          },
          attributes: ["url", "title", "description"],
        });
        completeSet = [
          ...completeSet,
          {
            ...rows,
            dataset: product,
          },
        ];
      }
      res.status(200).send({
        msg: "OK",
        result: completeSet,
      });
    } catch (error) {
      console.log(error);

      res.status(500).send({
        msg: "error occured.",
      });
    }
  },

  async getAllbyCtg(req, res) {
    const product = await Product.findAll({
      where: {
        ctg_id: req.params.ctg_id,
      },
    });

    res.send({
      msg: "Products found.",
      result: product,
    });
    return;
  },

  async create(req, res) {
    if (req.files === null) {
      const product = await Product.create({
        title: req?.body?.title,
        description: req?.body?.description,
        price: req.body.price,
        stock: req.body.stock,
        ctg_id: req.body?.ctg_id ? req.body?.ctg_id : 1,
      });

      res.send({
        msg: "Product added.",
        result: product,
      });
    } else {
      const name = req.body.title;
      const file = req.files.image;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const fileName = file.md5 + ext;
      const url = `${req.protocol}://${req.get("host")}/product/${fileName}`;
      const allowedType = [".png", ".jpg", ".jpeg"];

      if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: "Invalid image extension." });
      if (fileSize > 2000000)
        return res.status(422).json({ msg: "Image must be less than 2 MB" });

      file.mv(`./public/product/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
          await Product.create({
            title: name,
            description: req.body.description,
            image: fileName,
            url: url,
            price: req.body.price,
            stock: req.body.stock,
            ctg_id: req.body?.ctg_id ? req.body.ctg_id : 1,
          });
          res.status(201).json({ msg: "Product added." });
        } catch (error) {
          console.log(error.message);
        }
      });
    }
  },

  async update(req, res) {
    const findProduct = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (findProduct) {
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

        if (findProduct.image) {
          const filepath = `./public/product/${findProduct.image}`;
          fs.unlinkSync(filepath);
        }

        file.mv(`./public/product/${fileName}`, (err) => {
          if (err) return res.status(500).json({ msg: err.message });
        });
        const url = `${req.protocol}://${req.get("host")}/product/${fileName}`;

        fileImage = {
          image: fileName,
          url: url,
        };
      }
      const product = await Product.update(
        {
          title: req?.body?.title ? req.body.title : findProduct.title,
          acronim: req?.body?.description
            ? req.body.description
            : findProduct.description,
          image: req?.files?.image ? fileImage.image : findProduct.image,
          url: req?.files?.image ? fileImage.url : findProduct.url,
          ctg_id: req?.body?.ctg_id ? req?.body?.ctg_id : findProduct.ctg_id,
          stock: req?.body?.stock ? req?.body?.stock : findProduct.stock,
          price: req?.body?.price ? req?.body?.price : findProduct.price,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      res.send({
        message: "Product updated successfully.",
      });
    } else {
      return res.status(404).send({
        msg: "Product not found.",
      });
    }
  },

  async delete(req, res) {
    const product = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.send({ message: "Product deleted successfully" });
  },

  async get(req, res) {
    const product = await Product.findByPk(req.params.id);

    res.send({
      msg: "Product found.",
      result: product,
    });
  },
};
