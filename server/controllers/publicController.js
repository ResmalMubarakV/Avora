const User = require("../models/User");
const Memory = require("../models/Memory");

const getPublicProfile = async ( req , res) => {
    try {
        const {username} = req.params;

        const user = await User.findOne({username}).select("-password");

        if(!user || user.username === "admin") {
            return res.status(404).json({
                message : "User not found"
            })
        }

        const memories = await Memory.find({
            user : user._id,
            isPublic : true
        }).sort({createdAt : -1});

        return res.status(200).json({
            user,
            memories
        })
    } catch (error) {
        console.error("Public Profile Error ", error.message)

        return res.status(500).json({
            message : "Server Error"
        });

    }
}

const getPublicMemory = async (req , res) => {
    try {
        const {username , slug} = req.params;

        const user = await User.findOne({username});

        if(!user) {
            return res.status(404).json({
                message : "User not found"
            })
        }

        const memory = await Memory.findOne({
            user : user._id,
            slug ,
            isPublic : true

        })

        if(!memory) {
            return res.status(404).json({
                message : "Memory not found"
            })
        }

        return res.status(200).json(memory)

    } catch (error) {
        console.error("Public memory error" , error.message);
        return res.status(500).json({
            message : "Server Error"
        })
    }
}

module.exports= {getPublicProfile,getPublicMemory};