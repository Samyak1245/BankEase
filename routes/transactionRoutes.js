const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

router.get("/", transactionController.getTransactions);
router.post("/deposit", transactionController.deposit);
router.post("/withdraw", transactionController.withdraw);

module.exports = router;
