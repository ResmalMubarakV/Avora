const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const {reservedUsernames} = require("../constants/reservedUsernames")

// @desc Register User
// @route POST /api/auth/register
// @access Public

const registerUser = async (req, res) => {
    try {
        const {name, password  } = req.body;
        const username = req.body.username.trim().toLowerCase();
        const email = req.body.email.trim().toLowerCase();

        const usernameRegex = /^[a-zA-Z0-9._]{3,30}$/;

        //validate input 
        if(!name || !email || !password || !username) {
            return res.status(400).json({message : "Please Fill All Fields"});
        }

        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                message:
                    "Username must be 3-30 characters and can only contain letters, numbers, dots (.) and underscores (_)."
            });
        }

        if (reservedUsernames.includes(username.toLowerCase())) {
            return res.status(400).json({
                message: "Username is not available"
            });
        }

        // Check exisiting User
        const existingUser = await User.findOne({email});

        const existingUsername = await User.findOne({username});
        
        if (existingUser) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }

            if (existingUsername) {
                return res.status(400).json({
                    message: "Username already exists"
                });
            }
        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User 
        await User.create
        ({  name, 
            username, 
            email,
            password : hashedPassword, 
        })

         // Response 
            return res.status(201).json({
                 message : "Registration successful. Your account is awaiting admin approval"
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

        if(user.status === "pending"){
            return res.status(403).json
                ({message : "Your account is awaiting admin approval."})
        } 
        else if (user.status === "rejected"){
                return res.status(403).json({
                    message : "Your registration request was rejected"
                })
            }

        else if(user.status === "approved"){
            return res.status(200).json({
            _id: user._id,
            name: user.name,
            email : user.email,
            username : user.username,
            profileImage : user.profileImage,
            profileImagePublicId : user.profileImagePublicId,
            bio : user.bio,
            location : user.location,
            token : generateToken(user._id)
        });
        }

        else {
            return res.status(500).json({
                message : "Invalid account status"
            })
        }
    } catch (error) {
        console.error("Login Error" , error.message);
        return res.status(500).json({message : "Server Error"});
    }
}

module.exports = {
    registerUser , 
    loginUser
};


