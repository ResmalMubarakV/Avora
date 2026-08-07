const express = require("express");
const router = express.Router();

const {
  getFeaturedTravelers,
  getPublicProfile,
  getPublicMemory,
} = require("../controllers/publicController");
const { protectOptional } = require("../middleware/authMiddleware");

// ==========================================
// PUBLIC ROUTES
// ==========================================
// Routes for viewing public profiles and memories. 
// protectOptional is used to reveal private data if the owner is the one viewing it.

router.get("/travelers", getFeaturedTravelers);
router.get("/:username([a-zA-Z0-9._-]+)", protectOptional, getPublicProfile);
router.get("/:username([a-zA-Z0-9._-]+)/:slug", protectOptional, getPublicMemory);

module.exports = router;