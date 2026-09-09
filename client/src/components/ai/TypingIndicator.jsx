import AvoraAIIcon from "../common/AvoraAIIcon";

// ==========================================
// TYPING INDICATOR COMPONENT
// ==========================================
/**
 * Renders an animated typing indicator bubble while the AI assistant is generating a response.
 */
const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-2.5 sm:gap-3.5 md:gap-4">
      {/* Avora AI Avatar */}
      <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1E3A8A] via-[#3559D4] to-[#4F46E5] text-white shadow-md shadow-blue-500/20 mt-0.5 border border-white/20">
        <AvoraAIIcon size={18} variant="current" className="text-white sm:w-5 sm:h-5 md:w-6 md:h-6" />
        <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5 sm:h-3 sm:w-3 items-center justify-center rounded-full bg-cyan-400 shadow-2xs">
          <span className="h-1 w-1 rounded-full bg-white" />
        </span>
      </div>

      {/* Typing Bubble & Animation */}
      <div className="flex-1">
        <p className="mb-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Avora AI</p>

        <div className="inline-flex items-center gap-2 rounded-2xl sm:rounded-3xl rounded-tl-xs sm:rounded-tl-sm border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 sm:px-5 sm:py-3.5 shadow-2xs">
          <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#3559D4] dark:bg-indigo-400 animate-bounce" />
          <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#3559D4] dark:bg-indigo-400 animate-bounce [animation-delay:150ms]" />
          <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#3559D4] dark:bg-indigo-400 animate-bounce [animation-delay:300ms]" />
        </div>

        <p className="mt-1.5 text-xs sm:text-sm text-slate-400 dark:text-slate-500">
          Thinking about your next adventure...
        </p>
      </div>
    </div>
  );
};

export default TypingIndicator;