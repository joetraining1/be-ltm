const { UserController } = require('../controllers/UserCon');

const router = require("express").Router()

router.post("/", UserController.create);
router.get("/", UserController.getAll);
router.get("/me", UserController.me);
router.get("/:id", UserController.getUser);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

module.exports = router