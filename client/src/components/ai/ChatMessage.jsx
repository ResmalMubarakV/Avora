import {
  Bot,
  Sparkles,
  Copy,
  RotateCcw,
  Check,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  // ==========================================
  // USER MESSAGE BUBBLE
  // ==========================================
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] sm:max-w-2xl rounded-2xl sm:rounded-3xl rounded-br-xs sm:rounded-br-sm bg-gradient-to-r from-[#3559D4] to-[#1E3A8A] px-3.5 py-2.5 sm:px-6 sm:py-4 text-white shadow-md shadow-blue-500/10">
          <p className="whitespace-pre-wrap text-xs sm:text-[15px] leading-relaxed font-medium">{content}</p>
          <p className="mt-1 sm:mt-2 text-[9px] sm:text-[11px] text-blue-100/80 text-right">
            {formattedTime}
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ASSISTANT MESSAGE BUBBLE
  // ==========================================
  return (
    <div className="flex items-start gap-2.5 sm:gap-4">
      {/* AI Bot Avatar */}
      <div className="relative flex h-8 w-8 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#3559D4] to-[#1E3A8A] text-white shadow-md shadow-blue-500/20 mt-1">
        <Bot size={16} className="sm:w-[22px] sm:h-[22px]" />
        <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-white dark:bg-slate-900 text-[#3559D4] dark:text-indigo-400 shadow-2xs">
          <Sparkles size={8} className="sm:w-[10px] sm:h-[10px]" />
        </span>
      </div>

      {/* Message Content & Actions */}
      <div className="flex-1 overflow-hidden min-w-0">
        <div className="mb-1 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Avora AI</div>

        <div className="rounded-2xl sm:rounded-3xl rounded-tl-xs sm:rounded-tl-sm border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3.5 sm:p-6 shadow-2xs transition-colors">
          <MarkdownRenderer content={content} />
        </div>

        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1.5 px-0.5">
          <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-medium">{formattedTime}</p>

          {/* Action Buttons Toolbar */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={copyMessage}
              className="inline-flex items-center gap-1 rounded-lg sm:rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white cursor-pointer shadow-2xs active:scale-95"
            >
              {copied ? <Check size={12} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>

            {isLastAssistantMessage && (
              <button
                type="button"
                onClick={onRegenerate}
                className="inline-flex items-center gap-1 rounded-lg sm:rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white cursor-pointer shadow-2xs active:scale-95"
              >
                <RotateCcw size={12} />
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