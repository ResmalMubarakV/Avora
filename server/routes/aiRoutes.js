const express = require("express");
const router = express.Router();

const { generateAI } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

// ==========================================
// AI ROUTES
// ==========================================
// Health check route for AI endpoint status
router.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "Avora AI Service is active" });
});

// Protected route to handle AI chat generation requests
router.post("/", protect, generateAI);

module.exports = router;