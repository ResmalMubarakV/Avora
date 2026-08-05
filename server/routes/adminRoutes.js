const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const { 
  getDashboard,
  getUsers,
  approveUser,
  suspendUser,
  getMemories,
  deleteMemory,
} = require("../controllers/adminController");

// ==========================================
// ADMIN ROUTES
// ==========================================
router.get("/dashboard", protect, admin, getDashboard);
router.get("/users", protect, admin, getUsers);
router.patch("/users/:id/approve", protect, admin, approveUser);
router.patch("/users/:id/suspend", protect, admin, suspendUser);

router.get("/memories", protect, admin, getMemories);
router.delete("/memories/:id", protect, admin, deleteMemory);

module.exports = router;