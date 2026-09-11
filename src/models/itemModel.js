// ==========================================
// itemModel.js
// SQL queries for scraped_items table
// ==========================================

const db = require("../config/database");

const ItemModel = {
  // Get all existing items for a specific website
  // We only need the url and content_hash to check for duplicates
  async getExistingItems(websiteId) {
    const [rows] = await db.query(
      "SELECT url, content_hash FROM scraped_items WHERE website_id = ?",
      [websiteId],
    );
    return rows;
  },

  // Insert multiple new items at once (Bulk Insert)
  async insertItems(items) {
    if (items.length === 0) return 0;

    // Map our array of objects into an array of arrays for MySQL
    const values = items.map((item) => [
      item.website_id,
      item.title,
      item.url,
      item.description,
      item.image_url,
      item.author,
      item.published_at,
      item.content_hash,
    ]);

    const [result] = await db.query(
      `INSERT INTO scraped_items 
            (website_id, title, url, description, image_url, author, published_at, content_hash) 
            VALUES ?`,
      [values],
    );

    return result.affectedRows;
  },
};

module.exports = ItemModel;
