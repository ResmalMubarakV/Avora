const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { uploadImage } = require("../controllers/uploadController");

// ==========================================
// UPLOAD ROUTES
// ==========================================
// Handles single image uploads and intercepts Multer errors (like file size limits) 
// before passing control to the upload controller.

router.post("/", (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "Maximum file size exceeded.",
        });
      }

      return res.status(400).json({
        message: err.message,
      });
    }
    
    // Proceed to controller if no upload errors occurred
    uploadImage(req, res);
  });
});

module.exports = router;