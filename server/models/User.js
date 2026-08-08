const mongoose = require("mongoose");

// ==========================================
// USER MODEL SCHEMA
// ==========================================
/**
 * Defines the structure for application users.
 * Includes authentication, profile details, social links, account status, and profile locking.
 */
const userSchema = new mongoose.Schema(
  {
    // --- Core Authentication ---
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },

    // --- Profile Image ---
    profileImage: {
      type: String,
      default: "",
    },
    profileImagePublicId: {
      type: String,
      default: "",
    },

    // --- Cover Image ---
    coverImage: {
      type: String,
      default: "",
    },
    coverImagePublicId: {
      type: String,
      default: "",
    },

    // --- Profile Details ---
    bio: {
      type: String,
      default: "",
      maxlength: 200,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },

    // --- Privacy Settings ---
    isLocked: {
      type: Boolean,
      default: false,
    },

    // --- Social Links ---
    website: {
      type: String,
      default: "",
      trim: true,
    },
    instagram: {
      type: String,
      default: "",
      trim: true,
    },
    youtube: {
      type: String,
      default: "",
      trim: true,
    },
    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    // --- Account Management ---
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "suspended"],
      default: "pending", // Accounts require admin approval before login
      required: true,
    },

    // --- Password Reset ---
    passwordResetToken: {
      type: String,
      default: "",
    },
    passwordResetExpires: {
      type: Date,
    },
    passwordResetAttempts: {
      type: Number,
      default: 0,
    },
    passwordResetWindowStart: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);