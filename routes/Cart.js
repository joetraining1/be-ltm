const { CartController } = require('../controllers/CartCon');

const router = require("express").Router()

router.post("/", CartController.create);
router.get("/", CartController.getAll);

module.exports = router