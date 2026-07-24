import api from "./axios";

/**
 * Get featured travelers
 * GET /api/public/travelers
 */
export const getFeaturedTravelers = async () => {
    const response = await api.get("/api/public/travelers");
    return response.data;
};

/**
 * Get public profile
 * GET /api/public/:username
 */
export const getPublicProfile = async (username) => {
    const response = await api.get(`/api/public/${username}`);
    return response.data;
};

/**
 * Get public memory
 * GET /api/public/:username/:slug
 */
export const getPublicMemory = async (username, slug) => {
    const response = await api.get(`/api/public/${username}/${slug}`);
    return response.data;
};