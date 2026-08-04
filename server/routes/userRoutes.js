const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
    getMyProfile,
    updateProfile,
    updateProfileImage,
    updateCoverImage,
    checkUsername,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

router.get("/check-username", checkUsername);

router.get("/profile", protect, getMyProfile);

router.put("/profile", protect, updateProfile);

router.put(
    "/profile/image",
    protect,
    upload.single("image"),
    updateProfileImage
);

router.put(
    "/profile/cover",
    protect,
    upload.single("image"),
    updateCoverImage
);

module.exports = router;