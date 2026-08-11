import api from "./axios";

// ==========================================
// MEMORY API SERVICES
// ==========================================

/**
 * Fetches user memories with support for pagination, sorting, filtering, and searching.
 * @param {Object} [params={}] - Query parameters object (page, sort, filter, search).
 * @returns {Promise<Object|Array>} Paginated response object or array of memories.
 */
export const getMemories = async (params = {}) => {
  const response = await api.get("/api/memories", { params });
  return response.data;
};

/**
 * Creates a new memory.
 * @param {FormData} formData - Form data containing memory details and media files.
 * @returns {Promise<Object>} The created memory object.
 */
export const createMemory = async (formData) => {
  // Let Axios automatically compute boundaries for FormData by omitting manual Content-Type headers
  const response = await api.post("/api/memories", formData);
  return response.data;
};

/**
 * Fetches a specific memory by its ID.
 * @param {string} id - The ID of the memory to fetch.
 * @returns {Promise<Object>} The memory object.
 */
export const getMemoryById = async (id) => {
  const response = await api.get(`/api/memories/${id}`);
  return response.data;
};

/**
 * Updates an existing memory.
 * @param {string} id - The ID of the memory to update.
 * @param {FormData} formData - Form data with updated details and new media files.
 * @returns {Promise<Object>} The updated memory object.
 */
export const updateMemory = async (id, formData) => {
  // Let Axios automatically compute boundaries for FormData by omitting manual Content-Type headers
  const response = await api.put(`/api/memories/${id}`, formData);
  return response.data;
};

/**
 * Deletes a specific memory.
 * @param {string} id - The ID of the memory to delete.
 * @returns {Promise<Object>} Success message.
 */
export const deleteMemory = async (id) => {
  const response = await api.delete(`/api/memories/${id}`);
  return response.data;
};

/**
 * Deletes a specific media item from a memory.
 * @param {string} memoryId - The ID of the memory.
 * @param {string} mediaPublicId - The Cloudinary public ID of the media to delete.
 * @returns {Promise<Object>} Success message or updated memory.
 */
export const deleteMedia = async (memoryId, mediaPublicId) => {
  const response = await api.delete(`/api/memories/${memoryId}/media`, {
    data: { mediaPublicId },
  });
  return response.data;
};