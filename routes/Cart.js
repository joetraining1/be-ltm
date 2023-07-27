const { CartController } = require('../controllers/CartCon');

const router = require("express").Router()

router.post("/", CartController.create);
router.get("/", CartController.getAll);
router.get("/:user_id", CartController.getAllbyUser);
router.get("/:id", CartController.getAllbyId);

module.exports = router