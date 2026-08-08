import { useEffect, useState } from "react";
import { getMyProfile } from "../api/userApi";

// ==========================================
// USE CURRENT USER CUSTOM HOOK
// ==========================================
/**
 * Custom hook to fetch and manage the authenticated user's profile data.
 * 
 * @returns {Object} An object containing the user data, loading state, error message, and a refetch function.
 */
const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * Fetches the user profile from the API and updates local state.
   * Aborts immediately if no authentication token is present.
   */
  const fetchUser = async () => {
    // 1. Check for token first!
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      setLoading(false);
      setUser(null);
      return; // Instantly abort without making a network request
    }

    // 2. Only proceed with the fetch if a token exists
    try {
      setLoading(true);
      const data = await getMyProfile();
      setUser(data);
      setError("");
    } catch (err) {
      console.error("Error fetching current user:", err);
      setError(err.response?.data?.message || "Unable to fetch profile.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
    fetchUser,
  };
};

export default useCurrentUser;