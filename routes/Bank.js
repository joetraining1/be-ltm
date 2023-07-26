const { BankController } = require('../controllers/BankCon');

const router = require("express").Router()

router.post("/", BankController.create);
router.get("/", BankController.getAll);
router.get("/:id", BankController.get);
router.put("/:id", BankController.update);
router.delete("/:id", BankController.delete);

module.exports = router