const pool = require("../config/db");

const loanPaymentModel = {
  async getAllPayments() {
    const [rows] = await pool.query(
      `SELECT p.*, l.loan_type, l.loan_amount, c.name AS customer_name
       FROM loan_payments p
       INNER JOIN loans l ON p.loan_id = l.loan_id
       INNER JOIN customers c ON l.customer_id = c.customer_id
       ORDER BY p.payment_id DESC`
    );
    return rows;
  },

  async createPayment(data) {
    const [result] = await pool.query(
      `INSERT INTO loan_payments (loan_id, amount, payment_date, payment_status)
       VALUES (?, ?, ?, 'Paid')`,
      [data.loan_id, data.amount, data.payment_date]
    );
    return result.insertId;
  }
};

module.exports = loanPaymentModel;
