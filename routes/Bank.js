/**
 * @swagger
 * tags:
 *   name: Banks
 *   description: The Banks managing API
 * /bank:
 *   post:
 *     summary: Create a new Bank
 *     tags: [Bank]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The bank's name.
 *                 example: Bank Central Asia
 *     responses:
 *       200:
 *         description: The created data.
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The bank's name.
 *                 example: Bank Central Asia
 *       500:
 *         description: Some server error
 *
 */

const { BankController } = require('../controllers/BankCon');

const router = require("express").Router()

router.post("/", BankController.create);
router.get("/", BankController.getAll);
router.get("/:id", BankController.get);
router.put("/:id", BankController.update);
router.delete("/:id", BankController.delete);

module.exports = router