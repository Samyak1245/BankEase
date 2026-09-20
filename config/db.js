const mysql = require("mysql2/promise");
require("dotenv").config();

// Connection pool is reused across models (parameterized queries only).
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true
});

module.exports = pool;
