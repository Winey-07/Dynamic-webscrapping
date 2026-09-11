// ==========================================
// app.js
// Express application configuration
// ==========================================

// Load environment variables from .env file
// This must be called before any code that uses process.env
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Create the Express application
const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

// Enable CORS (Cross-Origin Resource Sharing)
// This allows the frontend (running on a different port) to make
// requests to this backend API
app.use(cors());

// Parse incoming JSON bodies
// When a client sends a POST request with JSON data,
// this middleware parses the JSON and makes it available as req.body
app.use(express.json());

// Parse incoming URL-encoded bodies (form data)
// The 'extended: true' option allows rich objects and arrays
// to be encoded into the URL-encoded format
app.use(express.urlencoded({ extended: true }));

// ==========================================
// ROUTES
// ==========================================

// Health check / test route
// const testRoutes = require("./routes/testRoutes");
// app.use("/api", testRoutes);

// Website CRUD Routes
const websiteRoutes = require("./routes/websiteRoutes");
app.use("/api/websites", websiteRoutes);

// Scraping Routes
const scrapingRoutes = require("./routes/scrapingRoutes");
app.use("/api", scrapingRoutes);

// ==========================================
// EXPORT
// ==========================================

// Export the app so server.js can start it
module.exports = app;
