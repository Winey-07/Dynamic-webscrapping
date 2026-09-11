// ==========================================
// cheerioScraper.js
// Dynamic CheerioCrawler based on DB config
// ==========================================

const { CheerioCrawler } = require("crawlee");

// Now accepts a 'website' object containing config from MySQL
async function scrapeWithCheerio(website) {
  const scrapedItems = [];

  const crawler = new CheerioCrawler({
    maxRequestsPerCrawl: 1, // We will handle pagination in a later phase

    async requestHandler({ request, $, log }) {
      log.info(`Scraping ${website.name}: ${request.url}...`);

      // Use dynamic selectors from the database config
      // If a selector is empty, it gracefully falls back to null
      const titleSelector = website.title_selector || "a";
      const linkSelector = website.link_selector || "a";
      const descSelector = website.description_selector;
      const imgSelector = website.image_selector;
      const authorSelector = website.author_selector;
      const dateSelector = website.date_selector;

      // We find all elements matching the title selector
      $(titleSelector).each((index, element) => {
        const $el = $(element);

        // Extract data
        const title = $el.text().trim();

        // If the linkSelector is different from titleSelector, find the link inside
        // Otherwise, assume the title element IS the link
        const $linkEl =
          linkSelector === titleSelector
            ? $el
            : $el.find(linkSelector).first() ||
              $el.closest(linkSelector).first();
        let partialUrl = $linkEl.attr("href") || $el.attr("href");

        let absoluteUrl = "";
        if (partialUrl) {
          try {
            absoluteUrl = new URL(partialUrl, request.loadedUrl).href;
          } catch (e) {
            absoluteUrl = partialUrl;
          }
        }

        // Extract optional fields safely
        const description = descSelector
          ? $el.closest("tr").next().find(descSelector).text().trim()
          : null; // simplified logic
        const imageUrl = imgSelector
          ? $(imgSelector).first().attr("src")
          : null;
        const author = authorSelector ? $(authorSelector).text().trim() : null;
        const publishedAt = dateSelector
          ? $(dateSelector).attr("datetime") || $(dateSelector).text().trim()
          : null;

        // Push normalized data
        if (title && absoluteUrl) {
          scrapedItems.push({
            title,
            url: absoluteUrl,
            description: description || null,
            imageUrl: imageUrl
              ? new URL(imageUrl, request.loadedUrl).href
              : null,
            author: author || null,
            publishedAt: publishedAt || null,
          });
        }
      });
    },
  });

  // Run the crawler with the URL from the database
  await crawler.run([website.url]);

  return scrapedItems;
}

module.exports = { scrapeWithCheerio };
