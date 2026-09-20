const customerModel = require("../models/customerModel");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}

function redirectWith(res, path, type, message) {
  return res.redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

exports.getCustomers = async (req, res) => {
  try {
    const search = (req.query.q || "").trim();
    const customers = await customerModel.getAllCustomers(search);
    res.render("customers", {
      title: "Customers",
      customers,
      search,
      editCustomer: null,
      openAdd: null
    });
  } catch (err) {
    console.error(err);
    redirectWith(res, "/", "error", "Could not load customers.");
  }
};

exports.getNewCustomer = async (req, res) => {
  try {
    const customers = await customerModel.getAllCustomers();
    res.render("customers", {
      title: "Add Customer",
      customers,
      search: "",
      editCustomer: null,
      openAdd: "customer"
    });
  } catch (err) {
    console.error(err);
    redirectWith(res, "/customers", "error", "Could not open add customer form.");
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim();
    const phone = (req.body.phone || "").trim();
    const address = (req.body.address || "").trim();
    const date_of_birth = req.body.date_of_birth || null;

    if (!name || !email || !phone) {
      return redirectWith(res, "/customers", "error", "Name, email and phone are required.");
    }
    if (!isValidEmail(email)) {
      return redirectWith(res, "/customers", "error", "Please enter a valid email address.");
    }
    if (!isValidPhone(phone)) {
      return redirectWith(res, "/customers", "error", "Phone must be a 10-digit number.");
    }

    await customerModel.createCustomer({ name, email, phone, address, date_of_birth });
    redirectWith(res, "/customers", "success", "Customer added successfully.");
  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      return redirectWith(res, "/customers", "error", "Email or phone already exists.");
    }
    redirectWith(res, "/customers", "error", "Could not add customer.");
  }
};

exports.getEditCustomer = async (req, res) => {
  try {
    const editCustomer = await customerModel.getCustomerById(req.params.id);
    if (!editCustomer) {
      return redirectWith(res, "/customers", "error", "Customer not found.");
    }
    const customers = await customerModel.getAllCustomers();
    res.render("customers", {
      title: "Edit Customer",
      customers,
      search: "",
      editCustomer
    });
  } catch (err) {
    console.error(err);
    redirectWith(res, "/customers", "error", "Could not load customer.");
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim();
    const phone = (req.body.phone || "").trim();
    const address = (req.body.address || "").trim();
    const date_of_birth = req.body.date_of_birth || null;

    if (!name || !email || !phone) {
      return redirectWith(res, "/customers", "error", "Name, email and phone are required.");
    }
    if (!isValidEmail(email)) {
      return redirectWith(res, "/customers", "error", "Please enter a valid email address.");
    }
    if (!isValidPhone(phone)) {
      return redirectWith(res, "/customers", "error", "Phone must be a 10-digit number.");
    }

    await customerModel.updateCustomer(req.params.id, {
      name,
      email,
      phone,
      address,
      date_of_birth
    });
    redirectWith(res, "/customers", "success", "Customer updated successfully.");
  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      return redirectWith(res, "/customers", "error", "Email or phone already exists.");
    }
    redirectWith(res, "/customers", "error", "Could not update customer.");
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    await customerModel.deleteCustomer(req.params.id);
    redirectWith(res, "/customers", "success", "Customer deleted successfully.");
  } catch (err) {
    console.error(err);
    if (err.code === "ER_ROW_IS_REFERENCED_2" || err.code === "ER_ROW_IS_REFERENCED") {
      return redirectWith(
        res,
        "/customers",
        "error",
        "Cannot delete customer who has accounts or loans."
      );
    }
    redirectWith(res, "/customers", "error", "Could not delete customer.");
  }
};
