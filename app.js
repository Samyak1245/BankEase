const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

const customerRoutes = require("./routes/customerRoutes");
const accountRoutes = require("./routes/accountRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const loanRoutes = require("./routes/loanRoutes");
const loanPaymentRoutes = require("./routes/loanPaymentRoutes");
const branchRoutes = require("./routes/branchRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const customerModel = require("./models/customerModel");
const accountModel = require("./models/accountModel");
const transactionModel = require("./models/transactionModel");
const loanModel = require("./models/loanModel");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "boilerplate");
app.use(expressLayouts);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Flash-style messages via query string (no session/auth needed).
app.use((req, res, next) => {
  res.locals.success = req.query.success || null;
  res.locals.error = req.query.error || null;
  res.locals.currentPath = req.path;
  next();
});

app.get("/", async (req, res) => {
  try {
    const [totalCustomers, totalAccounts, totalTransactions, activeLoans, recentTransactions] =
      await Promise.all([
        customerModel.countCustomers(),
        accountModel.countAccounts(),
        transactionModel.countTransactions(),
        loanModel.countActiveLoans(),
        transactionModel.getRecentTransactions(8)
      ]);

    res.render("dashboard", {
      title: "Dashboard",
      stats: {
        totalCustomers,
        totalAccounts,
        totalTransactions,
        activeLoans
      },
      recentTransactions
    });
  } catch (err) {
    console.error(err);
    res.render("dashboard", {
      title: "Dashboard",
      stats: {
        totalCustomers: 0,
        totalAccounts: 0,
        totalTransactions: 0,
        activeLoans: 0
      },
      recentTransactions: [],
      error: "Could not load dashboard. Check MySQL connection and .env settings."
    });
  }
});

app.get("/logout", (req, res) => {
  res.redirect("/?success=" + encodeURIComponent("Demo project has no login. You are still on the dashboard."));
});

app.use("/customers", customerRoutes);
app.use("/accounts", accountRoutes);
app.use("/transactions", transactionRoutes);
app.use("/loans", loanRoutes);
app.use("/loan-payments", loanPaymentRoutes);
app.use("/branches", branchRoutes);
app.use("/employees", employeeRoutes);

app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong. Please check the server logs and MySQL connection.");
});

app.listen(PORT, () => {
  console.log(`Banking Management System running at http://localhost:${PORT}`);
});
