const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file , cb){
        cb(null , "uploads/");
    },
    filename: function (req , file , cb){
        cb(null , Date.now() + "-" + file.originalname);
    }
})

const upload = multer({
    storage : storage,
    fileFilter : function (req , file , cb){
        if(file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")){
            cb(null , true);
        } else {
            cb(new Error("Only images and videos files are allowed") , false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 50 // 5MB
    }
});

module.exports = upload;