import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getMemories } from "../api/memoryApi";
import { toast } from "sonner";

// ==========================================
// USE MEMORIES CUSTOM HOOK
// ==========================================
const useMemories = () => {
  const [searchParams] = useSearchParams();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const page = searchParams.get("page") || 1;
  const sort = searchParams.get("sort") || "newest";
  const filter = searchParams.get("filter") || "";
  const search = searchParams.get("search") || "";
  const year = searchParams.get("year") || "all";

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const data = await getMemories({ page, sort, filter, search, year });
      setMemories(data);
      setError("");
    } catch (err) {
      console.error("Error fetching memories:", err);
      const errorMsg = err.response?.data?.message || "Failed to load memories.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch automatically whenever search parameters or filters change
  useEffect(() => {
    fetchMemories();
  }, [page, sort, filter, search, year]);

  return {
    memories,
    loading,
    error,
    fetchMemories,
    refetch: fetchMemories,
  };
};

export default useMemories;