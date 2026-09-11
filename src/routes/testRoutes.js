// ==========================================
// testRoutes.js
// Test routes to verify server and database
// ==========================================

const express = require("express");
const router = express.Router();

// Import the database pool
const db = require("../config/database");

// ==========================================
// GET /api/test
// ==========================================
// Purpose: Server health check
// router.get("/test", (req, res) => {
//   res.status(200).json({
//     message: "API is working",
//     timestamp: new Date().toISOString(),
//     status: "success",
//   });
// });

// ==========================================
// GET /api/db-test
// ==========================================

// Purpose: Database connection health check
// Runs a simple query to verify MySQL is connected


// router.get("/db-test", async (req, res) => {
//   try {
//     // Execute a simple query
//     const [rows] = await db.query("SELECT 1 + 1 AS result");

//     res.status(200).json({
//       message: "Database connection successful!",
//       databaseResult: rows[0].result,
//       status: "success",
//     });
//   } catch (error) {
//     console.error("Database connection error:", error);
//     res.status(500).json({
//       message: "Database connection failed",
//       error: error.message,
//       status: "error",
//     });
//   }
// });

// module.exports = router;
