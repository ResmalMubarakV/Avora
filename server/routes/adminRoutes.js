const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const { 
  getDashboard,
  getUsers,
  approveUser,
  suspendUser,
  deleteUser,
  getMemories,
  deleteMemory,
  updateAdminPassword,
} = require("../controllers/adminController");

// ==========================================
// ADMIN ROUTES
// ==========================================
router.get("/dashboard", protect, admin, getDashboard);
router.get("/users", protect, admin, getUsers);
router.patch("/users/:id/approve", protect, admin, approveUser);
router.patch("/users/:id/suspend", protect, admin, suspendUser);
router.delete("/users/:id", protect, admin, deleteUser); // Added Delete User Route

router.get("/memories", protect, admin, getMemories);
router.delete("/memories/:id", protect, admin, deleteMemory);

router.put("/password", protect, admin, updateAdminPassword);

module.exports = router;