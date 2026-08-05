import {
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { SendHorizontal } from "lucide-react";

// ==========================================
// CHAT INPUT COMPONENT
// ==========================================
/**
 * Auto-resizing sticky textarea input component for the AI assistant chat view.
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

  const handleSubmit = () => {
    if (!message.trim() || loading) return;
    onSend(message.trim());
    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 z-20 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent px-4 pb-4 pt-3 sm:px-6 sm:pb-8 sm:pt-6">
      <div className="mx-auto max-w-4xl">
        {/* Input Wrapper Card */}
        <div className="flex items-end gap-3 rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-2xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-xl shadow-slate-200/50 transition-all focus-within:border-[#3559D4] focus-within:ring-4 focus-within:ring-blue-100">
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
            className="max-h-40 flex-1 resize-none bg-transparent text-[15px] leading-7 text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
          />

          {/* Send Button */}
          <button
            type="button"
            disabled={loading || !message.trim()}
            onClick={handleSubmit}
            className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-[#3559D4] to-[#1E3A8A] text-white shadow-md shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
          >
            <SendHorizontal size={20} />
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-slate-400">
          Avora AI may produce inaccurate information. Verify critical details.
        </p>
      </div>
    </div>
  );
});

ChatInput.displayName = "ChatInput";

export default ChatInput;