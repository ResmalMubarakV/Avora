const Groq = require("groq-sdk");
const Memory = require("../models/Memory");
const User = require("../models/User");

// ==========================================
// LIGHTSPEED HIGH-PERFORMANCE GROQ MODELS
// ==========================================
// Primary: openai/gpt-oss-120b (Deep ChatGPT-level reasoning & rich paragraphs)
// Fast Fallback: openai/gpt-oss-20b & qwen/qwen3.8-27b (Sub-500ms lightning speed)
const LIGHTSPEED_GROQ_MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
];

// ==========================================
// AVORA AI: LIGHTSPEED DIRECT AI CONTROLLER
// ==========================================
const generateAI = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const { message, history = [] } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const user = await User.findById(req.user._id).select("name username location bio");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch user's recorded memories to supply rich personalized context
    const allMemories = await Memory.find({ user: req.user._id })
      .sort({ startDate: -1 })
      .select("title description location startDate endDate modeOfTravel isLiked isPinned");

    let userMemoriesContext = "User has no recorded travel memories in Avora yet.";
    if (allMemories.length > 0) {
      userMemoriesContext = allMemories
        .map((m, idx) => {
          const dateStr = m.startDate
            ? new Date(m.startDate).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
            : "Unknown date";
          const mode = m.modeOfTravel ? `via ${m.modeOfTravel}` : "";
          const tags = [m.isPinned ? "📌 Pinned" : "", m.isLiked ? "❤️ Favorite" : ""]
            .filter(Boolean)
            .join(" ");
          const desc = m.description ? `\n   Notes: "${m.description.slice(0, 300)}"` : "";
          return `${idx + 1}. [${m.title || m.location}] - Location: ${m.location} (${dateStr}${mode ? ` ${mode}` : ""}) ${tags}${desc}`;
        })
        .join("\n");
    }

    const systemPrompt = `You are Avora AI, an intelligent, perceptive, and highly articulate AI travel companion and world-class travel strategist (built with the conversational sophistication, natural prose, and deep reasoning of ChatGPT and Google Gemini).

# USER PROFILE:
- Name: ${user.name || user.username || "Traveler"}
- Location: ${user.location || "Not specified"}
- Bio: ${user.bio || "Avora travel community member"}

# USER'S RECORDED AVORA TRAVEL MEMORIES:
${userMemoriesContext}

# CORE PRINCIPLES & RESPONSE GUIDELINES:
1. DEEPLY ANALYZE THE USER'S PROMPT & INTENT:
   - Thoroughly comprehend the user's complete prompt, exact question, tone, and intended outcome.
   - Tailor the format, structure, and depth to PRECISELY match what the user is asking for:
     • REFLECTIONS / IMPRESSIONS / FEELINGS (e.g. "how are my travel locations", "what do you feel about my trips", "analyze my travel style"):
       -> Write thoughtful, rich, and cohesive prose paragraphs. Appreciate the character, contrast, and rhythm of their destinations (e.g., serene mountain retreats, vibrant cultural towns, scenic road trips). Share perceptive commentary on what their journey choices reflect about their travel personality, rather than outputting dry year-by-year bulleted lists.
     • TRIP PLANNING & ITINERARIES (e.g. "plan a 4-day trip to Manali", "give me an itinerary"):
       -> Provide structured, immersive day-by-day schedules (Morning, Afternoon, Evening) with realistic transit, highlight sights, local food spots, and practical budget tips.
     • TRAVEL ADVICE & INQUIRIES (e.g. "best time to visit", "what should I pack", "hidden gems"):
       -> Provide rich, practical, and well-researched advice with clear explanations and insider wisdom.
     • CONVERSATIONAL DIALOGUE & CHAT:
       -> Respond with natural, friendly, warm, and engaging paragraphs.
     • LISTS OR COMPARISONS:
       -> Use bulleted lists or comparison tables ONLY when specifically requested or when structuring complex logistics. Never reduce qualitative questions into mechanical bulleted timelines.

2. SEAMLESS PERSONALIZATION:
   - When the user asks about their travel history, past destinations, or impressions, reference their actual recorded Avora memories and notes thoughtfully and authentically.
   - When recommending new destinations, suggest fresh, exciting places tailored to their travel tastes, avoiding places they have already visited unless they ask for revisits or nearby extensions.

3. ACCURACY & LOGISTICS:
   - Ensure real-world geographical consistency, realistic travel times, and practical advice.

4. TONE & WRITING STYLE:
   - Warm, perceptive, articulate, imaginative, and helpful.
   - Write in beautiful, natural markdown with clear paragraph breaks and bold text for key highlights.`;

    const sanitizedHistory = history.slice(-10).map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    }));

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...sanitizedHistory,
      { role: "user", content: message },
    ];

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      throw new Error("GROQ_API_KEY is not configured in environment variables.");
    }

    const client = new Groq({ apiKey: groqKey });
    let aiResponseText = null;
    let lastErr = null;

    // Direct, ultra-fast execution through Groq hardware acceleration
    for (const model of LIGHTSPEED_GROQ_MODELS) {
      try {
        const completion = await client.chat.completions.create({
          model: model,
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 2000,
        });

        const responseText = completion.choices?.[0]?.message?.content;
        if (responseText && responseText.trim().length > 0) {
          aiResponseText = responseText.trim();
          break;
        }
      } catch (err) {
        console.warn(`Groq model ${model} error:`, err.message);
        lastErr = err;
      }
    }

    if (!aiResponseText) {
      throw lastErr || new Error("Failed to generate response. Please try again.");
    }

    return res.status(200).json({
      response: aiResponseText,
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