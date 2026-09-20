const pool = require("../config/db");

const accountModel = {
  async getAllAccounts(search) {
    // JOIN customers so the table can show customer name (1:N relationship).
    let sql = `
      SELECT a.*, c.name AS customer_name, c.email AS customer_email
      FROM accounts a
      INNER JOIN customers c ON a.customer_id = c.customer_id
    `;
    const params = [];

    if (search) {
      sql += ` WHERE a.account_id = ? OR c.name LIKE ? OR a.account_type LIKE ? OR a.status LIKE ?`;
      params.push(Number(search) || 0, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += " ORDER BY a.account_id DESC";
    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async getAccountById(id) {
    const [rows] = await pool.query(
      `SELECT a.*, c.name AS customer_name, c.email AS customer_email, c.phone AS customer_phone
       FROM accounts a
       INNER JOIN customers c ON a.customer_id = c.customer_id
       WHERE a.account_id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async createAccount(data) {
    const [result] = await pool.query(
      `INSERT INTO accounts (customer_id, account_type, balance, opening_date, status)
       VALUES (?, ?, ?, ?, ?)`,
      [data.customer_id, data.account_type, data.balance, data.opening_date, data.status]
    );
    return result.insertId;
  },

  async updateAccount(id, data) {
    const [result] = await pool.query(
      `UPDATE accounts
       SET account_type = ?, status = ?, opening_date = ?
       WHERE account_id = ?`,
      [data.account_type, data.status, data.opening_date, id]
    );
    return result.affectedRows;
  },

  async countAccounts() {
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM accounts");
    return rows[0].total;
  }
};

module.exports = accountModel;
