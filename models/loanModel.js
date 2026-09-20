const pool = require("../config/db");

const loanModel = {
  async getAllLoans(search) {
    let sql = `
      SELECT l.*, c.name AS customer_name
      FROM loans l
      INNER JOIN customers c ON l.customer_id = c.customer_id
    `;
    const params = [];

    if (search) {
      sql += ` WHERE c.name LIKE ? OR l.loan_type LIKE ? OR l.status LIKE ?`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += " ORDER BY l.loan_id DESC";
    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async getLoanById(id) {
    const [rows] = await pool.query(
      `SELECT l.*, c.name AS customer_name
       FROM loans l
       INNER JOIN customers c ON l.customer_id = c.customer_id
       WHERE l.loan_id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async createLoan(data) {
    const [result] = await pool.query(
      `INSERT INTO loans (customer_id, loan_type, loan_amount, interest_rate, tenure_months, status, application_date)
       VALUES (?, ?, ?, ?, ?, 'Pending', ?)`,
      [
        data.customer_id,
        data.loan_type,
        data.loan_amount,
        data.interest_rate,
        data.tenure_months,
        data.application_date
      ]
    );
    return result.insertId;
  },

  async updateStatus(id, status) {
    const [result] = await pool.query(
      "UPDATE loans SET status = ? WHERE loan_id = ?",
      [status, id]
    );
    return result.affectedRows;
  },

  async countActiveLoans() {
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS total FROM loans WHERE status = 'Approved'"
    );
    return rows[0].total;
  }
};

module.exports = loanModel;
