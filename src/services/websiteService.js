// ==========================================
// websiteService.js
// Business logic for websites
// ==========================================

const WebsiteModel = require("../models/websiteModel");

const WebsiteService = {
  async getAllWebsites() {
    return await WebsiteModel.getAllWebsites();
  },

  async getWebsiteById(id) {
    const website = await WebsiteModel.getWebsiteById(id);
    if (!website) {
      throw new Error("Website not found");
    }
    return website;
  },

  async createWebsite(websiteData) {
    // Basic validation
    if (!websiteData.name || !websiteData.url || !websiteData.crawler_type) {
      throw new Error("Name, URL, and Crawler Type are required");
    }
    return await WebsiteModel.createWebsite(websiteData);
  },

  async updateWebsite(id, websiteData) {
    const affectedRows = await WebsiteModel.updateWebsite(id, websiteData);
    if (affectedRows === 0) {
      throw new Error("Website not found or no changes made");
    }
    return await WebsiteModel.getWebsiteById(id); // Return the updated row
  },

  async deleteWebsite(id) {
    const affectedRows = await WebsiteModel.deleteWebsite(id);
    if (affectedRows === 0) {
      throw new Error("Website not found");
    }
    return true;
  },
};

module.exports = WebsiteService;
