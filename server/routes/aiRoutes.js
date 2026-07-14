const express = require("express");
const router = express.Router();

const { generateAI } = require("../controllers/aiController");

const {protect} = require("../middleware/authMiddleware");

router.post("/", protect , generateAI);

module.exports = router;