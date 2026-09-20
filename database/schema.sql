-- ============================================================
-- Banking Management System
-- Database: banking_db
-- College DBMS mini-project schema
-- ============================================================
-- This file demonstrates:
--   * Primary keys and AUTO_INCREMENT
--   * Foreign keys (1:N relationships)
--   * UNIQUE / NOT NULL / DEFAULT / CHECK constraints
--   * Indexes for faster lookups
--   * A VIEW (JOIN + GROUP BY + COUNT/SUM/AVG)
--   * A TRIGGER (cannot store a negative balance)
--   * A STORED PROCEDURE (subquery + SUM)
-- ============================================================

CREATE DATABASE IF NOT EXISTS banking_db;
USE banking_db;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS loan_payments;
DROP TABLE IF EXISTS loans;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS branches;
DROP VIEW IF EXISTS vw_customer_account_summary;
DROP TRIGGER IF EXISTS trg_prevent_negative_balance;
DROP PROCEDURE IF EXISTS sp_customer_total_balance;
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- Table 1: customers  (one customer can have many accounts/loans)
-- ------------------------------------------------------------
CREATE TABLE customers (
  customer_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  address VARCHAR(255),
  date_of_birth DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Table 2: accounts  (Customer 1:N Account)
-- ------------------------------------------------------------
CREATE TABLE accounts (
  account_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  account_type VARCHAR(20) NOT NULL,
  balance DECIMAL(12,2) DEFAULT 0,
  opening_date DATE,
  status VARCHAR(20) DEFAULT 'Active',
  CONSTRAINT fk_accounts_customer
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  CONSTRAINT chk_account_type
    CHECK (account_type IN ('Savings', 'Current')),
  CONSTRAINT chk_account_balance
    CHECK (balance >= 0),
  CONSTRAINT chk_account_status
    CHECK (status IN ('Active', 'Closed', 'Frozen'))
);

-- ------------------------------------------------------------
-- Table 3: transactions  (Account 1:N Transaction)
-- ------------------------------------------------------------
CREATE TABLE transactions (
  transaction_id INT PRIMARY KEY AUTO_INCREMENT,
  account_id INT NOT NULL,
  transaction_type VARCHAR(20) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description VARCHAR(255),
  CONSTRAINT fk_transactions_account
    FOREIGN KEY (account_id) REFERENCES accounts(account_id),
  CONSTRAINT chk_transaction_type
    CHECK (transaction_type IN ('Deposit', 'Withdraw')),
  CONSTRAINT chk_transaction_amount
    CHECK (amount > 0)
);

-- ------------------------------------------------------------
-- Table 4: loans  (Customer 1:N Loan)
-- ------------------------------------------------------------
CREATE TABLE loans (
  loan_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  loan_type VARCHAR(30) NOT NULL,
  loan_amount DECIMAL(12,2) NOT NULL,
  interest_rate DECIMAL(5,2),
  tenure_months INT,
  status VARCHAR(20) DEFAULT 'Pending',
  application_date DATE,
  CONSTRAINT fk_loans_customer
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  CONSTRAINT chk_loan_type
    CHECK (loan_type IN ('Home', 'Education', 'Personal', 'Vehicle')),
  CONSTRAINT chk_loan_amount
    CHECK (loan_amount > 0),
  CONSTRAINT chk_loan_status
    CHECK (status IN ('Pending', 'Approved', 'Rejected'))
);

-- ------------------------------------------------------------
-- Table 5: loan_payments  (Loan 1:N LoanPayment)
-- ------------------------------------------------------------
CREATE TABLE loan_payments (
  payment_id INT PRIMARY KEY AUTO_INCREMENT,
  loan_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  payment_date DATE,
  payment_status VARCHAR(20) DEFAULT 'Paid',
  CONSTRAINT fk_payments_loan
    FOREIGN KEY (loan_id) REFERENCES loans(loan_id),
  CONSTRAINT chk_payment_amount
    CHECK (amount > 0)
);

-- ------------------------------------------------------------
-- Table 6: branches
-- ------------------------------------------------------------
CREATE TABLE branches (
  branch_id INT PRIMARY KEY AUTO_INCREMENT,
  branch_name VARCHAR(100) NOT NULL,
  city VARCHAR(50) NOT NULL,
  address VARCHAR(255)
);

-- ------------------------------------------------------------
-- Table 7: employees  (Branch 1:N Employee)
-- ------------------------------------------------------------
CREATE TABLE employees (
  employee_id INT PRIMARY KEY AUTO_INCREMENT,
  branch_id INT,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50),
  email VARCHAR(100),
  CONSTRAINT fk_employees_branch
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
);

-- ------------------------------------------------------------
-- INDEXING (useful for search and JOIN columns)
-- ------------------------------------------------------------
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_accounts_customer ON accounts(customer_id);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_loans_customer ON loans(customer_id);
CREATE INDEX idx_loan_payments_loan ON loan_payments(loan_id);
CREATE INDEX idx_employees_branch ON employees(branch_id);

-- ------------------------------------------------------------
-- VIEW: one row per customer with COUNT / SUM / AVG of accounts
-- Demonstrates JOIN + GROUP BY + aggregate functions.
-- ------------------------------------------------------------
CREATE VIEW vw_customer_account_summary AS
SELECT
  c.customer_id,
  c.name AS customer_name,
  COUNT(a.account_id) AS total_accounts,
  COALESCE(SUM(a.balance), 0) AS total_balance,
  COALESCE(AVG(a.balance), 0) AS average_balance
FROM customers c
LEFT JOIN accounts a ON c.customer_id = a.customer_id
GROUP BY c.customer_id, c.name;

-- ------------------------------------------------------------
-- TRIGGER: extra safety so balance can never become negative
-- even if an UPDATE bypasses application checks.
-- ------------------------------------------------------------
DELIMITER $$
CREATE TRIGGER trg_prevent_negative_balance
BEFORE UPDATE ON accounts
FOR EACH ROW
BEGIN
  IF NEW.balance < 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Account balance cannot be negative';
  END IF;
END$$
DELIMITER ;

-- ------------------------------------------------------------
-- STORED PROCEDURE: total balance of a customer using a subquery
-- Call example: CALL sp_customer_total_balance(1);
-- ------------------------------------------------------------
DELIMITER $$
CREATE PROCEDURE sp_customer_total_balance(IN p_customer_id INT)
BEGIN
  SELECT
    c.customer_id,
    c.name,
    (
      SELECT COALESCE(SUM(a.balance), 0)
      FROM accounts a
      WHERE a.customer_id = c.customer_id
    ) AS total_balance
  FROM customers c
  WHERE c.customer_id = p_customer_id;
END$$
DELIMITER ;

-- Normalization note (for viva/report):
-- 1NF: atomic columns, no repeating groups
-- 2NF: every non-key column depends on the whole primary key
-- 3NF: no transitive dependency (e.g. customer name is not stored in accounts)
