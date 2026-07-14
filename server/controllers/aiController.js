const Groq = require("groq-sdk");
const Memory = require("../models/Memory");
const User = require("../models/User");

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const generateAI = async (req, res) => {
    
    try {

        if(!req.user) {
            return res.status(401).json({
                message : "User not authorized"
            })
        }

        const user = await User.findById(req.user._id)
            .select("name username location bio");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const memories = await Memory.find({
            user : req.user._id, 
        }).select("title location modeOfTravel description startDate endDate")
    
        const travelHistory =
        memories.length > 0
            ? memories
                  .map(
                      (memory) =>
                          `• ${memory.title}
                        Location: ${memory.location}
                        Travel Mode: ${memory.modeOfTravel}
                        Trip Dates: ${memory.startDate.toDateString()} - ${memory.endDate.toDateString()}
                        Description: ${memory.description}`
                  )
                  .join("\n\n")
            : "No previous travel memories.";

        let favoriteTravelMode = "Unknown";

            if (memories.length > 0) {
                const travelModeCount = {};

                memories.forEach((memory) => {
                    const mode = memory.modeOfTravel;

                    travelModeCount[mode] = (travelModeCount[mode] || 0) + 1;
                });

                favoriteTravelMode = Object.keys(travelModeCount).reduce((a, b) =>
                    travelModeCount[a] > travelModeCount[b] ? a : b
                );
            }

        const userProfile = `
                Name: ${user.name}
                Username: ${user.username}
                Location: ${user.location || "Not provided"}
                Bio: ${user.bio || "Not provided"}
                Preferred Travel Mode: ${favoriteTravelMode}
                `;

        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                message: "Message is required",
            });
        }

        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `
                            You are Avora AI.

                            You are an intelligent and friendly travel assistant.

                            Current User Profile:

                            ${userProfile}

                            Previous Travel History:

                            ${travelHistory}

                            Instructions:

                            - Personalize every response using the user's profile and travel history.
                            - Greet the user by their first name when it feels natural.
                            - Recommend destinations that match the user's travel interests.
                            - Avoid recommending destinations already visited unless the user specifically asks.
                            - Consider the user's preferred travel mode when suggesting trips.
                            - If the user asks about a destination, include:
                            • Best time to visit
                            • Estimated budget
                            • Suggested itinerary
                            • Local food
                            • Hidden gems
                            • Packing tips
                            • Weather advice (if relevant)
                            - Keep responses practical, concise and engaging.
                            - Always format responses using clear markdown headings and bullet points
                            `
                },
                {
                    role: "user",
                    content: message,
                },
            ],
            temperature: 0.7,
        });

        return res.status(200).json({
            response: completion.choices[0].message.content,
        });
    } catch (error) {
        console.error("AI Error:", error);

            return res.status(error.status || 500).json({
            message:
                error.response?.data?.error?.message ||
                error.message ||
                "Server Error",
        });
    }
};


module.exports = {
    generateAI
};