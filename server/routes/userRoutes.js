const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const {
    getMyProfile,
    updateProfile,
    updateProfileImage,
} = require("../controllers/userController");

const {protect} = require("../middleware/authMiddleware");

router.get("/profile" , protect , getMyProfile);
router.put("/profile" , protect , updateProfile);
router.put("/profile/image" , 
    protect , 
    upload.single("image"),
    updateProfileImage
)

module.exports = router;
