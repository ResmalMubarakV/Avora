import { useState, useRef, useEffect } from "react";
import { Sparkles, X, SendHorizontal, Bot } from "lucide-react";
import useAI from "../../hooks/useAI";
import MarkdownRenderer from "../ai/MarkdownRenderer";

// ==========================================
// FLOATING AI CHAT COMPONENT
// ==========================================
/**
 * A floating action button (FAB) widget anchored to the dashboard layout.
 * Expands into a clean, responsive pop-up conversational assistant window.
 */
const FloatingAIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  const {
    messages,
    loading,
    sendMessage,
    newChat,
  } = useAI();

  // Auto-scroll to latest message inside the popup
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;
    sendMessage(inputMessage.trim());
    setInputMessage("");
  };

  return (
    // Adjusted positioning: moved slightly higher up (bottom-10) and further left (right-10 / sm:right-12)
    <div className="fixed bottom-10 right-8 sm:right-10 z-50">
      {/* Pop-up Chat Window */}
      {isOpen && (
        <div className="mb-4 flex flex-col h-[32rem] w-[90vw] sm:w-[24rem] rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-[#3559D4] to-[#1E3A8A] px-4 py-3.5 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold">Avora Assistant</h3>
                <p className="text-[10px] text-blue-100/80">Always here to help your journey</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={newChat}
                className="rounded-lg px-2.5 py-1 text-xs font-medium text-white/90 hover:bg-white/10 transition cursor-pointer"
                title="Clear Chat"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Stream Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#3559D4] mb-3">
                  <Sparkles size={24} />
                </div>
                <h4 className="text-sm font-bold text-slate-900">How can I help today?</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Ask me for trip ideas, packing tips, or advice on your memories!
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm ${
                      msg.role === "user"
                        ? "bg-[#3559D4] text-white rounded-br-sm"
                        : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-sm shadow-sm"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none text-xs">
                        <MarkdownRenderer content={msg.content} />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#3559D4] animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-[#3559D4] animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-[#3559D4] animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSubmit} className="border-t border-slate-100 bg-white p-3 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none focus:border-[#3559D4] focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3559D4] text-white shadow-md hover:bg-[#2748BC] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <SendHorizontal size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open AI Assistant"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#3559D4] via-[#4166E0] to-[#1E3A8A] text-white shadow-xl shadow-blue-600/30 transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 cursor-pointer ml-auto"
      >
        <Sparkles size={24} className="transition-transform duration-300 group-hover:rotate-12" />
        
        {/* Subtle pulsing ring effect */}
        <span className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping pointer-events-none" />
      </button>
    </div>
  );
};

export default FloatingAIChat;