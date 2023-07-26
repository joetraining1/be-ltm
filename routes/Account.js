const { AccountController } = require('../controllers/BankAccountCon');

const router = require("express").Router()

router.post("/", AccountController.create);
router.get("/", AccountController.getAll);
router.get("/:id", AccountController.get);
router.put("/:id", AccountController.update);
router.delete("/:id", AccountController.delete);

module.exports = router