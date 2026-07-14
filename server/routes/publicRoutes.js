const express = require("express");
const router = express.Router();

const {
    getPublicProfile,
    getPublicMemory
} = require("../controllers/publicController")

router.get("/:username" , getPublicProfile );
router.get("/:username/:slug" , getPublicMemory);

module.exports = router;