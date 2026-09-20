const pool = require("../config/db");

const employeeModel = {
  async getAllEmployees() {
    const [rows] = await pool.query(
      `SELECT e.*, b.branch_name, b.city
       FROM employees e
       LEFT JOIN branches b ON e.branch_id = b.branch_id
       ORDER BY e.employee_id DESC`
    );
    return rows;
  },

  async createEmployee(data) {
    const [result] = await pool.query(
      "INSERT INTO employees (branch_id, name, role, email) VALUES (?, ?, ?, ?)",
      [data.branch_id, data.name, data.role, data.email]
    );
    return result.insertId;
  },

  async updateEmployee(id, data) {
    const [result] = await pool.query(
      "UPDATE employees SET branch_id = ?, name = ?, role = ?, email = ? WHERE employee_id = ?",
      [data.branch_id, data.name, data.role, data.email, id]
    );
    return result.affectedRows;
  },

  async deleteEmployee(id) {
    const [result] = await pool.query(
      "DELETE FROM employees WHERE employee_id = ?",
      [id]
    );
    return result.affectedRows;
  }
};

module.exports = employeeModel;
