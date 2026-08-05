const express = require("express");
const router = express.Router();

const { generateAI } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

// ==========================================
// AI ROUTES
// ==========================================
// Protected route to handle AI chat generation requests.

router.post("/", protect, generateAI);

module.exports = router;