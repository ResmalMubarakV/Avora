const User = require("../models/User");
const Memory = require("../models/Memory");

// ==========================================
// SEARCH CONTROLLER
// ==========================================
/**
 * Performs a global search across users, accessible memories (public + own private), 
 * and distinct locations.
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

    // 1. Search approved non-admin users by name or username
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

    // 2. Build Memory Visibility Conditions (Public OR Own Private)
    const memoryVisibility = [{ isPublic: true }];
    
    // If the user is authenticated, allow them to search their own private memories
    if (req.user && req.user._id) {
      memoryVisibility.push({ user: req.user._id });
    }

    // 3. Search memories matching title, location, or description
    const memories = await Memory.find({
      $and: [
        { $or: memoryVisibility }, // Enforce visibility rules
        {
          $or: [
            { title: regex },
            { location: regex },
            { description: regex },
          ],
        }
      ]
    })
      .populate("user", "username")
      .select("title slug coverImage location user isPublic")
      .limit(5);

    // 4. Extract unique locations matching the query from accessible memories
    const placeDocuments = await Memory.find({
      $and: [
        { $or: memoryVisibility },
        { location: regex }
      ]
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