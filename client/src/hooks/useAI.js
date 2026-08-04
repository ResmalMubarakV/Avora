import { useEffect, useState } from "react";
import { askAI } from "../api/aiApi";

const STORAGE_KEY = "avora_ai_chat";

export default function useAI() {

    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false);

    const [lastPrompt, setLastPrompt] = useState("");

    /* Load Previous Chat */

    useEffect(() => {

        const savedChat = localStorage.getItem(STORAGE_KEY);

        if (savedChat) {

            setMessages(JSON.parse(savedChat));

        }

    }, []);

    /* Save Chat */

    useEffect(() => {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(messages)
        );

    }, [messages]);

    /* Send Message */

    const sendMessage = async (message) => {

        if (!message.trim() || loading) return;

        setLastPrompt(message);

        const userMessage = {
            role: "user",
            content: message,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [
            ...prev,
            userMessage,
        ]);

        try {

            setLoading(true);

            const recentHistory = messages.slice(-10);

            const response = await askAI(
                message,
                recentHistory
            );

            setMessages((prev) => [

                ...prev,

                {
                    role: "assistant",
                    content: response,
                    timestamp: new Date().toISOString(),
                },

            ]);

        } catch {

            setMessages((prev) => [

                ...prev,

                {
                    role: "assistant",
                    content:
                        "I couldn't reach the AI service right now. Please try again.",
                    timestamp: new Date().toISOString(),
                },

            ]);

        } finally {

            setLoading(false);

        }

    };

    /* New Chat */

    const newChat = () => {

        setMessages([]);

        setLastPrompt("");

        localStorage.removeItem(STORAGE_KEY);

    };

    /* Regenerate */

    const regenerate = () => {

        if (!lastPrompt || loading) return;

        setMessages((prev) => prev.slice(0, -1));

        sendMessage(lastPrompt);

    };

    /* Conversation Title */

    const conversationTitle =

        messages.length > 0

            ? messages[0].content.slice(0, 40)

            : "New Chat";

    return {

        messages,

        loading,

        sendMessage,

        newChat,

        regenerate,

        conversationTitle,

    };

}