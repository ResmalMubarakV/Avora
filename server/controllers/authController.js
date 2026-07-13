const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// @desc Register User
// @route POST /api/auth/register
// @access Public

const registerUser = async (req, res) => {
    try {
        const {name, email , password } = req.body;

        //validate input 
        if(!name || !email || !password) {
            return res.status(400).json({message : "Please Fill All Fields"});
        }

        // Check exisiting User
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({
                message : "User already exists"});
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

         // Create User
         const user = await User.create({
            name,
            email,
            password : hashedPassword,
         })

         // Response 

         return res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            token : generateToken(user._id),
         })

    } catch (error) {
        console.error("Register User " ,error.message);
        return res.status(500).json({message : "Server Error"});
    }

}

const loginUser = async (req , res) => {
    try {
        const {email, password } = req.body;

        // validate input 
        if(!email || !password) {
            return res.status(400).json
            ({message : "Please Fill All Fields"});
        }

        // find user by email 
        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json
            ({message : "Invalid Credentials"});    
        }

        // compare password 
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json
            ({message : "Invalid Credentials"});
        }

        //Response 
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email : user.email,
            token : generateToken(user._id),
        });
    } catch (error) {
        console.error("Login Error" , error.message);
        return res.status(500).json({message : "Server Error"});
    }
}

module.exports = {
    registerUser , 
    loginUser
};

