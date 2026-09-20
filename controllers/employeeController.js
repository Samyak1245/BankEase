const employeeModel = require("../models/employeeModel");
const branchModel = require("../models/branchModel");

function redirectWith(res, path, type, message) {
  return res.redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

exports.getEmployees = async (req, res) => {
  try {
    const [employees, branches] = await Promise.all([
      employeeModel.getAllEmployees(),
      branchModel.getAllBranches()
    ]);
    res.render("employees", {
      title: "Employees",
      employees,
      branches
    });
  } catch (err) {
    console.error(err);
    redirectWith(res, "/", "error", "Could not load employees.");
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    const role = (req.body.role || "").trim();
    const email = (req.body.email || "").trim();
    const branch_id = req.body.branch_id ? Number(req.body.branch_id) : null;

    if (!name) {
      return redirectWith(res, "/employees", "error", "Employee name is required.");
    }
    if (email && !isValidEmail(email)) {
      return redirectWith(res, "/employees", "error", "Please enter a valid email address.");
    }

    await employeeModel.createEmployee({ branch_id, name, role, email });
    redirectWith(res, "/employees", "success", "Employee added successfully.");
  } catch (err) {
    console.error(err);
    redirectWith(res, "/employees", "error", "Could not add employee.");
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    const role = (req.body.role || "").trim();
    const email = (req.body.email || "").trim();
    const branch_id = req.body.branch_id ? Number(req.body.branch_id) : null;

    if (!name) {
      return redirectWith(res, "/employees", "error", "Employee name is required.");
    }
    if (email && !isValidEmail(email)) {
      return redirectWith(res, "/employees", "error", "Please enter a valid email address.");
    }

    await employeeModel.updateEmployee(req.params.id, { branch_id, name, role, email });
    redirectWith(res, "/employees", "success", "Employee updated successfully.");
  } catch (err) {
    console.error(err);
    redirectWith(res, "/employees", "error", "Could not update employee.");
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    await employeeModel.deleteEmployee(req.params.id);
    redirectWith(res, "/employees", "success", "Employee deleted successfully.");
  } catch (err) {
    console.error(err);
    redirectWith(res, "/employees", "error", "Could not delete employee.");
  }
};
