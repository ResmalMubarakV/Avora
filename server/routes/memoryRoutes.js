const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const {
  getMemories,
  createMemory,
  getMemoryById,
  updateMemory,
  downloadMedia,
  deleteMemory,
  deleteMedia,
} = require("../controllers/memoryController");

// ==========================================
// MEMORY ROUTES
// ==========================================
// All routes are protected. Create and Update routes handle multipart/form-data 
// expecting a max of 1 cover image and 20 gallery media items.

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

router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "media", maxCount: 20 },
  ]),
  updateMemory
);

// Specific media operations
router.get("/download/:memoryId/:mediaId", protect, downloadMedia);
router.delete("/:id", protect, deleteMemory);
router.delete("/:id/media", protect, deleteMedia);

module.exports = router;