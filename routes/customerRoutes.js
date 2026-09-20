const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/", customerController.getCustomers);
router.get("/new", customerController.getNewCustomer);
router.post("/", customerController.createCustomer);
router.get("/:id/edit", customerController.getEditCustomer);
router.post("/:id/edit", customerController.updateCustomer);
router.post("/:id/delete", customerController.deleteCustomer);

module.exports = router;
