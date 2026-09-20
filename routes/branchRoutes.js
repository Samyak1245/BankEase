const express = require("express");
const router = express.Router();
const branchController = require("../controllers/branchController");

router.get("/", branchController.getBranches);
router.post("/", branchController.createBranch);
router.post("/:id/edit", branchController.updateBranch);
router.post("/:id/delete", branchController.deleteBranch);

module.exports = router;
