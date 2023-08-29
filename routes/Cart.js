const { CartController } = require('../controllers/CartCon');

const router = require("express").Router()

router.post("/", CartController.create);
router.post("/search", CartController.searchByUserEmail);
router.get("/", CartController.getAll);
router.get("/:user_id", CartController.getAllbyUser);
router.get("/:id", CartController.getAllbyId);
router.get("/quick/:id", CartController.getQuick);

module.exports = router