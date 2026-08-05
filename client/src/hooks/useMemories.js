import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getMemories } from "../api/memoryApi";

// ==========================================
// GLOBAL CROSS-TAB BROADCAST CHANNEL
// ==========================================
const memoryChannel = new BroadcastChannel("avora_memory_channel");

export const notifyOtherTabs = () => {
  memoryChannel.postMessage("memory_updated");
  localStorage.setItem("avora_memory_updated", Date.now().toString());
};

// ==========================================
// USE MEMORIES CUSTOM HOOK
// ==========================================
/**
 * Custom hook to fetch and manage the user's memories.
 * Automatically synchronizes state across navigation, window focus, and cross-tab broadcasts.
 */
const useMemories = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  /**
   * Fetches memories from the API, optionally filtering by search term.
   */
  const fetchMemories = async (search = "") => {
    try {
      setLoading(true);
      const data = await getMemories(search);
      setMemories(data);
      setError("");
    } catch (err) {
      console.error("Error fetching memories:", err);
      setError(err.response?.data?.message || "Failed to load memories.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch memories whenever the navigation route changes
  useEffect(() => {
    fetchMemories();
  }, [location.key]);

  // Auto-sync across other open tabs, windows, and focus changes
  useEffect(() => {
    const handleFocus = () => {
      fetchMemories();
    };

    // Listen for broadcast messages from other tabs
    const handleChannelMessage = (event) => {
      if (event.data === "memory_updated") {
        fetchMemories();
      }
    };

    // Fallback storage listener
    const handleStorageChange = (e) => {
      if (e.key === "avora_memory_updated") {
        fetchMemories();
      }
    };

    memoryChannel.onmessage = handleChannelMessage;
    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return {
    memories,
    loading,
    error,
    fetchMemories,
  };
};

export default useMemories;