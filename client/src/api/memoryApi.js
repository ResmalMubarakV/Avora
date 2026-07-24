import api from "./axios";

export const getMemories = async (search = "") => {
  const response = await api.get("/api/memories", {
    params: { search },
  });

  return response.data;
};