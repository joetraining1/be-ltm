const { PaymentController } = require('../controllers/PaymentCon');

const router = require("express").Router()

router.post("/", PaymentController.create);
router.get("/", PaymentController.getAll);
router.get("/:id", PaymentController.get);
router.put("/:id", PaymentController.update);
router.delete("/:id", PaymentController.delete);

module.exports = router