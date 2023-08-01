const { OrderController } = require('../controllers/OrderCon');

const router = require("express").Router()

router.post("/", OrderController.create);
router.post("/checkout", OrderController.checkout);
router.get("/completion/form/:id", OrderController.paymentForm);
router.put("/completion/:order_id", OrderController.completion);
router.get("/completion/order/:user_id", OrderController.getCompletion);
router.put("/:id", OrderController.update);
router.get("/", OrderController.getAll);
router.get("/status/:id", OrderController.getAllByStatusId);
router.post("/user/:user_id", OrderController.getAllByUserNstat);
router.get("/:user_id", OrderController.getAllbyId);
router.get("/quick/:id", OrderController.getQuick);
router.get("/invoice/:order_id", OrderController.getInvoice);
router.get("/try/:id", OrderController.loopingCreate);
router.delete("/:id", OrderController.delete);

module.exports = router