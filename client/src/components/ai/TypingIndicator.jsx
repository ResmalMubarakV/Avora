import AvoraAIIcon from "../common/AvoraAIIcon";

// ==========================================
// TYPING INDICATOR COMPONENT
// ==========================================
/**
 * Renders an animated typing indicator bubble while the AI assistant is generating a response.
 */
const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3 sm:gap-4">
      {/* Avora AI Avatar */}
      <div className="relative flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1E3A8A] via-[#3559D4] to-[#4F46E5] text-white shadow-md shadow-blue-500/20 border border-white/20">
        <AvoraAIIcon size={20} variant="current" className="text-white sm:w-[24px] sm:h-[24px]" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-cyan-400 shadow-2xs">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        </span>
      </div>

      {/* Typing Bubble & Animation */}
      <div className="flex-1">
        <p className="mb-1 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Avora AI</p>

        <div className="inline-flex items-center gap-2 rounded-2xl rounded-tl-sm border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-3 sm:px-5 sm:py-4 shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-[#3559D4] dark:bg-indigo-400 animate-bounce" />
          <span className="h-2 w-2 rounded-full bg-[#3559D4] dark:bg-indigo-400 animate-bounce [animation-delay:150ms]" />
          <span className="h-2 w-2 rounded-full bg-[#3559D4] dark:bg-indigo-400 animate-bounce [animation-delay:300ms]" />
        </div>

        <p className="mt-1.5 text-[11px] sm:text-xs text-slate-400 dark:text-slate-500">
          Thinking about your next adventure...
        </p>
      </div>
    </div>
  );
};

export default TypingIndicator;