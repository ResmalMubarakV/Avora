import { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, X, SendHorizontal, Bot, GripVertical } from "lucide-react";
import useAI from "../../hooks/useAI";
import MarkdownRenderer from "../ai/MarkdownRenderer";

// ==========================================
// FLOATING AI CHAT COMPONENT (ULTRA-FAST 60FPS DRAG ENGINE)
// ==========================================
/**
 * Fixed Floating Action Button (FAB) anchored to bottom-right corner of viewport.
 * Features a 0ms-latency GPU-accelerated draggable AI chat window.
 */
const FloatingAIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Position state for chatbox drag & drop
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const rafRef = useRef(null);

  const {
    messages,
    loading,
    sendMessage,
    newChat,
  } = useAI();

  // Auto-scroll to latest message inside popup
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

  // --- Ultra-Fast 60FPS Throttled Drag Handlers ---
  const handleStart = (clientX, clientY) => {
    setIsDragging(true);
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  const handleMove = useCallback((clientX, clientY) => {
    if (!isDragging) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const deltaX = clientX - dragRef.current.startX;
      const deltaY = clientY - dragRef.current.startY;

      setPosition({
        x: dragRef.current.initialX + deltaX,
        y: dragRef.current.initialY + deltaY,
      });
    });
  }, [isDragging]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  }, []);

  useEffect(() => {
    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onMouseUp = () => handleEnd();
    const onTouchEnd = () => handleEnd();

    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchend", onTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  return (
    <div className="fixed bottom-12 right-6 sm:bottom-16 sm:right-10 z-50 select-none">
      {/* Draggable Pop-up Chat Window */}
      {isOpen && (
        <div
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          }}
          className={`mb-3 flex flex-col h-[28rem] sm:h-[32rem] w-[88vw] sm:w-[24rem] max-w-sm rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 ${
            isDragging ? "transition-none will-change-transform shadow-3xl scale-[1.01]" : "transition-transform duration-200"
          }`}
        >
          {/* Header & Drag Handle */}
          <div
            onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
            onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
            className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-[#3559D4] to-[#1E3A8A] dark:from-indigo-950 dark:to-slate-900 px-4 py-3 text-white cursor-grab active:cursor-grabbing touch-none select-none"
          >
            <div className="flex items-center gap-2">
              <GripVertical size={16} className="text-white/60 shrink-0" />
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shrink-0">
                <Bot size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold truncate">Avora Assistant</h3>
                <p className="text-[10px] text-blue-100/80 truncate">Drag to move anywhere</p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={newChat}
                className="rounded-lg px-2 py-1 text-[11px] font-medium text-white/90 hover:bg-white/10 transition cursor-pointer"
                title="Clear Chat"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Stream Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/50 dark:bg-slate-950/60">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 dark:bg-slate-800 text-[#3559D4] dark:text-indigo-400 mb-2.5">
                  <Sparkles size={22} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">How can I help today?</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
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
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs ${
                      msg.role === "user"
                        ? "bg-[#3559D4] dark:bg-indigo-600 text-white rounded-br-sm"
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-tl-sm shadow-xs"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none text-xs">
                        <MarkdownRenderer content={msg.content} />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#3559D4] dark:bg-indigo-400 animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-[#3559D4] dark:bg-indigo-400 animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-[#3559D4] dark:bg-indigo-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSubmit} className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#3559D4] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#3559D4] dark:bg-indigo-600 text-white shadow-md hover:bg-[#2748BC] dark:hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <SendHorizontal size={15} />
            </button>
          </form>
        </div>
      )}

      {/* Fixed Floating Action Button (FAB) - Always Anchored in Corner */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open AI Assistant"
        className="group relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#3559D4] via-[#4166E0] to-[#1E3A8A] dark:from-indigo-600 dark:to-blue-700 text-white shadow-lg sm:shadow-xl shadow-blue-600/30 dark:shadow-indigo-900/50 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ml-auto"
      >
        <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:rotate-12" />
        
        {/* Subtle pulsing ring effect */}
        <span className="absolute inset-0 rounded-full bg-blue-400 dark:bg-indigo-400 opacity-20 animate-ping pointer-events-none" />
      </button>
    </div>
  );
};

export default FloatingAIChat;