const transactionModel = require("../models/transactionModel");
const accountModel = require("../models/accountModel");

function redirectWith(res, path, type, message) {
  return res.redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

exports.getTransactions = async (req, res) => {
  try {
    const [transactions, accounts] = await Promise.all([
      transactionModel.getAllTransactions(),
      accountModel.getAllAccounts()
    ]);
    res.render("transactions", {
      title: "Transactions",
      transactions,
      accounts
    });
  } catch (err) {
    console.error(err);
    redirectWith(res, "/", "error", "Could not load transactions.");
  }
};

exports.deposit = async (req, res) => {
  try {
    const account_id = Number(req.body.account_id);
    const amount = Number(req.body.amount);
    const description = (req.body.description || "Cash deposit").trim();

    if (!account_id) {
      return redirectWith(res, "/transactions", "error", "Please select an account.");
    }
    if (!amount || amount <= 0) {
      return redirectWith(res, "/transactions", "error", "Deposit amount must be greater than 0.");
    }

    await transactionModel.deposit(account_id, amount, description);
    redirectWith(res, "/transactions", "success", "Deposit completed successfully.");
  } catch (err) {
    console.error(err);
    redirectWith(res, "/transactions", "error", err.message || "Deposit failed.");
  }
};

exports.withdraw = async (req, res) => {
  try {
    const account_id = Number(req.body.account_id);
    const amount = Number(req.body.amount);
    const description = (req.body.description || "Cash withdrawal").trim();

    if (!account_id) {
      return redirectWith(res, "/transactions", "error", "Please select an account.");
    }
    if (!amount || amount <= 0) {
      return redirectWith(res, "/transactions", "error", "Withdrawal amount must be greater than 0.");
    }

    await transactionModel.withdraw(account_id, amount, description);
    redirectWith(res, "/transactions", "success", "Withdrawal completed successfully.");
  } catch (err) {
    console.error(err);
    redirectWith(res, "/transactions", "error", err.message || "Withdrawal failed.");
  }
};
