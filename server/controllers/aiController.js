const Groq = require("groq-sdk");
const Memory = require("../models/Memory");
const User = require("../models/User");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ==========================================
// GENERATE AI RESPONSE
// ==========================================
const generateAI = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const { message, history = [] } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const user = await User.findById(req.user._id).select("name username location bio");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const lowerMessage = message.toLowerCase();

    const greetingKeywords = ["hi", "hello", "hey", "good morning", "good evening", "good afternoon"];
    const isGreeting = greetingKeywords.some((word) => lowerMessage === word);

    const isTravelQuestion = [
      "trip", "travel", "destination", "recommend", "plan",
      "itinerary", "budget", "visit", "vacation", "holiday",
    ].some((word) => lowerMessage.includes(word));

    const isMemoryQuestion = [
      "remember", "memory", "previous", "last trip", "my trip", "visited",
    ].some((word) => lowerMessage.includes(word));

    let memories = [];

    if (isTravelQuestion || isMemoryQuestion) {
      memories = await Memory.find({ user: req.user._id })
        .sort({ startDate: -1 })
        .limit(30)
        .select("title location modeOfTravel description startDate endDate");
    }

    let travelHistory = "";
    let favoriteTravelMode = "Unknown";

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

    let systemPrompt = "";

    if (isGreeting) {
      systemPrompt = `
      You are Avora AI.
      The user is simply greeting you.
      Reply naturally. Keep your response under 3 sentences.
      `;
    } else if (isTravelQuestion) {
      systemPrompt = `
      You are Avora AI.
      Current User: ${userProfile}
      Travel History: ${travelHistory}
      Give personalized travel advice. Avoid places already visited.
      `;
    } else if (isMemoryQuestion) {
      systemPrompt = `
      You are Avora AI.
      Current User: ${userProfile}
      Travel History: ${travelHistory}
      Answer using the user's previous travel memories.
      `;
    } else {
      // ANTI-TEMPLATE SYSTEM INSTRUCTIONS FOR UNIQUE NARRATIVES
      systemPrompt = `
      You are an authentic human travel writer. Your goal is to write a unique, organic travel memory based on the user's notes.
      
      CRITICAL DIVERSITY RULES TO PREVENT REPETITIVE STORIES:
      1. BREAK THE TEMPLATE: Do not follow a rigid chronological script (e.g., do not automatically start with "we left early in the morning" or end with "watching the sunset"). Start the story mid-action, with a striking sensory observation, a specific conversation, or a reflection on the weather.
      2. PERSPECTIVE SHIFT: Randomly select a unique narrative angle for this specific entry (e.g., focus deeply on the physical feeling of the ride/drive, the humor of small mishaps, the distinct personalities of the people, or the stark shift in environment).
      3. VARIETY IN STRUCTURE: Vary paragraph lengths significantly. Mix punchy, short sentences with flowing descriptive ones.
      4. HUMAN VOICE: Write with genuine emotion and variable pacing. Avoid cliché travel blog filler words. Make every single generated story feel like it was written by a different person on a different day.
      `;
    }

    systemPrompt += `
      If you don't know something, say you don't know.
      Never invent information.
    `;

    const sanitizedHistory = history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...sanitizedHistory,
        { role: "user", content: message },
      ],
      temperature: 0.95, // Maximum creative variance to ensure structural and stylistic uniqueness
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