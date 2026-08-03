import api from "./axios";

// Get all memories

export const getMemories = async (search = "") => {

    const response = await api.get("/api/memories", {
        params: { search },
    });

    return response.data;

};

// Create memory

export const createMemory = async (formData) => {

    const response = await api.post(
        "/api/memories",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;

};

// Get single memory

export const getMemoryById = async (id) => {

    const response = await api.get(`/api/memories/${id}`);

    return response.data;

};

// Update memory

export const updateMemory = async (id, formData) => {

    const response = await api.put(
        `/api/memories/${id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;

};

// Delete memory

export const deleteMemory = async (id) => {

    const response = await api.delete(
        `/api/memories/${id}`
    );

    return response.data;

};

// Delete media

export const deleteMedia = async (
    memoryId,
    mediaPublicId
) => {

    const response = await api.delete(
        `/api/memories/${memoryId}/media`,
        {
            data: {
                mediaPublicId,
            },
        }
    );

    return response.data;

};