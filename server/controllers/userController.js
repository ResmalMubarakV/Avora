const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const User = require("../models/User");
const { reservedUsernames } = require("../constants/reservedUsernames");

// ==========================================
// USER RESPONSE HELPER
// ==========================================
/**
 * Standardizes the user object payload to safely send to the client.
 */
const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  profileImage: user.profileImage,
  coverImage: user.coverImage,
  bio: user.bio,
  location: user.location,
  isLocked: user.isLocked,
  website: user.website,
  instagram: user.instagram,
  youtube: user.youtube,
  linkedin: user.linkedin,
});

// ==========================================
// CHECK USERNAME
// ==========================================
/**
 * Validates if a requested username is available and not in the reserved list.
 */
const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    if (reservedUsernames.has(username.toLowerCase())) {
      return res.status(200).json({ available: false });
    }

    const existingUser = await User.findOne({ username: username.toLowerCase() });

    if (existingUser) {
      return res.status(200).json({ available: false });
    }

    return res.status(200).json({ available: true });
  } catch (error) {
    console.error("Check Username Error", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// GET MY PROFILE
// ==========================================
/**
 * Retrieves the currently authenticated user's profile details.
 */
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Get Profile Error", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// UPDATE PROFILE
// ==========================================
/**
 * Updates user text/link/privacy fields and validates username changes.
 */
const updateProfile = async (req, res) => {
  try {
    const { name, username, bio, location, isLocked, website, instagram, youtube, linkedin } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Please Provide Data To Update" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Validate new username if it's being updated
    if (username) {
      if (reservedUsernames.has(username.toLowerCase())) {
        return res.status(400).json({ message: "Username is not available" });
      }

      const existingUsername = await User.findOne({
        username,
        _id: { $ne: req.user._id },
      });

      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    // Update fields or retain existing values
    user.name = name ?? user.name;
    user.username = username ?? user.username;
    user.bio = bio ?? user.bio;
    user.location = location ?? user.location;
    
    if (typeof isLocked === "boolean") {
      user.isLocked = isLocked;
    }

    user.website = website ?? user.website;
    user.instagram = instagram ?? user.instagram;
    user.youtube = youtube ?? user.youtube;
    user.linkedin = linkedin ?? user.linkedin;
    
    await user.save();

    return res.status(200).json(userResponse(user));
  } catch (error) {
    console.error("Update Profile Error ", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// UPDATE PROFILE IMAGE
// ==========================================
/**
 * Uploads a new profile image to Cloudinary and removes the old asset.
 */
const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please Upload An Image" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avora/profile-images",
    });

    // Cleanup local temp file
    try {
      if (req.file && req.file.path) {
        await fs.promises.unlink(req.file.path);
      }
    } catch (cleanupError) {
      console.error("Cleanup Error", cleanupError.message);
    }

    // Delete old image from Cloudinary to save storage
    if (user.profileImagePublicId) {
      await cloudinary.uploader.destroy(user.profileImagePublicId);
    }

    user.profileImage = result.secure_url;
    user.profileImagePublicId = result.public_id;

    await user.save();

    return res.status(200).json(userResponse(user));
  } catch (error) {
    console.error("Update Profile Image Error", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// UPDATE COVER IMAGE
// ==========================================
/**
 * Uploads a new cover image to Cloudinary and removes the old asset.
 */
const updateCoverImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a cover image." });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avora/profile-covers",
    });

    // Cleanup local temp file
    try {
      if (req.file?.path) {
        await fs.promises.unlink(req.file.path);
      }
    } catch (cleanupError) {
      console.error("Cleanup Error:", cleanupError.message);
    }

    // Delete old cover from Cloudinary to save storage
    if (user.coverImagePublicId) {
      await cloudinary.uploader.destroy(user.coverImagePublicId);
    }

    user.coverImage = result.secure_url;
    user.coverImagePublicId = result.public_id;

    await user.save();

    return res.status(200).json(userResponse(user));
  } catch (error) {
    console.error("Update Cover Image Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getMyProfile,
  updateProfile,
  updateProfileImage,
  updateCoverImage,
  checkUsername,
};