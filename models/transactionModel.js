const pool = require("../config/db");

const transactionModel = {
  async getAllTransactions() {
    const [rows] = await pool.query(
      `SELECT t.*, a.account_type, c.name AS customer_name
       FROM transactions t
       INNER JOIN accounts a ON t.account_id = a.account_id
       INNER JOIN customers c ON a.customer_id = c.customer_id
       ORDER BY t.transaction_id DESC`
    );
    return rows;
  },

  async getRecentTransactions(limit = 8) {
    const safeLimit = Number(limit) || 8;
    const [rows] = await pool.query(
      `SELECT t.transaction_id, t.account_id, t.transaction_type, t.amount,
              t.transaction_date, t.description
       FROM transactions t
       ORDER BY t.transaction_date DESC, t.transaction_id DESC
       LIMIT ${safeLimit}`
    );
    return rows;
  },

  async getByAccountId(accountId) {
    const [rows] = await pool.query(
      `SELECT * FROM transactions
       WHERE account_id = ?
       ORDER BY transaction_id DESC`,
      [accountId]
    );
    return rows;
  },

  async countTransactions() {
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM transactions");
    return rows[0].total;
  },

  // Deposit and withdraw run inside a MySQL transaction so the balance
  // update and the transactions row are saved together (or not at all).
  async deposit(accountId, amount, description) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [accounts] = await connection.query(
        "SELECT * FROM accounts WHERE account_id = ? FOR UPDATE",
        [accountId]
      );
      const account = accounts[0];
      if (!account) {
        throw new Error("Account not found.");
      }
      if (account.status !== "Active") {
        throw new Error("Only active accounts can receive deposits.");
      }

      await connection.query(
        "UPDATE accounts SET balance = balance + ? WHERE account_id = ?",
        [amount, accountId]
      );

      const [result] = await connection.query(
        `INSERT INTO transactions (account_id, transaction_type, amount, description)
         VALUES (?, 'Deposit', ?, ?)`,
        [accountId, amount, description]
      );

      await connection.commit();
      return result.insertId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  async withdraw(accountId, amount, description) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [accounts] = await connection.query(
        "SELECT * FROM accounts WHERE account_id = ? FOR UPDATE",
        [accountId]
      );
      const account = accounts[0];
      if (!account) {
        throw new Error("Account not found.");
      }
      if (account.status !== "Active") {
        throw new Error("Only active accounts can withdraw money.");
      }
      if (Number(account.balance) < Number(amount)) {
        throw new Error("Insufficient balance.");
      }

      await connection.query(
        "UPDATE accounts SET balance = balance - ? WHERE account_id = ?",
        [amount, accountId]
      );

      const [result] = await connection.query(
        `INSERT INTO transactions (account_id, transaction_type, amount, description)
         VALUES (?, 'Withdraw', ?, ?)`,
        [accountId, amount, description]
      );

      await connection.commit();
      return result.insertId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
};

module.exports = transactionModel;
