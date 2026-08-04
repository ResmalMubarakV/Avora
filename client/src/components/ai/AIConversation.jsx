import { useEffect, useRef } from "react";

import EmptyState from "./EmptyState";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

const AIConversation = ({
    messages,
    loading,
    onSuggestionClick,
    onRegenerate,
}) => {

    const bottomRef = useRef(null);

    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages, loading]);

    if (messages.length === 0) {

        return (

            <EmptyState
                onSelect={onSuggestionClick}
            />

        );

    }

    return (

        <div
            className="
                mx-auto

                flex
                w-full
                max-w-4xl
                flex-col

                gap-10

                px-4
                py-10
                pb-40
            "
        >

            {messages.map((message, index) => {

                const isLastAssistantMessage =

                    message.role === "assistant"

                    &&

                    index ===

                    messages
                        .map((m) => m.role)
                        .lastIndexOf("assistant");

                return (

                    <div
                        key={index}
                        className="
                            animate-in
                            fade-in
                            slide-in-from-bottom-2
                            duration-300
                        "
                    >

                        <ChatMessage
                            role={message.role}
                            content={message.content}
                            timestamp={message.timestamp}
                            onSuggestion={onSuggestionClick}
                            onRegenerate={onRegenerate}
                            loading={loading}
                            isLastAssistantMessage={
                                isLastAssistantMessage
                            }
                        />

                    </div>

                );

            })}

            {loading && (

                <TypingIndicator />

            )}

            <div ref={bottomRef} />

        </div>

    );

};

export default AIConversation;