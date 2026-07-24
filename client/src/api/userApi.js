import api from "./axios";

export const getMyProfile = async () => {
    const response = await api.get("/api/users/profile");
    return response.data;
};