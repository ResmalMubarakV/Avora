const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { reservedUsernames } = require("../constants/reservedUsernames");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const resetPasswordEmail = require("../templates/resetPasswordEmail");
const validatePassword = require("../utils/validatePassword");

// ==========================================
// REGISTER USER
// ==========================================
/**
 * @desc Register User
 * @route POST /api/auth/register
 * @access Public
 */
const registerUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    const username = req.body.username.trim().toLowerCase();
    const email = req.body.email.trim().toLowerCase();
    const usernameRegex = /^[a-zA-Z0-9._]{3,30}$/;

    // Validate input fields
    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "Please Fill All Fields" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long and include uppercase, lowercase, number and special character."
      });
    }

    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message: "Username must be 3-30 characters and can only contain letters, numbers, dots (.) and underscores (_)."
      });
    }

    if (reservedUsernames.has(username.toLowerCase())) {
      return res.status(400).json({ message: "Username is not available" });
    }

    // Check existing User to prevent duplicates
    const existingUser = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Registration successful. Your account is awaiting admin approval"
    });
  } catch (error) {
    console.error("Register User ", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// LOGIN USER
// ==========================================
/**
 * @desc Authenticate user and get token
 * @route POST /api/auth/login
 * @access Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please Fill All Fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Handle account access based on admin approval status
    if (user.role !== "admin") {
      if (user.status === "pending") {
        return res.status(403).json({
          code: "ACCOUNT_PENDING",
          message: "Your account is awaiting admin approval."
        });
      } else if (user.status === "suspended") {
        return res.status(403).json({
          code: "ACCOUNT_SUSPENDED",
          message: "Your account has been suspended."
        });
      }
    }

    if (user.status === "approved" || user.role === "admin") {
      return res.status(200).json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          profileImage: user.profileImage,
          profileImagePublicId: user.profileImagePublicId,
          bio: user.bio,
          location: user.location,
          role: user.role,
          status: user.status
        }
      });
    } else {
      return res.status(500).json({ message: "Invalid account status" });
    }
  } catch (error) {
    console.error("Login Error", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// FORGOT PASSWORD
// ==========================================
const forgotPassword = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({ message: "Both email and username are required." });
    }

    // Verify that BOTH email and username belong to the exact same account
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      username: username.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "No account found matching this email and username combination.",
      });
    }

    // Generate and hash secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your Avora password",
      html: resetPasswordEmail(resetLink, user.name),
    });

    return res.status(200).json({
      message: "A password reset link has been sent to your email.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// RESET PASSWORD
// ==========================================
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long and include uppercase, lowercase, number and special character."
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with matching token that hasn't expired yet
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "This password reset link is invalid or has expired.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // Invalidate all existing tokens/sessions across all devices
    user.passwordChangedAt = Date.now() - 1000;

    // Clear reset fields after successful change
    user.passwordResetToken = "";
    user.passwordResetExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Reset Password:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};