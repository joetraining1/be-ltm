const { TypeController } = require('../controllers/TypeCon');

const router = require("express").Router()

router.post("/", TypeController.create);

module.exports = router