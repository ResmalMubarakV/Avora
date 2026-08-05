import {
  Bot,
  Sparkles,
} from "lucide-react";

// ==========================================
// TYPING INDICATOR COMPONENT
// ==========================================
/**
 * Renders an animated typing indicator bubble while the AI assistant is generating a response.
 */
const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-4">
      {/* AI Bot Avatar */}
      <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3559D4] to-[#1E3A8A] text-white shadow-md shadow-blue-500/20">
        <Bot size={20} className="sm:w-[22px] sm:h-[22px]" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-white text-[#3559D4] shadow-sm">
          <Sparkles size={10} />
        </span>
      </div>

      {/* Typing Bubble & Animation */}
      <div className="flex-1">
        <p className="mb-1.5 text-xs sm:text-sm font-bold text-slate-900">Avora AI</p>

        <div className="inline-flex items-center gap-2 rounded-2xl rounded-tl-sm border border-slate-200/80 bg-white px-5 py-4 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#3559D4] animate-bounce" />
          <span className="h-2 w-2 rounded-full bg-[#3559D4] animate-bounce [animation-delay:150ms]" />
          <span className="h-2 w-2 rounded-full bg-[#3559D4] animate-bounce [animation-delay:300ms]" />
        </div>

        <p className="mt-2 text-xs text-slate-400">
          Thinking about your next adventure...
        </p>
      </div>
    </div>
  );
};

export default TypingIndicator;