const User = require("../models/User");
const mongoose = require("mongoose");

const getUsers = async (req ,res ) => {
    try {
        const status = req.query.status;

        const validStatuses = ["pending" , "approved" , "suspended"];

        // validate status if provided
        if(status && !validStatuses.includes((status))){
            return res.status(400).json({
                message : "Invalid status"
            });
        }

        //Build query
        const query = {};
        
        if(status) {
            query.status = status;
        }

        // fetch users 
        const users = await User
            .find(query)
            .select("-password")
            .sort({createdAt : "-1"});

        return res.status(200).json(users);

    } catch (error) {
        console.error("Get Users Error:", error.message);

        return res.status(500).json({
            message: "Server Error"
        });

    }
}

const approveUser = async (req , res) => {
    try {
        const {id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({
        message : "Invalid Id"})

        const user = await User.findById(id).select("-password");

        if(!user){
            return res.status(404).json({
                message : "User not found"
            })
        }

        if(user.status === "approved"){
            return res.status(400).json({
                message : "User is already approved"
            })
        } 

        user.status = "approved";

        await user.save();

        return res.status(200).json({
            message : "User approved successfully",
            "user" : user
        });

    } catch (error) {
        console.error("Approve update error" , error.message)
        return res.status(500).json({
            message : "Server Error"
        })
    }
}

const suspendUser = async (req , res) => {
    try {
        const {id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message : "Invalid Id"
            })
        }

        const user = await User.findById(id).select("-password");

        if(!user){
            return res.status(404).json({
                message : "User not found"
            })
        }

        if(user.status === "suspended") {
            return res.status(400).json({
                message : "User is already suspended"
            })
        }

         user.status = "suspended";

         await user.save();

         return res.status(200).json({
            message : "User suspended successfully",
            "user" : user
         });


    } catch (error) {
        console.error("Reject Update Error" , error.message);
        return res.status(500).json({
            message : "Server Error"
        })
    }
}

module.exports = {
    getUsers,
    approveUser,
    suspendUser
};

