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
  const lastAssistantRef = useRef(null);
  const isFirstRender = useRef(true);
  const prevMessagesCount = useRef(messages.length);
  const prevLoading = useRef(loading);

  // --- Smart auto-scroll: Scroll to top of new assistant responses so user reads from the beginning ---
  useEffect(() => {
    if (messages.length === 0) {
      prevMessagesCount.current = 0;
      prevLoading.current = loading;
      return;
    }

    const lastMessage = messages[messages.length - 1];
    const isNewMessage = messages.length > prevMessagesCount.current;
    const justFinishedLoading = prevLoading.current && !loading;

    // 1. Initial page load with saved messages
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (lastMessage?.role === "assistant" && lastAssistantRef.current) {
        lastAssistantRef.current.scrollIntoView({ behavior: "instant", block: "start" });
      } else {
        bottomRef.current?.scrollIntoView({ behavior: "instant" });
      }
      prevMessagesCount.current = messages.length;
      prevLoading.current = loading;
      return;
    }

    // 2. AI response just arrived -> Scroll to top of the new AI message
    if (lastMessage?.role === "assistant" && (isNewMessage || justFinishedLoading)) {
      const timer = setTimeout(() => {
        if (lastAssistantRef.current) {
          lastAssistantRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 60);

      prevMessagesCount.current = messages.length;
      prevLoading.current = loading;
      return () => clearTimeout(timer);
    }

    // 3. User sent a message or AI is typing -> Scroll to bottom
    if (loading || lastMessage?.role === "user") {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }

    prevMessagesCount.current = messages.length;
    prevLoading.current = loading;
  }, [messages, loading]);

  // Render empty state placeholder if no messages exist yet
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center w-full min-h-full py-2 sm:py-4 overflow-y-auto overflow-x-hidden">
        <EmptyState onSelect={onSuggestionClick} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl flex-col gap-4 sm:gap-6 md:gap-7 px-1.5 sm:px-4 md:px-6 py-3 sm:py-5 md:py-6 overflow-x-hidden">
      {messages.map((message, index) => {
        const isLastAssistantMessage =
          message.role === "assistant" &&
          index === messages.map((m) => m.role).lastIndexOf("assistant");

        return (
          <div
            key={index}
            ref={isLastAssistantMessage ? lastAssistantRef : null}
            className="animate-in fade-in slide-in-from-bottom-3 duration-300 scroll-mt-4 sm:scroll-mt-6"
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
      <div ref={bottomRef} className="h-2" />
    </div>
  );
};

export default AIConversation;