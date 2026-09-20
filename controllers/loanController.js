const loanModel = require("../models/loanModel");
const customerModel = require("../models/customerModel");

function redirectWith(res, path, type, message) {
  return res.redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

exports.getLoans = async (req, res) => {
  try {
    const search = (req.query.q || "").trim();
    const [loans, customers] = await Promise.all([
      loanModel.getAllLoans(search),
      customerModel.getAllCustomers()
    ]);
    res.render("loans", {
      title: "Loans",
      loans,
      customers,
      search
    });
  } catch (err) {
    console.error(err);
    redirectWith(res, "/", "error", "Could not load loans.");
  }
};

exports.getNewLoan = async (req, res) => {
  try {
    const [loans, customers] = await Promise.all([
      loanModel.getAllLoans(),
      customerModel.getAllCustomers()
    ]);
    res.render("loans", {
      title: "Apply for Loan",
      loans,
      customers,
      search: "",
      openAdd: "loan"
    });
  } catch (err) {
    console.error(err);
    redirectWith(res, "/loans", "error", "Could not open loan form.");
  }
};

exports.createLoan = async (req, res) => {
  try {
    const customer_id = Number(req.body.customer_id);
    const loan_type = req.body.loan_type;
    const loan_amount = Number(req.body.loan_amount);
    const interest_rate = Number(req.body.interest_rate);
    const tenure_months = Number(req.body.tenure_months);
    const application_date = req.body.application_date || new Date().toISOString().slice(0, 10);

    if (!customer_id || !loan_type) {
      return redirectWith(res, "/loans", "error", "Customer and loan type are required.");
    }
    if (!["Home", "Education", "Personal", "Vehicle"].includes(loan_type)) {
      return redirectWith(res, "/loans", "error", "Invalid loan type.");
    }
    if (!loan_amount || loan_amount <= 0) {
      return redirectWith(res, "/loans", "error", "Loan amount must be greater than 0.");
    }
    if (Number.isNaN(interest_rate) || interest_rate < 0) {
      return redirectWith(res, "/loans", "error", "Interest rate cannot be negative.");
    }
    if (!tenure_months || tenure_months <= 0) {
      return redirectWith(res, "/loans", "error", "Tenure must be greater than 0.");
    }

    await loanModel.createLoan({
      customer_id,
      loan_type,
      loan_amount,
      interest_rate,
      tenure_months,
      application_date
    });
    redirectWith(res, "/loans", "success", "Loan application submitted.");
  } catch (err) {
    console.error(err);
    redirectWith(res, "/loans", "error", "Could not apply for loan.");
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const status = req.body.status;
    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return redirectWith(res, "/loans", "error", "Invalid loan status.");
    }
    await loanModel.updateStatus(req.params.id, status);
    redirectWith(res, "/loans", "success", "Loan status updated.");
  } catch (err) {
    console.error(err);
    redirectWith(res, "/loans", "error", "Could not update loan status.");
  }
};
