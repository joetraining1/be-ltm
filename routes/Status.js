const { StatusController } = require('../controllers/StatusCon');

const router = require("express").Router()

router.post("/", StatusController.create);
router.get("/", StatusController.getAll);
router.get("/:id", StatusController.get);
router.put("/:id", StatusController.update);
router.delete("/:id", StatusController.delete);

module.exports = router