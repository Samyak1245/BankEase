const pool = require("../config/db");

const customerModel = {
  async getAllCustomers(search) {
    if (search) {
      const like = `%${search}%`;
      const [rows] = await pool.query(
        `SELECT * FROM customers
         WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?
         ORDER BY customer_id DESC`,
        [like, like, like]
      );
      return rows;
    }

    const [rows] = await pool.query(
      "SELECT * FROM customers ORDER BY customer_id DESC"
    );
    return rows;
  },

  async getCustomerById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM customers WHERE customer_id = ?",
      [id]
    );
    return rows[0] || null;
  },

  async createCustomer(data) {
    const [result] = await pool.query(
      `INSERT INTO customers (name, email, phone, address, date_of_birth)
       VALUES (?, ?, ?, ?, ?)`,
      [data.name, data.email, data.phone, data.address, data.date_of_birth]
    );
    return result.insertId;
  },

  async updateCustomer(id, data) {
    const [result] = await pool.query(
      `UPDATE customers
       SET name = ?, email = ?, phone = ?, address = ?, date_of_birth = ?
       WHERE customer_id = ?`,
      [data.name, data.email, data.phone, data.address, data.date_of_birth, id]
    );
    return result.affectedRows;
  },

  async deleteCustomer(id) {
    const [result] = await pool.query(
      "DELETE FROM customers WHERE customer_id = ?",
      [id]
    );
    return result.affectedRows;
  },

  async countCustomers() {
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM customers");
    return rows[0].total;
  }
};

module.exports = customerModel;
