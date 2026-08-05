const express = require("express");
const router = express.Router();

const { search } = require("../controllers/searchController");

// ==========================================
// SEARCH ROUTES
// ==========================================
// Global search route for users, memories, and places.

router.get("/", search);

module.exports = router;