const User = require("../models/User");
const Memory = require("../models/Memory");

// ==========================================
// GET FEATURED TRAVELERS
// ==========================================
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
// GET PUBLIC PROFILE (Optimized with Promise.all)
// ==========================================
const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const sortBy = req.query.sort || "newest";
    const filterQuery = req.query.filter || "";
    const search = req.query.search || "";
    const yearParam = req.query.year || "";
    const skip = (page - 1) * limit;

    const user = await User.findOne({
      username,
      role: "user",
      status: "approved",
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isOwner = req.user && req.user._id.toString() === user._id.toString();

    let memories = [];
    let totalPages = 1;
    let totalMemoriesCount = 0;
    let publicCount = 0;
    let privateCount = 0;
    let filteredTotal = 0;

    if (!user.isLocked || isOwner) {
      const query = {
        user: user._id,
        ...(isOwner ? {} : { isPublic: true }),
      };

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ];
      }

      if (filterQuery) {
        const filters = filterQuery.split(",");
        const validFilters = isOwner ? filters : filters.filter(f => f !== "private");

        if (validFilters.length > 0) {
          const conditions = [];
          validFilters.forEach((f) => {
            if (f === "public") conditions.push({ isPublic: true });
            if (f === "private") conditions.push({ isPublic: false });
            if (f === "liked") conditions.push({ isLiked: true });
          });

          if (conditions.length === 1) {
            Object.assign(query, conditions[0]);
          } else if (conditions.length > 1) {
            query.$and = conditions;
          }
        }
      }

      // Year-based filtering for public profiles
      if (yearParam && yearParam !== "all") {
        if (yearParam === "older") {
          query.startDate = { $lt: new Date("2020-01-01T00:00:00.000Z") };
        } else {
          const numericYear = parseInt(yearParam);
          if (!isNaN(numericYear)) {
            const startOfYear = new Date(`${numericYear}-01-01T00:00:00.000Z`);
            const endOfYear = new Date(`${numericYear}-12-31T23:59:59.999Z`);
            query.startDate = { $gte: startOfYear, $lte: endOfYear };
          }
        }
      }

      let dbSort = {};
      const hasFilters = Boolean(filterQuery || search);

      if (sortBy === "oldest") {
        dbSort = { startDate: 1 };
      } else if (sortBy === "title") {
        dbSort = { title: 1 };
      } else if (sortBy === "newest" && !hasFilters) {
        dbSort = { isPinned: -1, startDate: -1 };
      } else {
        dbSort = { startDate: -1 };
      }

      // Execute all database queries concurrently in parallel for lightning-fast loading
      [
        totalMemoriesCount,
        publicCount,
        privateCount,
        filteredTotal,
        memories,
      ] = await Promise.all([
        Memory.countDocuments({ user: user._id }),
        Memory.countDocuments({ user: user._id, isPublic: true }),
        Memory.countDocuments({ user: user._id, isPublic: false }),
        Memory.countDocuments(query),
        Memory.find(query)
          .populate("user", "username")
          .sort(dbSort)
          .skip(skip)
          .limit(limit),
      ]);

      totalPages = Math.ceil(filteredTotal / limit) || 1;
    }

    return res.status(200).json({ 
      user, 
      memories,
      currentPage: page,
      totalPages,
      totalMemories: filteredTotal,
      publicCount,
      privateCount,
    });
  } catch (error) {
    console.error("Public Profile Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// GET PUBLIC MEMORY
// ==========================================
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