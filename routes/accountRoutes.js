const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

router.get("/", accountController.getAccounts);
router.get("/new", accountController.getNewAccount);
router.post("/", accountController.createAccount);
router.get("/:id", accountController.getAccountDetails);
router.post("/:id/edit", accountController.updateAccount);

module.exports = router;
