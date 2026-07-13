const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const User = require("../models/User");

const userResponse = (user) => ({
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    profileImage: user.profileImage,
    bio: user.bio,
    location: user.location
});


const getMyProfile = async (req , res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if(!user)
            return res.status(404).json({
                message : "User Not Found"
        });
        return res.status(200).json(user)
    } catch (error) {
        console.error("Get Profile Error" , error.message);
        return res.status(500).json({
            message : "Server Error"
        });
    }
}

const updateProfile = async (req, res) => {
    try {
        const {
            name, 
            username,
            bio,
            location
        } = req.body;

        if(Object.keys(req.body).length === 0){
            return res.status(400).json({ 
                message : "Please Provide Data To Update"
            })
        }

        if (username) {
            const reservedUsernames = [
            "login",
            "register",
            "dashboard",
            "admin",
            "api",
            "settings",
            "profile",
            "about",
            "contact",
            "privacy",
            "terms"
    ];

    if (reservedUsernames.includes(username.toLowerCase())) {
        return res.status(400).json({
            message: "Username is not available"
        });
    }
}

        const user = await User.findById(req.user._id);

        if(!user) 
            return res.status(404).json({
                message : "User Not Found"
            })

        if(username){

            const existingUsername = await User.findOne ({
            username,
            _id : {$ne : req.user ._id }
        })
            if(existingUsername){
                return res.status(400).json({ 
                message : "User Already Exists"
            })
            }
        }


        user.name = name || user.name;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.location = location || user.location;
        await user.save();

        return res.status(200).json(userResponse(user));

    } catch (error) {
        console.error("Update Profile Error " , error.message)
        return res.status(500).json({
            message : "Server Error"
        });
    }
}  

const updateProfileImage = async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({ 
                message : "Please Upload An Image"
            });
        }

        const user = await User.findById(req.user._id);

        if(!user){
            return res.status(404).json({ 
                message : "User Not Found"
            });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "avora/profile-images"
        });
        try {
            if(req.file && req.file.path){
                await fs.promises.unlink(req.file.path);
            }
        } catch (cleanupError) {
            console.error(" Cleanup Error" ,cleanupError.message)
        }

        if(user.profileImagePublicId){
            await cloudinary.uploader.destroy(user.profileImagePublicId)
        }

        user.profileImage = result.secure_url;
        user.profileImagePublicId = result.public_id;

        await user.save();

        return res.status(200).json(userResponse(user));

    } catch (error) {
        console.error("Update Profile Image Error", error.message);
        return res.status(500).json({
            message : "Server Error"
        })
    }
}


module.exports = {
    getMyProfile,
    updateProfile,
    updateProfileImage
}