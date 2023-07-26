const { TypeController } = require('../controllers/TypeCon');

const router = require("express").Router()

router.post("/", TypeController.create);
router.get("/", TypeController.getAll);
router.get("/:id", TypeController.get);
router.put("/:id", TypeController.update);
router.delete("/:id", TypeController.delete);

module.exports = router