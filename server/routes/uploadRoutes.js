const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {uploadImage} = require("../controllers/uploadController");

router.post("/", (req , res )   =>{
    upload.single("image")(req, res, (err) => {
        if (err) {

    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            message: "Maximum file size is 5MB"
        });
    }

    return res.status(400).json({
        message: err.message
    });
}
        uploadImage (req , res);
    });
});
module.exports = router;