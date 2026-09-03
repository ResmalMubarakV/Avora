import {
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { SendHorizontal, MapPin, Calendar, Wallet } from "lucide-react";
import AvoraAIIcon from "../common/AvoraAIIcon";

// ==========================================
// AI CHAT INPUT COMPONENT (MOBILE & SMALL SCREEN OPTIMIZED)
// ==========================================
/**
 * Floating glassmorphic search input component for Avora AI.
 * Features ambient gradient glow borders, quick prompt shortcut chips, and responsive auto-resizing.
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
    textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
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

  const quickPrompts = [
    { icon: <Calendar size={12} />, label: "Trip Plan", prompt: "Create a 5-day trip itinerary for my next adventure." },
    { icon: <MapPin size={12} />, label: "Explore Spots", prompt: "Suggest top hidden gem spots to explore." },
    { icon: <Wallet size={12} />, label: "Budget", prompt: "Estimate daily travel expenses and budget breakdown." },
  ];

  return (
    <div className="sticky bottom-0 z-30 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent dark:from-slate-950 dark:via-slate-950/95 dark:to-transparent px-2.5 pb-2.5 pt-1.5 sm:px-6 sm:pb-6 sm:pt-4 transition-colors duration-300">
      <div className="mx-auto max-w-4xl space-y-1.5 sm:space-y-2">
        
        {/* Quick Shortcut Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none px-0.5">
          <span className="hidden sm:inline text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 mr-0.5">
            Quick Prompts:
          </span>
          {quickPrompts.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSubmit(chip.prompt)}
              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold text-slate-700 dark:text-slate-300 shadow-2xs hover:border-[#3559D4] dark:hover:border-indigo-500 hover:text-[#3559D4] dark:hover:text-indigo-400 transition-all cursor-pointer shrink-0 active:scale-95"
            >
              <span className="text-blue-500 dark:text-indigo-400">{chip.icon}</span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* Floating Ambient Glowing Outer Container */}
        <div className="relative group rounded-2xl sm:rounded-[32px] p-0.5 bg-gradient-to-r from-slate-200/80 via-blue-200/60 to-slate-200/80 dark:from-slate-800/80 dark:via-indigo-900/50 dark:to-slate-800/80 focus-within:from-[#3559D4] focus-within:via-indigo-500 focus-within:to-[#1E3A8A] dark:focus-within:from-indigo-500 dark:focus-within:via-blue-600 dark:focus-within:to-indigo-700 shadow-lg shadow-slate-900/5 dark:shadow-[0_10px_40px_rgba(0,0,0,0.7)] transition-all duration-300">
          
          <div className="flex items-center gap-2 sm:gap-3.5 rounded-[14px] sm:rounded-[30px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-2 sm:p-3.5 transition-colors">
            
            {/* Avora AI Icon Badge (Hidden on small mobile screens to maximize typing area) */}
            <div className="hidden sm:flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/60 text-[#3559D4] dark:text-indigo-400 shrink-0 border border-blue-100/60 dark:border-indigo-900/40">
              <AvoraAIIcon size={20} variant="glow" className="sm:w-[22px] sm:h-[22px]" />
            </div>

            {/* Auto-Resizing Textarea Input */}
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
              placeholder="Ask Avora AI about your next trip..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="max-h-36 flex-1 resize-none bg-transparent px-1 text-xs sm:text-sm font-medium leading-5 sm:leading-7 text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:cursor-not-allowed my-auto"
            />

            {/* Premium Send Button */}
            <button
              type="button"
              disabled={loading || !message.trim()}
              onClick={() => handleSubmit()}
              className="flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#1E3A8A] via-[#3559D4] to-blue-500 dark:from-indigo-600 dark:to-blue-600 text-white shadow-md shadow-blue-500/25 dark:shadow-indigo-900/50 transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
            >
              <SendHorizontal size={15} className="sm:w-[19px] sm:h-[19px]" />
            </button>
          </div>
        </div>

        {/* Footer Caption */}
        <p className="text-center text-[9px] sm:text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
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