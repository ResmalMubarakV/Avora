const Groq = require("groq-sdk");
const Memory = require("../models/Memory");
const User = require("../models/User");

// ==========================================
// OPENROUTER PRODUCTION FREE MODELS
// ==========================================
const OPENROUTER_FREE_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemini-2.0-flash-exp:free",
  "qwen/qwen-2.5-72b-instruct:free",
  "meta-llama/llama-3.1-70b-instruct:free",
  "mistralai/mistral-small-24b-instruct-2501:free",
  "google/gemma-2-9b-it:free",
  "openrouter/free"
];

// ==========================================
// GROQ PRODUCTION HIGH-PERFORMANCE MODELS
// ==========================================
const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "mixtral-8x7b-32768",
  "gemma2-9b-it"
];

// --- Google Gemini API Invocation (Gemini 2.0 Flash & 1.5 Flash Support) ---
const callGemini = async (apiKey, systemInstruction, messages) => {
  console.log("Attempting Google Gemini API...");

  const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
  let lastErr = null;

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const formattedContents = messages
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

      const payload = {
        contents: formattedContents,
        generationConfig: {
          maxOutputTokens: 2500,
          temperature: 0.7,
        },
      };

      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (res.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.log(`Google Gemini API success using model: ${model}`);
        return data.candidates[0].content.parts[0].text.trim();
      } else {
        const errMsg = data?.error?.message || `HTTP ${res.status}`;
        console.warn(`Gemini model ${model} error response:`, errMsg);
        lastErr = new Error(errMsg);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`Gemini model ${model} failed:`, err.message);
      lastErr = err;
    }
  }

  throw lastErr || new Error("Google Gemini API invocation failed");
};

// --- OpenRouter API Invocation ---
const callOpenRouter = async (apiKey, messages) => {
  if (!apiKey || !apiKey.startsWith("sk-or-")) {
    throw new Error("Invalid or missing OpenRouter API key");
  }

  let lastErr = null;

  for (const model of OPENROUTER_FREE_MODELS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      console.log(`Attempting OpenRouter AI model: ${model}`);
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://avorawayfarer.vercel.app",
          "X-Title": "Avora AI Travel Assistant",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 2500,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (res.ok && data?.choices?.[0]?.message?.content) {
        console.log(`OpenRouter AI success using model: ${model}`);
        return data.choices[0].message.content;
      } else {
        const errMsg = data?.error?.message || `HTTP ${res.status}`;
        console.warn(`OpenRouter model ${model} response error:`, errMsg);
        lastErr = new Error(errMsg);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`OpenRouter model ${model} network error:`, err.message);
      lastErr = err;
    }
  }

  throw lastErr || new Error("All OpenRouter free models failed");
};

// --- Groq API Invocation ---
const callGroq = async (apiKey, messages) => {
  if (!apiKey || apiKey.startsWith("sk-or-")) {
    throw new Error("Invalid Groq API key format");
  }

  const client = new Groq({ apiKey });
  let lastErr = null;

  for (const model of GROQ_MODELS) {
    try {
      console.log(`Attempting Groq AI model: ${model}`);
      const completion = await client.chat.completions.create({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2500,
      });

      const responseText = completion.choices?.[0]?.message?.content;
      if (responseText) {
        console.log(`Groq AI success using model: ${model}`);
        return responseText;
      }
    } catch (err) {
      console.warn(`Groq model ${model} failed:`, err.message);
      lastErr = err;
    }
  }

  throw lastErr || new Error("All Groq models failed");
};

// --- Pollinations Free AI Engine (Public Fallback) ---
const callPollinations = async (messages) => {
  console.log("Attempting Pollinations Free AI Engine...");

  const models = ["openai", "qwen", "mistral", "searchgpt"];

  for (const model of models) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      console.log(`Trying Pollinations model: ${model}`);
      const res = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/plain, application/json",
        },
        body: JSON.stringify({
          messages: messages,
          model: model,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const text = await res.text();
        if (
          text &&
          text.trim().length > 5 &&
          !text.includes("402 Payment Required") &&
          !text.includes("Error")
        ) {
          console.log(`Pollinations Free AI success using model: ${model}`);
          return text.trim();
        }
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`Pollinations model ${model} failed:`, err.message);
    }
  }

  throw new Error("Pollinations free engine unavailable");
};

// ==========================================
// AVORA AI: ADAPTIVE MULTI-PROVIDER CONTROLLER
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

    const geminiKey = process.env.GEMINI_API_KEY;
    const openRouterKey =
      process.env.OPENROUTER_API_KEY ||
      (process.env.GROQ_API_KEY?.startsWith("sk-or-") ? process.env.GROQ_API_KEY : null);
    const groqKey = process.env.GROQ_API_KEY;

    let aiResponseText = null;

    // 1. Groq (Fastest sub-second production models with Llama-3.3-70b-versatile)
    if (groqKey && !groqKey.startsWith("sk-or-")) {
      try {
        aiResponseText = await callGroq(groqKey, apiMessages);
      } catch (groqErr) {
        console.warn("Groq provider failed, trying fallbacks:", groqErr.message);
      }
    }

    // 2. OpenRouter (Free models router)
    if (!aiResponseText && openRouterKey && openRouterKey.startsWith("sk-or-")) {
      try {
        aiResponseText = await callOpenRouter(openRouterKey, apiMessages);
      } catch (orErr) {
        console.warn("OpenRouter provider failed, trying fallbacks:", orErr.message);
      }
    }

    // 3. Gemini (Advanced reasoning backup)
    if (!aiResponseText && geminiKey) {
      try {
        aiResponseText = await callGemini(geminiKey, systemPrompt, [
          ...sanitizedHistory,
          { role: "user", content: message },
        ]);
      } catch (geminiErr) {
        console.warn("Google Gemini provider failed, trying fallbacks:", geminiErr.message);
      }
    }

    // 4. Pollinations (Emergency fallback)
    if (!aiResponseText) {
      try {
        aiResponseText = await callPollinations(apiMessages);
      } catch (pollErr) {
        console.warn("Pollinations provider failed:", pollErr.message);
      }
    }

    if (!aiResponseText) {
      throw new Error("All AI providers temporarily unavailable. Please try again in a moment.");
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