import { useEffect, useState } from "react";
import { askAI } from "../api/aiApi";

const STORAGE_KEY = "avora_ai_chat";

// ==========================================
// USE AI CUSTOM HOOK
// ==========================================
/**
 * Custom hook to manage AI chat state, history, and API interactions.
 * Automatically persists the ongoing conversation to localStorage.
 * 
 * @returns {Object} AI chat state variables and controller methods.
 */
export default function useAI() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");

  // --- Load Previous Chat ---
  useEffect(() => {
    const savedChat = localStorage.getItem(STORAGE_KEY);
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    }
  }, []);

  // --- Save Chat ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // --- Send Message ---
  /**
   * Sends a user message to the AI, maintaining context of the last 10 messages.
   * @param {string} message - The user's prompt.
   */
  const sendMessage = async (message) => {
    if (!message.trim() || loading) return;

    setLastPrompt(message);

    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      setLoading(true);

      // Pass only the most recent context to keep token usage efficient
      const recentHistory = messages.slice(-10);
      const response = await askAI(message, recentHistory);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I couldn't reach the AI service right now. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // --- New Chat ---
  /**
   * Clears the current conversation from state and localStorage.
   */
  const newChat = () => {
    setMessages([]);
    setLastPrompt("");
    localStorage.removeItem(STORAGE_KEY);
  };

  // --- Regenerate ---
  /**
   * Removes the last assistant response and resends the previous user prompt.
   */
  const regenerate = () => {
    if (!lastPrompt || loading) return;

    setMessages((prev) => prev.slice(0, -1));
    sendMessage(lastPrompt);
  };

  // --- Dynamic Contextual Topic Title Generator ---
  const getSmartTitle = () => {
    if (messages.length === 0) return "New Chat";

    // List of common short filler/greeting words to skip
    const ignoredWords = ["hi", "hello", "hey", "hii", "greetings", "good morning", "good evening", "ok", "thanks"];

    // Find all valid user messages
    const userMsgs = messages.filter((m) => {
      if (m.role !== "user") return false;
      const text = m.content.trim().toLowerCase();
      return !ignoredWords.includes(text) && text.length > 2;
    });

    if (userMsgs.length === 0) {
      const first = messages.find((m) => m.role === "user");
      return first ? first.content : "New Chat";
    }

    // Extract the latest meaningful topic/question to dynamically adapt header
    const latestMsg = userMsgs[userMsgs.length - 1].content.toLowerCase();

    // Context analysis for topic-specific short titles
    if (latestMsg.includes("climate") || latestMsg.includes("weather") || latestMsg.includes("temperature")) {
      if (latestMsg.includes("kashmir")) return "Kashmir Weather";
      if (latestMsg.includes("matheran")) return "Matheran Weather";
      return "Weather & Climate";
    }
    if (latestMsg.includes("budget") || latestMsg.includes("cost") || latestMsg.includes("expense") || latestMsg.includes("price")) {
      if (latestMsg.includes("kashmir")) return "Kashmir Budget";
      if (latestMsg.includes("matheran")) return "Matheran Budget";
      return "Estimated Budget";
    }
    if (latestMsg.includes("itinerary") || latestMsg.includes("plan") || latestMsg.includes("schedule") || latestMsg.includes("trip")) {
      if (latestMsg.includes("kashmir")) return "Kashmir Itinerary";
      if (latestMsg.includes("matheran")) return "Matheran Itinerary";
      return "Trip Planning";
    }
    if (latestMsg.includes("food") || latestMsg.includes("eat") || latestMsg.includes("restaurant") || latestMsg.includes("cuisine")) {
      return "Food & Dining";
    }
    if (latestMsg.includes("hotel") || latestMsg.includes("stay") || latestMsg.includes("accommodation") || latestMsg.includes("room")) {
      return "Accommodation Guide";
    }
    if (latestMsg.includes("things to do") || latestMsg.includes("explore") || latestMsg.includes("activities")) {
      if (latestMsg.includes("kashmir")) return "Kashmir Activities";
      return "Things To Do";
    }
    if (latestMsg.includes("kashmir")) return "Kashmir Travel";
    if (latestMsg.includes("matheran")) return "Matheran Trip";

    // Fallback: Capitalize or summarize the recent prompt concisely (max 3 words)
    const cleanText = userMsgs[userMsgs.length - 1].content.trim().split("\n")[0];
    const words = cleanText.split(" ");
    if (words.length > 3) {
      return words.slice(0, 3).join(" ") + "...";
    }

    return cleanText;
  };

  const conversationTitle = getSmartTitle();

  return {
    messages,
    loading,
    sendMessage,
    newChat,
    regenerate,
    conversationTitle,
  };
}