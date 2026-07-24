const express = require("express");
const router = express.Router();

const {
    getFeaturedTravelers,
    getPublicProfile,
    getPublicMemory
} = require("../controllers/publicController")

router.get("/travelers", getFeaturedTravelers);
router.get("/:username" , getPublicProfile );
router.get("/:username/:slug" , getPublicMemory);

module.exports = router;