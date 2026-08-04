const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const {reservedUsernames} = require("../constants/reservedUsernames");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const resetPasswordEmail = require("../templates/resetPasswordEmail");
const validatePassword = require("../utils/validatePassword");

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

        if (!validatePassword(password)) {
            return res.status(400).json({
                message:
                    "Password must be at least 8 characters long and include uppercase, lowercase, number and special character."
            });
        }

        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                message:
                    "Username must be 3-30 characters and can only contain letters, numbers, dots (.) and underscores (_)."
            });
        }

        if (reservedUsernames.has(username.toLowerCase())) {
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
        await User.create({  
            name, 
            username, 
            email,
            password : hashedPassword, 
        });

        // Response 
        return res.status(201).json({
             message : "Registration successful. Your account is awaiting admin approval"
        });

    } catch (error) {
        console.error("Register User " ,error.message);
        return res.status(500).json({message : "Server Error"});
    }
};

const loginUser = async (req , res) => {
    try {
        const {email, password } = req.body;

        // validate input 
        if(!email || !password) {
            return res.status(400).json({message : "Please Fill All Fields"});
        }

        // find user by email 
        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({message : "Invalid Credentials"});    
        }

        // compare password 
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({message : "Invalid Credentials"});
        }

        if(user.status === "pending"){
            return res.status(403).json({
                code: "ACCOUNT_PENDING",
                message: "Your account is awaiting admin approval."
            });
        } 
        else if (user.status === "suspended"){
            return res.status(403).json({
                code: "ACCOUNT_SUSPENDED",
                message: "Your account has been suspended."
            });
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
                status: user.status,
                token : generateToken(user._id)
            });
        }
        else {
            return res.status(500).json({
                message : "Invalid account status"
            });
        }
    } catch (error) {
        console.error("Login Error" , error.message);
        return res.status(500).json({message : "Server Error"});
    }
};

const forgotPassword = async (req, res) => {
    try {
        console.log("Forgot password API called");
        const { email } = req.body;
        console.log("Email:", email);

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        });
        
        console.log("User found:", !!user);

        // Prevent email enumeration
        if (!user) {
            return res.status(200).json({
                message:
                    "If an account exists with this email, a password reset link has been sent.",
            });
        }

        // Generate secure token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash token before storing
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        console.log("Preparing to send email...");
        
        await sendEmail({
            to: user.email,
            subject: "Reset your Avora password",
            html: resetPasswordEmail(
                resetLink,
                user.name
            ),
        });
        
        console.log("Email sent successfully.");

        return res.status(200).json({
            message:
                "If an account exists with this email, a password reset link has been sent.",
        });

    } catch (error) {
        console.error("Forgot Password:", error);

        return res.status(500).json({
            message: "Server Error",
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "Password is required",
            });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                message:
                    "Password must be at least 8 characters long and include uppercase, lowercase, number and special character."
            });
        }

        // Hash the token received from the URL
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find a valid user
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: {
                $gt: Date.now(),
            },
        });

        if (!user) {
            return res.status(400).json({
                message: "This password reset link is invalid or has expired.",
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        user.password = hashedPassword;

        // Clear reset fields
        user.passwordResetToken = "";
        user.passwordResetExpires = undefined;

        await user.save();

        return res.status(200).json({
            message: "Password has been reset successfully.",
        });

    } catch (error) {
        console.error("Reset Password:", error);

        return res.status(500).json({
            message: "Server Error",
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
};