// ==========================================
// scrapeTestRoutes.js
// Test routes for triggering scrapers
// ==========================================

const express = require("express");
const router = express.Router();
const { scrapeTestSite } = require("../services/cheerioScraper");

// GET /api/scrape-test
// Triggers the CheerioCrawler on Hacker News
router.get("/scrape-test", async (req, res) => {
  try {
    const maxPages = parseInt(req.query.maxPages) || 1;
    const data = await scrapeTestSite(maxPages);

    res.status(200).json({
      success: true,
      itemsFound: data.length,
      data: data,
    });
  } catch (error) {
    console.error("Scraping failed:", error);
    res.status(500).json({
      success: false,
      message: "Scraping failed",
      error: error.message,
    });
  }
});

module.exports = router;
