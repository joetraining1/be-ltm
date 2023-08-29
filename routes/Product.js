const { ProductController } = require('../controllers/ProductCon');

const router = require("express").Router()

router.post("/", ProductController.create);
router.get("/", ProductController.getAll);
router.get("/selection", ProductController.getAllWithCtg);
router.get("/:ctg_id", ProductController.getAllbyCtg);
router.get("/:id", ProductController.get);
router.put("/:id", ProductController.update);
router.delete("/:id", ProductController.delete);

module.exports = router