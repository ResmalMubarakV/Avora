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
        if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/webp"){
            cb(null , true);
        } else {
            cb(new Error("Only JPEG, PNG, JPG, and WEBP files are allowed") , false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    }
});

module.exports = upload;