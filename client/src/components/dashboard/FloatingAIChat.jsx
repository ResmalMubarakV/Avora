import { useState, useRef, useEffect, useCallback } from "react";
import { X, SendHorizontal, GripVertical } from "lucide-react";
import useAI from "../../hooks/useAI";
import MarkdownRenderer from "../ai/MarkdownRenderer";
import AvoraAIIcon from "../common/AvoraAIIcon";

// ==========================================
// FLOATING AI CHAT COMPONENT (UNIQUE AVORA COPILOT)
// ==========================================
/**
 * Fixed Floating Action Button (FAB) anchored to bottom-right corner of viewport.
 * Features a bespoke Avora AI orbital button and a 0ms-latency GPU-accelerated draggable AI chat window.
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
          className={`mb-3 flex flex-col h-[28rem] sm:h-[32rem] w-[88vw] sm:w-[24rem] max-w-sm rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 ${
            isDragging ? "transition-none will-change-transform shadow-3xl scale-[1.01]" : "transition-transform duration-200"
          }`}
        >
          {/* Header & Drag Handle */}
          <div
            onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
            onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
            className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-[#1E3A8A] via-[#3559D4] to-[#4F46E5] dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 px-4 py-3 text-white cursor-grab active:cursor-grabbing touch-none select-none"
          >
            <div className="flex items-center gap-2.5">
              <GripVertical size={16} className="text-white/60 shrink-0" />
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-md shrink-0 border border-white/20">
                <AvoraAIIcon size={18} variant="current" className="text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold truncate">Avora AI Copilot</h3>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-blue-100/80 truncate">Drag anywhere across screen</p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={newChat}
                className="rounded-lg px-2 py-1 text-[11px] font-semibold text-white/90 hover:bg-white/15 transition cursor-pointer"
                title="Clear Chat"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-1.5 text-white/80 hover:bg-white/15 hover:text-white transition cursor-pointer"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Stream Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/60 dark:bg-slate-950/70">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/60 border border-blue-100 dark:border-indigo-900/50 shadow-inner mb-3">
                  <AvoraAIIcon size={30} variant="glow" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">How can Avora AI help today?</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-[220px]">
                  Ask for travel itineraries, hidden gems, budgets, or journey story ideas!
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
                        ? "bg-[#3559D4] dark:bg-indigo-600 text-white rounded-br-sm shadow-xs"
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
              placeholder="Ask Avora AI anything..."
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#3559D4] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#3559D4] to-[#1E3A8A] dark:from-indigo-600 dark:to-blue-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <SendHorizontal size={15} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button Group (FAB + Interactive Hover Chip) */}
      <div className="relative flex items-center justify-end group">
        
        {/* Hover Pill / Smart Label Badge */}
        <div className={`hidden sm:flex items-center gap-2 mr-3 px-3 py-1.5 rounded-full bg-slate-900/90 dark:bg-slate-800/95 backdrop-blur-md text-white text-xs font-semibold shadow-xl border border-white/10 opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${isOpen ? "!opacity-0" : ""}`}>
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="tracking-wide">Avora AI Copilot</span>
        </div>

        {/* The Signature Avora AI Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close AI Assistant" : "Open Avora AI Assistant"}
          className={`group/btn relative flex h-14 w-14 sm:h-15 sm:w-15 items-center justify-center rounded-full transition-all duration-500 cursor-pointer ${
            isOpen
              ? "bg-gradient-to-br from-slate-800 to-slate-950 text-white shadow-xl rotate-90 scale-95 border border-white/10"
              : "bg-gradient-to-tr from-[#1E3A8A] via-[#3559D4] to-[#0284C7] dark:from-indigo-900 dark:via-[#3559D4] dark:to-cyan-500 text-white shadow-[0_10px_35px_rgba(53,89,212,0.45)] dark:shadow-[0_10px_40px_rgba(99,102,241,0.5)] hover:scale-110 hover:shadow-[0_15px_45px_rgba(53,89,212,0.6)] active:scale-95"
          }`}
        >
          {/* Ambient Celestial Sonar Pulse (When closed) */}
          {!isOpen && (
            <>
              <span className="absolute -inset-1.5 rounded-full bg-blue-500/25 dark:bg-indigo-500/30 blur-sm animate-pulse pointer-events-none" />
              <span className="absolute -inset-1 rounded-full border border-cyan-400/40 dark:border-cyan-300/30 animate-ping opacity-30 pointer-events-none" />
              
              {/* Rotating Delicate Orbital Flight Ring */}
              <span className="absolute -inset-1.5 rounded-full border border-dashed border-cyan-300/30 dark:border-indigo-400/30 animate-[spin_12s_linear_infinite] pointer-events-none" />
            </>
          )}

          {/* Internal Glass Sheen */}
          <span className="absolute inset-0.5 rounded-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

          {/* Icon Presentation */}
          {isOpen ? (
            <X size={24} className="text-white transition-transform duration-300" />
          ) : (
            <div className="relative flex items-center justify-center transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:rotate-6">
              <AvoraAIIcon size={28} variant="glow" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default FloatingAIChat;