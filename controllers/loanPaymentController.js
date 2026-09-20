const loanPaymentModel = require("../models/loanPaymentModel");
const loanModel = require("../models/loanModel");

function redirectWith(res, path, type, message) {
  return res.redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

exports.getPayments = async (req, res) => {
  try {
    const [payments, loans] = await Promise.all([
      loanPaymentModel.getAllPayments(),
      loanModel.getAllLoans()
    ]);
    res.render("loanPayments", {
      title: "Loan Payments",
      payments,
      loans
    });
  } catch (err) {
    console.error(err);
    redirectWith(res, "/", "error", "Could not load loan payments.");
  }
};

exports.createPayment = async (req, res) => {
  try {
    const loan_id = Number(req.body.loan_id);
    const amount = Number(req.body.amount);
    const payment_date = req.body.payment_date || new Date().toISOString().slice(0, 10);

    if (!loan_id) {
      return redirectWith(res, "/loan-payments", "error", "Please select a loan.");
    }
    if (!amount || amount <= 0) {
      return redirectWith(res, "/loan-payments", "error", "Payment amount must be greater than 0.");
    }

    const loan = await loanModel.getLoanById(loan_id);
    if (!loan) {
      return redirectWith(res, "/loan-payments", "error", "Loan not found.");
    }
    if (loan.status !== "Approved") {
      return redirectWith(res, "/loan-payments", "error", "Payments can be recorded only for approved loans.");
    }

    await loanPaymentModel.createPayment({ loan_id, amount, payment_date });
    redirectWith(res, "/loan-payments", "success", "Loan payment recorded.");
  } catch (err) {
    console.error(err);
    redirectWith(res, "/loan-payments", "error", "Could not record payment.");
  }
};
