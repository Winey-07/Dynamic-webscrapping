// ==========================================
// The "Traffic Cop" that chooses the right crawler
// ==========================================

const { scrapeWithCheerio } = require("./cheerioScraper");
const { scrapeWithPlaywright } = require("./playwrightScraper");

const scraperService = {
  /**
   * Decides which crawler to use based on database config,
   * runs the scrape, and returns the normalized data.
   * @param {Object} website - The website config from MySQL
   * @returns {Array} - Array of scraped items
   */
  async scrapeWebsite(website) {
    let scrapedData = [];

    // 1. TRAFFIC COP: Check the database configuration
    if (website.crawler_type === "playwright") {
      console.log(
        `[ScraperService] Using PlaywrightCrawler for ${website.name}...`,
      );
      scrapedData = await scrapeWithPlaywright(website);
    } else if (website.crawler_type === "cheerio") {
      console.log(
        `[ScraperService] Using CheerioCrawler for ${website.name}...`,
      );
      scrapedData = await scrapeWithCheerio(website);
    } else {
      // If someone typed a weird crawler_type in the database, throw an error
      throw new Error(`Unsupported crawler type: ${website.crawler_type}`);
    }

    // 2. Return the normalized data
    return scrapedData;
  },
};

module.exports = scraperService;
