import { useEffect, useState } from "react";
import { getMemories } from "../api/memoryApi";

const useMemories = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMemories = async (search = "") => {
    try {
      setLoading(true);

      const data = await getMemories(search);

      setMemories(data);

      setError("");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Failed to load memories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  return {
    memories,
    loading,
    error,
    fetchMemories,
  };
};

export default useMemories;