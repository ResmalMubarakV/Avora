import api from "./axios";

// ==========================================
// PUBLIC API SERVICES
// ==========================================

/**
 * Fetches a list of featured travelers for the public feed.
 * @returns {Promise<Array>} Array of featured user profiles.
 */
export const getFeaturedTravelers = async () => {
  const response = await api.get("/api/public/travelers");
  return response.data;
};

/**
 * Fetches a user's public profile by their username.
 * @param {string} username - The target user's username.
 * @returns {Promise<Object>} The user's public profile data.
 */
export const getPublicProfile = async (username) => {
  const response = await api.get(`/api/public/${username}`);
  return response.data;
};

/**
 * Fetches a specific public memory using the username and memory slug.
 * @param {string} username - The author's username.
 * @param {string} slug - The URL-friendly slug of the memory.
 * @returns {Promise<Object>} The public memory object.
 */
export const getPublicMemory = async (username, slug) => {
  const response = await api.get(`/api/public/${username}/${slug}`);
  return response.data;
};