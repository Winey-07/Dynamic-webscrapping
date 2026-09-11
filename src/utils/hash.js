// ==========================================
// hash.js
// Generates SHA-256 hashes for content
// ==========================================

const crypto = require("crypto");  // 

/**
 * Creates a hash based on title + url + publishedAt
 * Used as a secondary duplicate detection method
 */
function createContentHash(item) {
  const dataString = `${item.title || ""}|${item.url || ""}|${item.publishedAt || ""}`;
  return crypto.createHash("sha256").update(dataString).digest("hex");
}

module.exports = { createContentHash };
