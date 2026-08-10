import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getMemories } from "../api/memoryApi";

// ==========================================
// USE MEMORIES CUSTOM HOOK
// ==========================================
const useMemories = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  const fetchMemories = async (search = "") => {
    try {
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

  // Initial fetch on route change
  useEffect(() => {
    fetchMemories();
  }, [location.key]);

  return {
    memories,
    loading,
    error,
    fetchMemories,
    refetch: fetchMemories,
  };
};

export default useMemories;