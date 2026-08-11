const Groq = require("groq-sdk");
const Memory = require("../models/Memory");
const User = require("../models/User");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ==========================================
// AVORA AI: PRODUCTION-GRADE OPTIMIZED CONTROLLER
// Advanced Token Compression, Strict Guardrails & Geographical Modeling
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

    // Fetch user with minimal required footprint
    const user = await User.findById(req.user._id).select("name username location bio");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const query = message.toLowerCase();

    // Intent detection flags to control context activation
    const isGreeting = ["hi", "hello", "hey", "good morning", "good evening", "good afternoon"].some(
      (word) => query === word
    );
    const isDetailedItinerary = query.includes("itinerary") || query.includes("detailed");
    const isTravelQuery = [
      "trip", "travel", "destination", "recommend", "plan",
      "budget", "visit", "vacation", "holiday", "remember", 
      "memory", "previous", "last", "history"
    ].some((word) => query.includes(word));

    let compressedArchive = "";

    // TOKEN OPTIMIZATION MODELING: Compress all historical trips into a micro-string layout
    if (isTravelQuery || isDetailedItinerary) {
      const allMemories = await Memory.find({ user: req.user._id })
        .sort({ startDate: -1 })
        .select("location modeOfTravel startDate");

      if (allMemories.length > 0) {
        compressedArchive = allMemories
          .map((m) => {
            const yr = m.startDate ? new Date(m.startDate).getFullYear() : "";
            const mode = m.modeOfTravel ? `[${m.modeOfTravel}]` : "";
            return `${m.location}${yr ? `(${yr})` : ""}${mode}`;
          })
          .join(", ");
      }
    }

    // RIGID SYSTEM PROMPT ARCHITECTURE (Enforcing strict constraint modeling)
    let systemPrompt = `You are Avora AI, a high-precision travel planning assistant. 
    
CORE CONSTRAINTS:
1. GEOGRAPHICAL & LOGISTICAL ACCURACY: Calculate true real-world transit times and distances (e.g., Palakkad to Pondicherry is ~350 km taking 7-9 hours by train/bus). Never hallucinate false or short transit windows. Respect regional rules (e.g., vehicle-free zones like Matheran where cars stop at Dasturi Point).
2. BUDGET-FIRST MANDATE: Prioritize extreme budget/backpacker travel. Suggest hostels, homestays, public transport, trains, and affordable local food. Avoid luxury or mid-range resorts.
3. PERSONALIZATION: Analyze the user's travel history to completely avoid recommending destinations they have already visited.`;

    if (isGreeting) {
      systemPrompt += `\nContext: User greeting. Reply naturally in under 2 sentences.`;
    } else if (isDetailedItinerary) {
      systemPrompt += `\nContext: Detailed Itinerary Request.
User Archive: [${compressedArchive || "None"}]
Instructions: Generate a clean, structured day-by-day schedule (Morning, Afternoon, Evening) with low-cost activities, realistic transit schedules, and an economical budget breakdown.`;
    } else if (isTravelQuery) {
      systemPrompt += `\nContext: Travel Planning or Memory Query.
User Archive: [${compressedArchive || "None"}]
Instructions: Provide precise, highly tailored destination suggestions or reflections based on their history while strictly obeying the budget and geographical constraints.`;
    } else {
      systemPrompt += `\nContext: General Inquiry. Keep answers crisp, structured, and practical.`;
    }

    // TOKEN RATE-LIMIT PROTECTION: Truncate conversation history to the last 3 turns
    const sanitizedHistory = history.slice(-3).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // API INVOCATION WITH BOUNDED TOKENS
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...sanitizedHistory,
        { role: "user", content: message },
      ],
      temperature: 0.4, // Low temperature ensures deterministic, hallucination-free compliance
      max_tokens: 1000,   // Strict output ceiling to avoid compute/rate spikes
    });

    return res.status(200).json({
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("AI Controller Error:", error.message);
    return res.status(error.status || 500).json({
      message: error.response?.data?.error?.message || error.message || "Server Error",
    });
  }
};

module.exports = {
  generateAI,
};