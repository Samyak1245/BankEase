const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanController");

router.get("/", loanController.getLoans);
router.get("/new", loanController.getNewLoan);
router.post("/", loanController.createLoan);
router.post("/:id/status", loanController.updateStatus);

module.exports = router;
