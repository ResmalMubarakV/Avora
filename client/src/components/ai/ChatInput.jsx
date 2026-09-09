import {
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { SendHorizontal } from "lucide-react";
import AvoraAIIcon from "../common/AvoraAIIcon";

// ==========================================
// AI CHAT INPUT COMPONENT (RESPONSIVE)
// ==========================================
/**
 * Floating glassmorphic search input component for Avora AI.
 * Features ambient gradient glow borders and responsive auto-resizing.
 */
const ChatInput = forwardRef(({
  loading,
  onSend,
}, ref) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [message]);

  const handleSubmit = (textToSend) => {
    const targetText = textToSend || message;
    if (!targetText.trim() || loading) return;
    onSend(targetText.trim());
    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 z-30 bg-gradient-to-t from-slate-50/95 via-slate-50/90 to-transparent dark:from-slate-950/95 dark:via-slate-950/90 dark:to-transparent px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 sm:px-6 sm:pb-5 sm:pt-3 md:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-4xl lg:max-w-5xl xl:max-w-6xl space-y-1.5 sm:space-y-2">

        {/* Floating Ambient Glowing Outer Container */}
        <div className="relative group rounded-2xl sm:rounded-3xl p-0.5 bg-gradient-to-r from-slate-200/80 via-blue-200/50 to-slate-200/80 dark:from-slate-800 dark:via-indigo-950 dark:to-slate-800 focus-within:from-[#3559D4] focus-within:via-indigo-500 focus-within:to-[#1E3A8A] dark:focus-within:from-indigo-500 dark:focus-within:via-blue-600 dark:focus-within:to-indigo-700 shadow-lg shadow-slate-900/5 dark:shadow-[0_10px_40px_rgba(0,0,0,0.7)] transition-all duration-300">
          
          <div className="flex items-center gap-2 sm:gap-3 rounded-[14px] sm:rounded-[22px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-2 sm:p-3 md:p-3.5 transition-colors">
            
            {/* Avora AI Icon Badge (Hidden on mobile phones to maximize input area) */}
            <div className="hidden sm:flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/60 text-[#3559D4] dark:text-indigo-400 shrink-0 border border-blue-100/60 dark:border-indigo-900/40">
              <AvoraAIIcon size={20} variant="glow" className="md:w-6 md:h-6" />
            </div>

            {/* Auto-Resizing Textarea Input (text-base on mobile prevents iOS auto-zoom) */}
            <textarea
              ref={(element) => {
                textareaRef.current = element;
                if (ref) {
                  if (typeof ref === "function") {
                    ref(element);
                  } else {
                    ref.current = element;
                  }
                }
              }}
              rows={1}
              value={message}
              disabled={loading}
              placeholder="Ask Avora AI about your next adventure..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[40px] max-h-40 sm:max-h-48 flex-1 resize-none bg-transparent px-1.5 py-1 text-base sm:text-sm md:text-base font-medium leading-relaxed sm:leading-6 text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:cursor-not-allowed my-auto"
            />

            {/* Premium Send Button */}
            <button
              type="button"
              disabled={loading || !message.trim()}
              onClick={() => handleSubmit()}
              aria-label="Send message"
              className="flex h-10 w-10 sm:h-11 sm:w-11 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#1E3A8A] via-[#3559D4] to-blue-500 dark:from-indigo-600 dark:to-blue-600 text-white shadow-md shadow-blue-500/25 dark:shadow-indigo-900/50 transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
            >
              <SendHorizontal size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Footer Caption */}
        <p className="text-center text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5 pb-0.5">
          <span>🔒 Avora AI</span>
          <span>•</span>
          <span>Personalized from your travel archives</span>
        </p>
      </div>
    </div>
  );
});

ChatInput.displayName = "ChatInput";

export default ChatInput;