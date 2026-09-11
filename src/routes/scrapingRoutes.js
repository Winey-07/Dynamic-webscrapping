const express = require("express");
const router = express.Router();
const scrapingController = require("../controllers/scrapingController");

// POST /api/websites/:id/scrape
router.post("/websites/:id/scrape", scrapingController.scrapeWebsite);

module.exports = router;
