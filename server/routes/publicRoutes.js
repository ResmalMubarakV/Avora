const express = require("express");
const router = express.Router();

const {
    getFeaturedTravelers,
    getPublicProfile,
    getPublicMemory,
} = require("../controllers/publicController");

const {
    protectOptional,
} = require("../middleware/authMiddleware");

router.get("/travelers", getFeaturedTravelers);

router.get(
    "/:username",
    protectOptional,
    getPublicProfile
);

router.get(
    "/:username/:slug",
    protectOptional,
    getPublicMemory
);

module.exports = router;