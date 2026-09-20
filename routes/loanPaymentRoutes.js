const express = require("express");
const router = express.Router();
const loanPaymentController = require("../controllers/loanPaymentController");

router.get("/", loanPaymentController.getPayments);
router.post("/", loanPaymentController.createPayment);

module.exports = router;
