const { CartDetailController } = require('../controllers/CartDetailCon');

const router = require("express").Router()

router.post("/", CartDetailController.create); // add to cart function
router.get("/", CartDetailController.getAll);
router.get("/:id", CartDetailController.getAllbyId);
router.put("/:id", CartDetailController.update); // update cart detail data
router.delete("/:id", CartDetailController.delete);

module.exports = router