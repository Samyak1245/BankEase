const accountModel = require("../models/accountModel");
const customerModel = require("../models/customerModel");
const transactionModel = require("../models/transactionModel");

function redirectWith(res, path, type, message) {
  return res.redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

exports.getAccounts = async (req, res) => {
  try {
    const search = (req.query.q || "").trim();
    const [accounts, customers] = await Promise.all([
      accountModel.getAllAccounts(search),
      customerModel.getAllCustomers()
    ]);
    res.render("accounts", {
      title: "Accounts",
      accounts,
      customers,
      search,
      detailsAccount: null,
      accountTransactions: []
    });
  } catch (err) {
    console.error(err);
    redirectWith(res, "/", "error", "Could not load accounts.");
  }
};

exports.getNewAccount = async (req, res) => {
  try {
    const [accounts, customers] = await Promise.all([
      accountModel.getAllAccounts(),
      customerModel.getAllCustomers()
    ]);
    res.render("accounts", {
      title: "Create Account",
      accounts,
      customers,
      search: "",
      detailsAccount: null,
      accountTransactions: [],
      openAdd: "account"
    });
  } catch (err) {
    console.error(err);
    redirectWith(res, "/accounts", "error", "Could not open create account form.");
  }
};

exports.createAccount = async (req, res) => {
  try {
    const customer_id = Number(req.body.customer_id);
    const account_type = req.body.account_type;
    const balance = Number(req.body.balance);
    const opening_date = req.body.opening_date || new Date().toISOString().slice(0, 10);
    const status = req.body.status || "Active";

    if (!customer_id || !account_type) {
      return redirectWith(res, "/accounts", "error", "Customer and account type are required.");
    }
    if (!["Savings", "Current"].includes(account_type)) {
      return redirectWith(res, "/accounts", "error", "Account type must be Savings or Current.");
    }
    if (Number.isNaN(balance) || balance < 0) {
      return redirectWith(res, "/accounts", "error", "Opening balance cannot be negative.");
    }

    await accountModel.createAccount({
      customer_id,
      account_type,
      balance,
      opening_date,
      status
    });
    redirectWith(res, "/accounts", "success", "Account created successfully.");
  } catch (err) {
    console.error(err);
    redirectWith(res, "/accounts", "error", "Could not create account.");
  }
};

exports.getAccountDetails = async (req, res) => {
  try {
    const detailsAccount = await accountModel.getAccountById(req.params.id);
    if (!detailsAccount) {
      return redirectWith(res, "/accounts", "error", "Account not found.");
    }
    const [accounts, customers, accountTransactions] = await Promise.all([
      accountModel.getAllAccounts(),
      customerModel.getAllCustomers(),
      transactionModel.getByAccountId(req.params.id)
    ]);
    res.render("accounts", {
      title: "Account Details",
      accounts,
      customers,
      search: "",
      detailsAccount,
      accountTransactions
    });
  } catch (err) {
    console.error(err);
    redirectWith(res, "/accounts", "error", "Could not load account details.");
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const account_type = req.body.account_type;
    const status = req.body.status;
    const opening_date = req.body.opening_date || null;

    if (!["Savings", "Current"].includes(account_type)) {
      return redirectWith(res, "/accounts", "error", "Account type must be Savings or Current.");
    }
    if (!["Active", "Closed", "Frozen"].includes(status)) {
      return redirectWith(res, "/accounts", "error", "Invalid account status.");
    }

    await accountModel.updateAccount(req.params.id, {
      account_type,
      status,
      opening_date
    });
    redirectWith(res, "/accounts", "success", "Account updated successfully.");
  } catch (err) {
    console.error(err);
    redirectWith(res, "/accounts", "error", "Could not update account.");
  }
};
