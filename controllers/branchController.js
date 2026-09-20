const branchModel = require("../models/branchModel");

function redirectWith(res, path, type, message) {
  return res.redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

exports.getBranches = async (req, res) => {
  try {
    const branches = await branchModel.getAllBranches();
    res.render("branches", {
      title: "Branches",
      branches
    });
  } catch (err) {
    console.error(err);
    redirectWith(res, "/", "error", "Could not load branches.");
  }
};

exports.createBranch = async (req, res) => {
  try {
    const branch_name = (req.body.branch_name || "").trim();
    const city = (req.body.city || "").trim();
    const address = (req.body.address || "").trim();

    if (!branch_name || !city) {
      return redirectWith(res, "/branches", "error", "Branch name and city are required.");
    }

    await branchModel.createBranch({ branch_name, city, address });
    redirectWith(res, "/branches", "success", "Branch added successfully.");
  } catch (err) {
    console.error(err);
    redirectWith(res, "/branches", "error", "Could not add branch.");
  }
};

exports.updateBranch = async (req, res) => {
  try {
    const branch_name = (req.body.branch_name || "").trim();
    const city = (req.body.city || "").trim();
    const address = (req.body.address || "").trim();

    if (!branch_name || !city) {
      return redirectWith(res, "/branches", "error", "Branch name and city are required.");
    }

    await branchModel.updateBranch(req.params.id, { branch_name, city, address });
    redirectWith(res, "/branches", "success", "Branch updated successfully.");
  } catch (err) {
    console.error(err);
    redirectWith(res, "/branches", "error", "Could not update branch.");
  }
};

exports.deleteBranch = async (req, res) => {
  try {
    await branchModel.deleteBranch(req.params.id);
    redirectWith(res, "/branches", "success", "Branch deleted successfully.");
  } catch (err) {
    console.error(err);
    if (err.code === "ER_ROW_IS_REFERENCED_2" || err.code === "ER_ROW_IS_REFERENCED") {
      return redirectWith(res, "/branches", "error", "Cannot delete a branch that has employees.");
    }
    redirectWith(res, "/branches", "error", "Could not delete branch.");
  }
};
