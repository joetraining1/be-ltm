const { CartDetailController } = require('../controllers/CartDetailCon');

const router = require("express").Router()

router.post("/", CartDetailController.create);
router.get("/", CartDetailController.getAll);
router.get("/:id", CartDetailController.getAllbyId);
router.put("/:id", CartDetailController.update);
router.delete("/:id", CartDetailController.delete);

module.exports = router