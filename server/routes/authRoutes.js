const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);

/* Forgot Password */
router.post("/forgot-password", forgotPassword);

/* Reset Password */
router.post("/reset-password/:token", resetPassword);

module.exports = router;