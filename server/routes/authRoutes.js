const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { passwordResetLimiter } = require("../middleware/rateLimiter");

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================
// Public routes for user registration, login, and password management.

router.post("/register", registerUser);
router.post("/login", loginUser);

// Password Reset Flow (Protected with 24-hour rate limiter)
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;