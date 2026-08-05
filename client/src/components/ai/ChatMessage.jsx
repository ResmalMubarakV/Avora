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
// CHAT MESSAGE COMPONENT
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
        <div className="max-w-xl sm:max-w-2xl rounded-3xl rounded-br-sm bg-gradient-to-r from-[#3559D4] to-[#1E3A8A] px-5 py-4 sm:px-6 sm:py-4 text-white shadow-lg shadow-blue-500/10">
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{content}</p>
          <p className="mt-2 text-[11px] text-blue-100/80 text-right">
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
    <div className="flex items-start gap-3.5 sm:gap-4">
      {/* AI Bot Avatar */}
      <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3559D4] to-[#1E3A8A] text-white shadow-md shadow-blue-500/20">
        <Bot size={20} className="sm:w-[22px] sm:h-[22px]" />
        <span className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-white text-[#3559D4] shadow-sm">
          <Sparkles size={10} />
        </span>
      </div>

      {/* Message Content & Actions */}
      <div className="flex-1 overflow-hidden">
        <div className="mb-1.5 text-xs sm:text-sm font-bold text-slate-900">Avora AI</div>

        <div className="rounded-3xl rounded-tl-sm border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm">
          <MarkdownRenderer content={content} />
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1">
          <p className="text-[11px] text-slate-400">{formattedTime}</p>

          {/* Action Buttons Toolbar */}
          <div className="flex items-center gap-2">
            <button
              onClick={copyMessage}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer shadow-sm"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>

            {isLastAssistantMessage && (
              <button
                onClick={onRegenerate}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer shadow-sm"
              >
                <RotateCcw size={14} />
                Regenerate
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