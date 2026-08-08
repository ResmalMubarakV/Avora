const User = require("../models/User");
const Memory = require("../models/Memory");

// ==========================================
// GET FEATURED TRAVELERS
// ==========================================
/**
 * Returns approved users who have at least one public memory and whose profiles are not locked.
 */
const getFeaturedTravelers = async (req, res) => {
  try {
    const users = await User.find({ role: "user", status: "approved", isLocked: false })
      .select("-password -email")
      .sort({ createdAt: -1 });

    const travelers = [];

    for (const user of users) {
      const publicMemoryCount = await Memory.countDocuments({
        user: user._id,
        isPublic: true,
      });

      if (publicMemoryCount === 0) continue;

      travelers.push({
        _id: user._id,
        name: user.name,
        username: user.username,
        profileImage: user.profileImage,
        location: user.location,
        bio: user.bio,
      });
    }

    return res.status(200).json(travelers);
  } catch (error) {
    console.error("Featured Travelers Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// GET PUBLIC PROFILE
// ==========================================
/**
 * Retrieves a user's public profile and their associated memories.
 * Hides memories completely if the profile is locked and the requester is not the owner.
 */
const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({
      username,
      role: "user",
      status: "approved",
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isOwner = req.user && req.user._id.toString() === user._id.toString();

    // STRICT CHECK: If profile is locked and viewer is not owner, return empty memories array
    let memories = [];
    if (!user.isLocked || isOwner) {
      memories = await Memory.find({
        user: user._id,
        ...(isOwner ? {} : { isPublic: true }),
      })
        .populate("user", "username")
        .sort({ createdAt: -1 });
    }

    return res.status(200).json({ user, memories });
  } catch (error) {
    console.error("Public Profile Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// GET PUBLIC MEMORY
// ==========================================
/**
 * Retrieves a specific memory by username and slug.
 * Throws a 403 error if the profile is locked, prompting the frontend to redirect.
 */
const getPublicMemory = async (req, res) => {
  try {
    const { username, slug } = req.params;

    const user = await User.findOne({
      username,
      role: "user",
      status: "approved",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isOwner = req.user && req.user._id.toString() === user._id.toString();

    // STRICT CHECK: Block access to individual memories if profile is locked and requester is not owner
    if (user.isLocked && !isOwner) {
      return res.status(403).json({ message: "This profile is locked." });
    }

    const memory = await Memory.findOne({
      user: user._id,
      slug,
      ...(isOwner ? {} : { isPublic: true }),
    }).populate("user", "username");

    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    return res.status(200).json(memory);
  } catch (error) {
    console.error("Public Memory Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getFeaturedTravelers,
  getPublicProfile,
  getPublicMemory,
};