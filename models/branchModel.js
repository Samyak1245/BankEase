const pool = require("../config/db");

const branchModel = {
  async getAllBranches() {
    const [rows] = await pool.query(
      `SELECT b.*,
              (SELECT COUNT(*) FROM employees e WHERE e.branch_id = b.branch_id) AS employee_count
       FROM branches b
       ORDER BY b.branch_id DESC`
    );
    return rows;
  },

  async getBranchById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM branches WHERE branch_id = ?",
      [id]
    );
    return rows[0] || null;
  },

  async createBranch(data) {
    const [result] = await pool.query(
      "INSERT INTO branches (branch_name, city, address) VALUES (?, ?, ?)",
      [data.branch_name, data.city, data.address]
    );
    return result.insertId;
  },

  async updateBranch(id, data) {
    const [result] = await pool.query(
      "UPDATE branches SET branch_name = ?, city = ?, address = ? WHERE branch_id = ?",
      [data.branch_name, data.city, data.address, id]
    );
    return result.affectedRows;
  },

  async deleteBranch(id) {
    const [result] = await pool.query(
      "DELETE FROM branches WHERE branch_id = ?",
      [id]
    );
    return result.affectedRows;
  }
};

module.exports = branchModel;
