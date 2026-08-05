import { useEffect, useRef } from "react";

import EmptyState from "./EmptyState";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

// ==========================================
// AI CONVERSATION STREAM COMPONENT
// ==========================================
/**
 * Renders active conversation stream with auto-scrolling and clean spacing.
 */
const AIConversation = ({
  messages,
  loading,
  onSuggestionClick,
  onRegenerate,
}) => {
  const bottomRef = useRef(null);

  // --- Auto-scroll to bottom on message updates or loading state changes ---
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Render empty state placeholder if no messages exist yet
  if (messages.length === 0) {
    return <EmptyState onSelect={onSuggestionClick} />;
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-2 py-8 pb-40 sm:px-4">
      {messages.map((message, index) => {
        const isLastAssistantMessage =
          message.role === "assistant" &&
          index === messages.map((m) => m.role).lastIndexOf("assistant");

        return (
          <div
            key={index}
            className="animate-in fade-in slide-in-from-bottom-3 duration-300"
          >
            <ChatMessage
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
              onSuggestion={onSuggestionClick}
              onRegenerate={onRegenerate}
              loading={loading}
              isLastAssistantMessage={isLastAssistantMessage}
            />
          </div>
        );
      })}

      {/* Typing Indicator when AI is generating a response */}
      {loading && <TypingIndicator />}

      {/* Scroll Anchor */}
      <div ref={bottomRef} />
    </div>
  );
};

export default AIConversation;