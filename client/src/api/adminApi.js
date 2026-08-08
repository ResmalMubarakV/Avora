import api from "./axios";

// ==========================================
// ADMIN API SERVICES
// ==========================================
/**
 * Centralized API calls for administrative operations,
 * including dashboard analytics, user moderation, and memory management.
 */

// Dashboard
export const getDashboard = async () => {
    const response = await api.get("/api/admin/dashboard");
    return response.data;
};

// Users
export const getUsers = async (params = {}) => {
    const response = await api.get("/api/admin/users", { params });
    return response.data;
};

export const approveUser = async (id) => {
    const response = await api.patch(`/api/admin/users/${id}/approve`);
    return response.data;
};

export const suspendUser = async (id) => {
    const response = await api.patch(`/api/admin/users/${id}/suspend`);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/api/admin/users/${id}`);
    return response.data;
};

// Memories
export const getMemories = async (params = {}) => {
    const response = await api.get("/api/admin/memories", { params });
    return response.data;
};

export const deleteMemory = async (id) => {
    const response = await api.delete(`/api/admin/memories/${id}`);
    return response.data;
};

// Settings / Admin Password
export const updateAdminPassword = async (passwordData) => {
    const response = await api.put("/api/admin/password", passwordData);
    return response.data;
};