import {
  Copy,
  RotateCcw,
  Check,
  Bot,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AvoraAIIcon from "../common/AvoraAIIcon";

import MarkdownRenderer from "./MarkdownRenderer";
import SuggestionChips from "./SuggestionChips";

// ==========================================
// CHAT MESSAGE COMPONENT (RESPONSIVE OPTIMIZED)
// ==========================================
/**
 * Renders individual chat message bubble with distinct user vs assistant styling,
 * copy-to-clipboard actions, and follow-up suggestion chips.
 */
const ChatMessage = ({
  role,
  content,
  timestamp,
  onSuggestion,
  onRegenerate,
  isLastAssistantMessage,
  loading,
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";

  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  // ==========================================
  // USER MESSAGE BUBBLE
  // ==========================================
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[90%] xs:max-w-[85%] sm:max-w-[80%] md:max-w-2xl lg:max-w-3xl rounded-2xl sm:rounded-3xl rounded-br-xs sm:rounded-br-sm bg-gradient-to-r from-[#3559D4] to-[#1E3A8A] dark:from-indigo-600 dark:to-blue-700 px-4 py-3 sm:px-5 sm:py-3.5 md:px-6 md:py-4 text-white shadow-md shadow-blue-500/10">
          <p className="whitespace-pre-wrap text-sm sm:text-[15px] md:text-base leading-relaxed font-medium">
            {content}
          </p>
          <div className="mt-1 sm:mt-1.5 flex justify-end">
            <span className="text-[10px] sm:text-xs text-blue-100/75">
              {formattedTime}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ASSISTANT MESSAGE BUBBLE
  // ==========================================
  return (
    <div className="flex items-start gap-2.5 sm:gap-3.5 md:gap-4">
      {/* Avora AI Avatar */}
      <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1E3A8A] via-[#3559D4] to-[#4F46E5] text-white shadow-md shadow-blue-500/20 mt-0.5 border border-white/20">
        <AvoraAIIcon size={18} variant="current" className="text-white sm:w-5 sm:h-5 md:w-6 md:h-6" />
        <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5 sm:h-3 sm:w-3 items-center justify-center rounded-full bg-cyan-400 text-white shadow-2xs">
          <span className="h-1 w-1 rounded-full bg-white" />
        </span>
      </div>

      {/* Message Content & Actions */}
      <div className="flex-1 overflow-hidden min-w-0">
        {/* Header line: Title & Badge */}
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            Avora AI
          </span>
          <span className="hidden xs:inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-indigo-950/60 text-blue-600 dark:text-indigo-400 border border-blue-100 dark:border-indigo-900/40">
            <Bot size={10} />
            Assistant
          </span>
        </div>

        {/* Message Body Card */}
        <div className="rounded-2xl sm:rounded-3xl rounded-tl-xs sm:rounded-tl-sm border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 sm:p-5 md:p-6 lg:p-7 shadow-2xs transition-colors">
          <MarkdownRenderer content={content} />
        </div>

        {/* Metadata & Toolbar */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-0.5">
          <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium">
            {formattedTime}
          </p>

          {/* Action Buttons Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={copyMessage}
              aria-label="Copy message text"
              className="inline-flex items-center gap-1.5 rounded-lg sm:rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white cursor-pointer shadow-2xs active:scale-95"
            >
              {copied ? <Check size={13} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={13} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>

            {isLastAssistantMessage && (
              <button
                type="button"
                onClick={onRegenerate}
                aria-label="Regenerate response"
                className="inline-flex items-center gap-1.5 rounded-lg sm:rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white cursor-pointer shadow-2xs active:scale-95"
              >
                <RotateCcw size={13} />
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>

        {/* Follow-up Suggestion Chips for Last Assistant Response */}
        {isLastAssistantMessage && (
          <SuggestionChips
            onSelect={onSuggestion}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default ChatMessage;