const User = require("../models/User");
const Memory = require("../models/Memory");

/**
 * GET /api/public/travelers
 * Returns approved users that have at least one public memory.
 */
const getFeaturedTravelers = async (req, res) => {
    try {
        const users = await User.find({
            role: "user",
            status: "approved",
        })
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

        return res.status(500).json({
            message: "Server Error",
        });
    }
};

/**
 * GET /api/public/:username
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
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isOwner =
            req.user &&
            req.user._id.toString() === user._id.toString();

        const memories = await Memory.find({
            user: user._id,
            ...(isOwner ? {} : { isPublic: true }),
        })
            .populate("user", "username")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            user,
            memories,
        });

    } catch (error) {

        console.error("Public Profile Error:", error.message);

        return res.status(500).json({
            message: "Server Error",
        });

    }
};

/**
 * GET /api/public/:username/:slug
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
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isOwner =
            req.user &&
            req.user._id.toString() === user._id.toString();

        const memory = await Memory.findOne({
            user: user._id,
            slug,
            ...(isOwner ? {} : { isPublic: true }),
        }).populate("user", "username");

        if (!memory) {
            return res.status(404).json({
                message: "Memory not found",
            });
        }

        return res.status(200).json(memory);

    } catch (error) {

        console.error("Public Memory Error:", error.message);

        return res.status(500).json({
            message: "Server Error",
        });

    }
};

module.exports = {
    getFeaturedTravelers,
    getPublicProfile,
    getPublicMemory,
};