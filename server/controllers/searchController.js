const User = require("../models/User");
const Memory = require("../models/Memory");

// ==========================================
// SEARCH CONTROLLER
// ==========================================
/**
 * Performs a global search across users, public memories, and distinct locations.
 */
const search = async (req, res) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.status(200).json({
        users: [],
        memories: [],
        places: [],
      });
    }

    const regex = new RegExp(query, "i");

    // Search approved non-admin users by name or username
    const users = await User.find({
      username: { $ne: "admin" },
      status: "approved",
      $or: [
        { name: regex },
        { username: regex },
      ],
    })
      .select("name username profileImage")
      .limit(5);

    // Search public memories matching title, location, or description
    const memories = await Memory.find({
      isPublic: true,
      $or: [
        { title: regex },
        { location: regex },
        { description: regex },
      ],
    })
      .populate("user", "username")
      .select("title slug coverImage location user")
      .limit(5);

    // Extract unique public locations matching the query
    const placeDocuments = await Memory.find({
      isPublic: true,
      location: regex,
    }).select("location");

    const places = [...new Set(placeDocuments.map((memory) => memory.location))];

    return res.status(200).json({
      users,
      memories,
      places,
    });
  } catch (error) {
    console.error("Search Error:", error.message);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  search,
};