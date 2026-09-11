// ==========================================
// server.js
// Server entry point - starts the HTTP server
// ==========================================

// Import the configured Express app
const app = require("./app");

// Get the port from environment variables
// If PORT is not defined in .env, default to 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log("========================================");
  console.log("  Web Scraper API Server");
  console.log("========================================");
  console.log(`  Server running on port ${PORT}`);
  console.log(`  Test URL: http://localhost:${PORT}/api/websites`);
  console.log("========================================");
  console.log("");
});

// Handle unhandled rejections (async errors not caught by try/catch)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
});

// Handle uncaught exceptions (synchronous errors)
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});
