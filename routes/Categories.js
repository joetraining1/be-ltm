const { CtgController } = require('../controllers/CtgCon');

const router = require("express").Router()

router.post("/", CtgController.create);
router.get("/", CtgController.getAll);
router.get("/:id", CtgController.get);
router.put("/:id", CtgController.update);
router.delete("/:id", CtgController.delete);

module.exports = router