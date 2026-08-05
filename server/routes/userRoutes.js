const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const {
  getMyProfile,
  updateProfile,
  updateProfileImage,
  updateCoverImage,
  checkUsername,
} = require("../controllers/userController");

// ==========================================
// USER ROUTES
// ==========================================
// Routes for managing the authenticated user's profile and validating usernames.

// Public route to check username availability
router.get("/check-username", checkUsername);

// Protected routes for profile management
router.get("/profile", protect, getMyProfile);
router.put("/profile", protect, updateProfile);

// Image upload routes using Multer middleware
router.put("/profile/image", protect, upload.single("image"), updateProfileImage);
router.put("/profile/cover", protect, upload.single("image"), updateCoverImage);

module.exports = router;