const express = require('express');
const router = express.Router();
const upload = require("../middleware/uploadMiddleware")

const {getMemories ,
    createMemory,
    getMemoryById,
    updateMemory,
    deleteMemory,
    deleteMedia} = require("../controllers/memoryController");
    
const {protect} = require("../middleware/authMiddleware");

router.post("/", 
    protect ,
    upload.fields([
        {
            name : "coverImage",
            maxCount : 1
        },
        {
            name : "media",
            maxCount : 20
        }
    ]),
    createMemory);

router.get("/", protect , getMemories);
router.get("/:id", protect , getMemoryById);

router.put("/:id"
    , protect ,
    upload.fields([
        {
            name : "coverImage",
            maxCount : 1
        },
        {
            name : "media",
            maxCount : 20
        }
    ]),
    updateMemory);

router.delete("/:id", protect , deleteMemory);
router.delete("/:id/media", protect , deleteMedia)

module.exports = router;