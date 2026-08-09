const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const {
  getMemories,
  createMemory,
  getMemoryById,
  toggleLikeMemory,
  togglePinMemory,
  updateMemory,
  downloadMedia,
  deleteMemory,
  deleteMedia,
} = require("../controllers/memoryController");

// ==========================================
// MEMORY ROUTES
// ==========================================
router.post(
  "/",
  protect,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "media", maxCount: 20 },
  ]),
  createMemory
);

router.get("/", protect, getMemories);
router.get("/:id", protect, getMemoryById);

router.patch("/:id/like", protect, toggleLikeMemory);
router.patch("/:id/pin", protect, togglePinMemory);

router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "media", maxCount: 20 },
  ]),
  updateMemory
);

router.get("/download/:memoryId/:mediaId", protect, downloadMedia);
router.delete("/:id", protect, deleteMemory);
router.delete("/:id/media", protect, deleteMedia);

module.exports = router;