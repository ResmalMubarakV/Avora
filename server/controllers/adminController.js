const User = require("../models/User");
const Memory = require("../models/Memory");
const mongoose = require("mongoose");

// ==========================================
// GET DASHBOARD STATS & RECENT DATA
// ==========================================
const getDashboard = async (req, res) => {
  try {
    // Exclude admin accounts from total, pending, and approved counts
    const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
    const pendingUsersCount = await User.countDocuments({ status: "pending", role: { $ne: "admin" } });
    const approvedUsersCount = await User.countDocuments({ status: "approved", role: { $ne: "admin" } });
    const totalMemories = await Memory.countDocuments();

    // Fetch pending users list (excluding admin)
    const pendingUsers = await User.find({ status: "pending", role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 });

    // Fetch recent users (excluding admin)
    const recentUsers = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    // Fetch recent memories
    const recentMemories = await Memory.find()
      .populate("user", "name username profileImage")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      stats: {
        totalUsers,
        pendingUsers: pendingUsersCount,
        approvedUsers: approvedUsersCount,
        totalMemories,
      },
      pendingUsers,
      recentUsers,
      recentMemories,
    });
  } catch (error) {
    console.error("Get Dashboard Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// GET USERS
// ==========================================
const getUsers = async (req, res) => {
  try {
    const status = req.query.status;
    const validStatuses = ["pending", "approved", "suspended"];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Always exclude admin accounts from user management directory lists
    const query = { role: { $ne: "admin" } };
    if (status) query.status = status;

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Get Users Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// APPROVE USER
// ==========================================
const approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Id" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status === "approved") {
      return res.status(400).json({ message: "User is already approved" });
    }

    user.status = "approved";
    await user.save();

    return res.status(200).json({
      message: "User approved successfully",
      user: user,
    });
  } catch (error) {
    console.error("Approve update error", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// SUSPEND USER
// ==========================================
const suspendUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Id" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status === "suspended") {
      return res.status(400).json({ message: "User is already suspended" });
    }

    user.status = "suspended";
    await user.save();

    return res.status(200).json({
      message: "User suspended successfully",
      user: user,
    });
  } catch (error) {
    console.error("Reject Update Error", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// GET MEMORIES
// ==========================================
const getMemories = async (req, res) => {
  try {
    const memories = await Memory.find()
      .populate("user", "name username profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json(memories);
  } catch (error) {
    console.error("Get Memories Error", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// DELETE MEMORY
// ==========================================
const deleteMemory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Id" });
    }

    const memory = await Memory.findById(id);

    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    await memory.deleteOne();

    return res.status(200).json({ message: "Memory deleted successfully" });
  } catch (error) {
    console.error("Delete Memory Error", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getDashboard,
  getUsers,
  approveUser,
  suspendUser,
  getMemories,
  deleteMemory,
};