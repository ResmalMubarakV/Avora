import { useRef, useEffect } from "react";

import AIHeader from "../../components/ai/AIHeader";
import AIConversation from "../../components/ai/AIConversation";
import ChatInput from "../../components/ai/ChatInput";

import useAI from "../../hooks/useAI";
import PageTitle from "../../components/common/PageTitle";

// ==========================================
// AI PAGE COMPONENT
// ==========================================
/**
 * Main AI Assistant page component. Manages conversational chat state,
 * decorative background gradients, auto-focus behavior, and layout composition.
 */
const AI = () => {
  const {
    messages,
    loading,
    sendMessage,
    newChat,
    regenerate,
    conversationTitle,
  } = useAI();

  const inputRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  return (
    <main className="relative flex h-full flex-col overflow-hidden bg-slate-50/50">
      <PageTitle title={conversationTitle ? `${conversationTitle} — AI Assistant` : "AI Travel Assistant"} />

      {/* Immersive Decorative Background Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-blue-400/10 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-[32rem] w-[32rem] rounded-full bg-indigo-400/10 blur-[120px]" />
      </div>

      {/* Main Chat Interface Layout */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Header with Title and New Chat Control */}
        <AIHeader title={conversationTitle} onNewChat={newChat} />

        {/* Scrollable Conversation Stream */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6">
          <AIConversation
            messages={messages}
            loading={loading}
            onSuggestionClick={sendMessage}
            onRegenerate={regenerate}
          />
        </div>

        {/* Bottom Input Bar */}
        <ChatInput
          ref={inputRef}
          loading={loading}
          onSend={sendMessage}
        />
      </div>
    </main>
  );
};

export default AI;