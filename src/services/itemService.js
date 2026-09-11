// ==========================================
// itemService.js
// Handles duplicate detection and saving logic
// ==========================================

const ItemModel = require("../models/itemModel");
const { normalizeUrl } = require("../utils/urlNormalizer");
const { createContentHash } = require("../utils/hash");

const ItemService = {
  /**
   * @param {number} websiteId
   * @param {Array} scrapedItems - Array from Crawlee: [{title, url, ...}]
   * @returns {Object} - { itemsFound, newItems }
   */
  async processAndSaveItems(websiteId, scrapedItems) {
    // 1. Get existing items from database
    const existingItems = await ItemModel.getExistingItems(websiteId);

    // Create a Set of existing URLs and Hashes for fast O(1) lookup
    const existingUrls = new Set();
    const existingHashes = new Set();

    existingItems.forEach((item) => {
      if (item.url) existingUrls.add(item.url);
      if (item.content_hash) existingHashes.add(item.content_hash);
    });

    // 2. Filter out duplicates
    const newItemsToInsert = [];

    for (const item of scrapedItems) {
      // Normalize the scraped URL
      const normalizedUrl = normalizeUrl(item.url);

      // Generate a hash for this item
      const contentHash = createContentHash({
        title: item.title,
        url: normalizedUrl,
        publishedAt: item.publishedAt,
      });

      // DUPLICATE DETECTION LOGIC
      // If the URL OR the Hash already exists in the DB, skip it
      const isDuplicateUrl = existingUrls.has(normalizedUrl);
      const isDuplicateHash = existingHashes.has(contentHash);

      if (!isDuplicateUrl && !isDuplicateHash) {
        // It's a new item! Add it to our insert list
        newItemsToInsert.push({
          website_id: websiteId,
          title: item.title,
          url: normalizedUrl,
          description: item.description,
          image_url: item.imageUrl,
          author: item.author,
          published_at: item.publishedAt,
          content_hash: contentHash,
        });

        // Add to Sets so we don't accidentally insert duplicates
        // found on the same page twice
        existingUrls.add(normalizedUrl);
        existingHashes.add(contentHash);
      }
    }

    // 3. Insert new items into the database
    if (newItemsToInsert.length > 0) {
      await ItemModel.insertItems(newItemsToInsert);
    }

    // 4. Return the statistics
    return {
      itemsFound: scrapedItems.length,
      newItems: newItemsToInsert.length,
    };
  },
};

module.exports = ItemService;
