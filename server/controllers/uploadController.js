const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const uploadImage = async (req , res) => {

    try {
        
        if (!req.file) {
        return res.status(400).json({
            message: "Please upload an image"
        });
        }
        
        const result = await cloudinary.uploader.upload(req.file.path);
        
        await fs.promises.unlink(req.file.path);

        return res.status(200).json({ 
            message: "Image uploaded successfully" , 
            imageUrl: result.secure_url ,
            publicId: result.public_id
         });
    } catch (error) {
        // delete the file if it exists
        try {
            if (req.file && req.file.path) {
            await fs.promises.unlink(req.file.path);
        }
        } catch (cleanupError) {
            console.error("Error deleting file" , cleanupError.message);   
        }

        console.error("Image Upload Error" , error.message);
         return res.status(500).json({ message: "Error uploading image" });
    }
}

module.exports = {uploadImage};