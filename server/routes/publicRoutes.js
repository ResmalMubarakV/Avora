const express = require("express");
const router = express.Router();

const {
  getFeaturedTravelers,
  getPublicProfile,
  getPublicMemory,
} = require("../controllers/publicController");
const { protectOptional } = require("../middleware/authMiddleware");

// ==========================================
// PARAM SANITIZATION FOR USERNAMES WITH DOTS
// ==========================================
// This ensures Express doesn't treat dots as file extensions
router.param("username", (req, res, next, username) => {
  req.params.username = username;
  next();
});

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.get("/travelers", getFeaturedTravelers);
router.get("/:username", protectOptional, getPublicProfile);
router.get("/:username/:slug", protectOptional, getPublicMemory);

module.exports = router;