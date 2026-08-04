import api from "./axios";

export const askAI = async (
    message,
    history = []
) => {

    const { data } = await api.post(
        "/api/ai",
        {
            message,
            history,
        }
    );

    return data.response;

};