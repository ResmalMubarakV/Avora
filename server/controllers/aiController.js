const Groq = require("groq-sdk");
const Memory = require("../models/Memory");
const User = require("../models/User");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ==========================================
// GENERATE AI RESPONSE
// ==========================================
/**
 * Generates a contextual AI response tailored to user travel data.
 */
const generateAI = async (req, res) => {
  try {
    // Validate user authentication and message input
    if (!req.user) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const { message, history = [] } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Fetch user details for contextual prompts
    const user = await User.findById(req.user._id).select("name username location bio");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ==========================================
    // INTENT DETECTION
    // ==========================================
    const lowerMessage = message.toLowerCase();

    // Check if the user is just saying hello
    const greetingKeywords = ["hi", "hello", "hey", "good morning", "good evening", "good afternoon"];
    const isGreeting = greetingKeywords.some((word) => lowerMessage === word);

    // Check if the user is asking for future travel advice
    const isTravelQuestion = [
      "trip", "travel", "destination", "recommend", "plan",
      "itinerary", "budget", "visit", "vacation", "holiday",
    ].some((word) => lowerMessage.includes(word));

    // Check if the user is asking about their past trips
    const isMemoryQuestion = [
      "remember", "memory", "previous", "last trip", "my trip", "visited",
    ].some((word) => lowerMessage.includes(word));

    // ==========================================
    // FETCH & FORMAT TRAVEL DATA
    // ==========================================
    let memories = [];

    // Only hit the database if the question requires travel context
    if (isTravelQuestion || isMemoryQuestion) {
      memories = await Memory.find({ user: req.user._id })
        .sort({ startDate: -1 })
        .limit(30)
        .select("title location modeOfTravel description startDate endDate");
    }

    let travelHistory = "";
    let favoriteTravelMode = "Unknown";

    // Format memories and calculate the most frequent travel mode
    if (memories.length > 0) {
      travelHistory = memories
        .map(
          (memory) => `
      • ${memory.title}
      Location: ${memory.location}
      Travel Mode: ${memory.modeOfTravel}
      Description: ${memory.description}
      `
        )
        .join("\n");

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

    // ==========================================
    // SYSTEM PROMPT CONSTRUCTION
    // ==========================================
    let systemPrompt = "";

    // Assign specific AI behavior instructions based on detected intent
    if (isGreeting) {
      systemPrompt = `
      You are Avora AI.
      The user is simply greeting you.
      Reply naturally. Keep your response under 3 sentences.
      Do not recommend destinations or mention travel history unless asked.
      `;
    } else if (isTravelQuestion) {
      systemPrompt = `
      You are Avora AI.
      Current User: ${userProfile}
      Travel History: ${travelHistory}
      Give personalized travel advice. Recommend destinations based on previous trips.
      Avoid places already visited. Include itinerary, budget and food only when useful.
      `;
    } else if (isMemoryQuestion) {
      systemPrompt = `
      You are Avora AI.
      Current User: ${userProfile}
      Travel History: ${travelHistory}
      Answer using the user's previous travel memories.
      If information isn't available, say so honestly.
      `;
    } else {
      systemPrompt = `
      You are Avora AI.
      Be friendly and concise.
      Don't include unnecessary travel suggestions.
      `;
    }

    // Append strict global guardrails
    systemPrompt += `
      If you don't know something, say you don't know.
      Never invent information.
      Never assume travel history that isn't provided.
    `;

    // ==========================================
    // EXECUTE AI API CALL
    // ==========================================
    
    // Sanitize message history to prevent API format errors
    const sanitizedHistory = history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Trigger Groq inference
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...sanitizedHistory,
        { role: "user", content: message },
      ],
      temperature: 0.5,
    });

    return res.status(200).json({
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("AI Error:", error.message);
    return res.status(error.status || 500).json({
      message: error.response?.data?.error?.message || "Server Error",
    });
  }
};

module.exports = {
  generateAI,
};