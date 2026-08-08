const express = require("express");
const router = express.Router();

const { search } = require("../controllers/searchController");
const { protectOptional } = require("../middleware/authMiddleware");

// ==========================================
// SEARCH ROUTES
// ==========================================
// Global search route for users, memories, and places.

router.get("/", protectOptional, search);

module.exports = router;