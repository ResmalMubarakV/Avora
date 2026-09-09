import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

import AIHeader from "../../components/ai/AIHeader";
import AIConversation from "../../components/ai/AIConversation";
import ChatInput from "../../components/ai/ChatInput";

import useAI from "../../hooks/useAI";
import PageTitle from "../../components/common/PageTitle";

// ==========================================
// AI PAGE COMPONENT (100% FIT NO-SCROLL ON LANDING)
// ==========================================
/**
 * Main AI Assistant page component. Manages conversational chat state,
 * decorative background gradients, auto-focus behavior, and 100dvh layout composition.
 */
const AI = () => {
  const location = useLocation();
  const {
    messages,
    loading,
    sendMessage,
    newChat,
    regenerate,
    conversationTitle,
  } = useAI();

  const inputRef = useRef(null);

  // Automatically scroll to top on initial page load or redirect
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  return (
    <main className="relative flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <PageTitle title={conversationTitle ? `${conversationTitle} — AI Assistant` : "AI Travel Assistant"} />

      {/* Immersive Decorative Background Glows (GPU Accelerated & Viewport Adaptive) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        <div className="absolute -left-20 -top-20 sm:-left-32 sm:-top-32 h-64 w-64 sm:h-[32rem] sm:w-[32rem] lg:h-[42rem] lg:w-[42rem] rounded-full bg-blue-400/10 dark:bg-indigo-600/15 blur-[80px] sm:blur-[130px] transform-gpu" />
        <div className="absolute -right-20 bottom-0 sm:-right-32 sm:bottom-0 h-64 w-64 sm:h-[34rem] sm:w-[34rem] lg:h-[46rem] lg:w-[46rem] rounded-full bg-indigo-400/10 dark:bg-blue-500/15 blur-[80px] sm:blur-[130px] transform-gpu" />
      </div>

      {/* Main Chat Interface Layout */}
      <div className="relative z-10 flex h-full w-full flex-col overflow-hidden justify-between">
        {/* Header with Title and New Chat Control */}
        <AIHeader title={conversationTitle} onNewChat={newChat} />

        {/* Scrollable Conversation Stream / Vertically Centered Landing Empty State */}
        <div className="flex-1 min-h-0 overflow-y-auto px-2 sm:px-6 md:px-8 lg:px-12 flex flex-col">
          <AIConversation
            messages={messages}
            loading={loading}
            onSuggestionClick={sendMessage}
            onRegenerate={regenerate}
          />
        </div>

        {/* Bottom Input Bar with Safe Area Support */}
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