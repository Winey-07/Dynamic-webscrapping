// ==========================================
// database.js
// MySQL Database Connection Pool
// ==========================================

const mysql = require("mysql2");
require("dotenv").config();

// Create a connection pool
// A pool manages multiple connections, so we don't have to open/close
// a new connection for every single database query.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export the pool with promises enabled
// This allows us to use async/await with database queries
module.exports = pool.promise();
