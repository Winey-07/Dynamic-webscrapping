// ==========================================
// websiteRoutes.js
// URL routes for website management
// ==========================================

const express = require("express");
const router = express.Router();
const websiteController = require("../controllers/websiteController");

// GET /api/websites
router.get("/", websiteController.getAllWebsites);

// GET /api/websites/:id
router.get("/:id", websiteController.getWebsiteById);

// POST /api/websites
router.post("/", websiteController.createWebsite);

// PUT /api/websites/:id 
router.put("/:id", websiteController.updateWebsite);

// DELETE /api/websites/:id
router.delete("/:id", websiteController.deleteWebsite);

module.exports = router;
