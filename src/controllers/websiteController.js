// ==========================================
// websiteController.js
// Handles HTTP requests for websites
// ==========================================

const websiteService = require("../services/websiteService");

const websiteController = {
  // GET /api/websites
  async getAllWebsites(req, res) {
    try {
      const websites = await websiteService.getAllWebsites();
      res.status(200).json(websites);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // GET /api/websites/:id
  async getWebsiteById(req, res) {
    try {
      const website = await websiteService.getWebsiteById(req.params.id);
      res.status(200).json(website);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  // POST /api/websites
  async createWebsite(req, res) {
    try {
      const newId = await websiteService.createWebsite(req.body);
      const newWebsite = await websiteService.getWebsiteById(newId);
      res.status(201).json(newWebsite); // 201 Created
    } catch (error) {
      res.status(400).json({ message: error.message }); // 400 Bad Request
    }
  },

  // PUT /api/websites/:id
  async updateWebsite(req, res) {
    try {
      const updatedWebsite = await websiteService.updateWebsite(
        req.params.id,
        req.body,
      );
      res.status(200).json(updatedWebsite);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  // DELETE /api/websites/:id
  async deleteWebsite(req, res) {
    try {
      await websiteService.deleteWebsite(req.params.id);
      res.status(200).json({ message: "Website deleted successfully" });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
};

module.exports = websiteController;
