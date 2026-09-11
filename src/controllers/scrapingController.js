// ==========================================
// scrapingController.js
// Handles manual scrape triggers
// ==========================================

const websiteService = require("../services/websiteService");
const { scrapeWithCheerio } = require("../services/cheerioScraper");
const itemService = require("../services/itemService");

const scrapingController = {
  // POST /api/websites/:id/scrape
  async scrapeWebsite(req, res) {
    try {
      const websiteId = req.params.id;

      // 1. Get website config from DB
      const website = await websiteService.getWebsiteById(websiteId);

      // 2. Run the scraper
      const scrapedData = await scrapeWithCheerio(website);

      // 3. Process data (detect duplicates, save to DB)
      const stats = await itemService.processAndSaveItems(
        websiteId,
        scrapedData,
      );

      // 4. Send response
      res.status(200).json({
        success: true,
        website: website.name,
        itemsFound: stats.itemsFound,
        newItems: stats.newItems,
        message: `${stats.newItems} new items found`,
      });
    } catch (error) {
      console.error("Scraping error:", error);
      res.status(500).json({
        success: false,
        message: "Scraping failed",
        error: error.message,
      });
    }
  },
};

module.exports = scrapingController;
