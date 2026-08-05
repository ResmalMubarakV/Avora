const multer = require("multer");

// ==========================================
// MULTER UPLOAD CONFIGURATION
// ==========================================
/**
 * Configures Multer for local temporary disk storage before sending to Cloudinary.
 * Enforces file type restrictions and a size limit.
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Prepend a timestamp to prevent local filename collisions
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept only image or video MIME types
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images and videos files are allowed"), false);
    }
  },
  limits: {
    // 50MB file size limit
    fileSize: 1024 * 1024 * 50, 
  },
});

module.exports = upload;