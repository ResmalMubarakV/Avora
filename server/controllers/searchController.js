const User = require("../models/User");
const Memory = require("../models/Memory");

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

        // Search Users
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

        // Search Memories
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

        // Search Places
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