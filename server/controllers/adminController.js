const User = require("../models/User");
const Memory = require("../models/Memory");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ==========================================
// GET DASHBOARD STATS & RECENT DATA
// ==========================================
const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
    const pendingUsersCount = await User.countDocuments({ status: "pending", role: { $ne: "admin" } });
    const approvedUsersCount = await User.countDocuments({ status: "approved", role: { $ne: "admin" } });
    const totalMemories = await Memory.countDocuments();

    const pendingUsers = await User.find({ status: "pending", role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 });

    const recentUsers = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

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
// GET USERS (WITH SEARCH FILTER SUPPORT)
// ==========================================
const getUsers = async (req, res) => {
  try {
    const { status, search } = req.query;
    const validStatuses = ["pending", "approved", "suspended"];

    const query = { role: { $ne: "admin" } };

    if (status && status !== "all") {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      query.status = status;
    }

    // Added search query matching for name, username, or email
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: searchRegex },
        { username: searchRegex },
        { email: searchRegex },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({ users });
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
// DELETE USER
// ==========================================
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Id" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot delete admin user through this route" });
    }

    await Memory.deleteMany({ user: id });
    await user.deleteOne();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error", error.message);
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

// ==========================================
// UPDATE ADMIN PASSWORD
// ==========================================
const updateAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide both current and new passwords." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long." });
    }

    const adminUser = await User.findById(req.user._id);

    if (!adminUser || adminUser.role !== "admin") {
      return res.status(404).json({ message: "Admin user not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, adminUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password." });
    }

    const salt = await bcrypt.genSalt(10);
    adminUser.password = await bcrypt.hash(newPassword, salt);
    await adminUser.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Update Admin Password Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getDashboard,
  getUsers,
  approveUser,
  suspendUser,
  deleteUser,
  getMemories,
  deleteMemory,
  updateAdminPassword,
};