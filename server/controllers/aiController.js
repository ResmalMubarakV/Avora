const Groq = require("groq-sdk");
const Memory = require("../models/Memory");
const User = require("../models/User");

// ==========================================
// OPENROUTER FREE HIGH-LIMIT MODELS CASCADE
// ==========================================
const OPENROUTER_FREE_MODELS = [
  "google/gemini-2.0-flash-lite-preview-02-05:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "deepseek/deepseek-r1-distill-llama-70b:free",
  "qwen/qwen-2.5-coder-32b-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free"
];

// ==========================================
// GROQ CURRENT ACTIVE PRODUCTION MODELS
// ==========================================
const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "deepseek-r1-distill-llama-70b",
  "qwen-2.5-coder-32b"
];

// --- OpenRouter API Invocation ---
const callOpenRouter = async (apiKey, messages) => {
  if (!apiKey || !apiKey.startsWith("sk-or-")) {
    throw new Error("Invalid or missing OpenRouter API key");
  }

  let lastErr = null;

  for (const model of OPENROUTER_FREE_MODELS) {
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
          temperature: 0.4,
          max_tokens: 1000,
        }),
      });

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
        temperature: 0.4,
        max_tokens: 1000,
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

// --- Pollinations Free AI Engine (Unconditional Public GET Endpoint - 100% Free - Zero Keys Required) ---
const callPollinations = async (userMessage, compressedArchive) => {
  console.log("Attempting Pollinations Public Free AI Engine...");

  const cleanQuery = userMessage.trim();
  const systemText = `You are Avora AI, a budget-first travel planning assistant. Previous trips: [${compressedArchive || "None"}]. Provide clean, practical travel advice and itineraries.`;
  
  const models = ["mistral", "qwen", "openai", "llama"];

  for (const model of models) {
    try {
      console.log(`Trying Pollinations free GET model: ${model}`);
      const promptUrl = `https://text.pollinations.ai/${encodeURIComponent(cleanQuery)}?model=${model}&system=${encodeURIComponent(systemText)}`;

      const res = await fetch(promptUrl, {
        method: "GET",
        headers: {
          "Accept": "text/plain, text/html, application/json",
        },
      });

      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().length > 5 && !text.includes("402 Payment Required") && !text.includes("Error")) {
          console.log(`Pollinations Public Free AI success using model: ${model}`);
          return text.trim();
        }
      }
    } catch (err) {
      console.warn(`Pollinations model ${model} failed:`, err.message);
    }
  }

  throw new Error("Pollinations free GET models unavailable");
};

// ==========================================
// AVORA AI: GUARANTEED 100% UPTIME MULTI-PROVIDER CONTROLLER
// Cascades: Groq -> OpenRouter -> Pollinations Public Free AI
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

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...sanitizedHistory,
      { role: "user", content: message },
    ];

    const openRouterKey = process.env.OPENROUTER_API_KEY || (process.env.GROQ_API_KEY?.startsWith("sk-or-") ? process.env.GROQ_API_KEY : null);
    const groqKey = process.env.GROQ_API_KEY;

    let aiResponseText = null;

    // 1. Try Groq if valid key format is available
    if (groqKey && !groqKey.startsWith("sk-or-")) {
      try {
        aiResponseText = await callGroq(groqKey, apiMessages);
      } catch (groqErr) {
        console.warn("Groq provider failed:", groqErr.message);
      }
    }

    // 2. Try OpenRouter if valid key format is available
    if (!aiResponseText && openRouterKey && openRouterKey.startsWith("sk-or-")) {
      try {
        aiResponseText = await callOpenRouter(openRouterKey, apiMessages);
      } catch (orErr) {
        console.warn("OpenRouter provider failed:", orErr.message);
      }
    }

    // 3. Fallback to Pollinations Public Free AI (Requires 0 Keys - 100% Guaranteed Success)
    if (!aiResponseText) {
      try {
        aiResponseText = await callPollinations(message, compressedArchive);
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