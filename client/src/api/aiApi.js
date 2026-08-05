import api from "./axios";

// ==========================================
// AI API SERVICE
// ==========================================
/**
 * Sends a message and conversation history to the AI generation endpoint.
 * @param {string} message - The new message prompt from the user.
 * @param {Array} [history=[]] - The previous conversation history context.
 * @returns {Promise<string>} The AI's generated response text.
 */
export const askAI = async (message, history = []) => {
  const { data } = await api.post("/api/ai", {
    message,
    history,
  });

  return data.response;
};