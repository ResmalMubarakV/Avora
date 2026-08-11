import api from "./axios";

// ==========================================
// MEMORY API SERVICES
// ==========================================

export const getMemories = async (params = {}) => {
  const response = await api.get("/api/memories", { params });
  return response.data;
};

// For dashboard only (all data with pin priority)
export const getDashboardMemories = async () => {
  const response = await api.get("/api/memories/dashboard-overview");
  return response.data;
};

export const createMemory = async (formData) => {
  const response = await api.post("/api/memories", formData);
  return response.data;
};

export const getMemoryById = async (id) => {
  const response = await api.get(`/api/memories/${id}`);
  return response.data;
};

export const updateMemory = async (id, formData) => {
  const response = await api.put(`/api/memories/${id}`, formData);
  return response.data;
};

export const deleteMemory = async (id) => {
  const response = await api.delete(`/api/memories/${id}`);
  return response.data;
};

export const deleteMedia = async (memoryId, mediaPublicId) => {
  const response = await api.delete(`/api/memories/${memoryId}/media`, {
    data: { mediaPublicId },
  });
  return response.data;
};