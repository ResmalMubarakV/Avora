import {
  Plus,
  ArrowLeft,
} from "lucide-react";
import AvoraAIIcon from "../common/AvoraAIIcon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewChatModal from "./NewChatModal";
import ThemeToggle from "../common/ThemeToggle";

// ==========================================
// AI HEADER COMPONENT (WITH THEME TOGGLE)
// ==========================================
/**
 * Sticky header for the AI assistant page.
 * Displays responsive views for mobile and desktop, displaying conversation titles,
 * branding, back buttons to return to the dashboard, theme toggle, and triggers for starting new chat sessions.
 */
const AIHeader = ({
  title,
  onNewChat,
}) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <header className="sticky top-0 z-35 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-xs transition-colors duration-300">
      <div className="mx-auto flex h-14 sm:h-20 max-w-5xl items-center justify-between px-3 sm:px-6">
        {/* Left: Back Button to Dashboard */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          aria-label="Go to dashboard"
          className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs cursor-pointer active:scale-95 shrink-0"
        >
          <ArrowLeft size={18} className="sm:w-[20px] sm:h-[20px]" />
        </button>

        {/* Center: Avora AI Branding & Title (Visible on Mobile & Desktop) */}
        <div className="flex items-center gap-2 sm:gap-3 text-center min-w-0">
          <div className="relative flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1E3A8A] via-[#3559D4] to-[#4F46E5] text-white shadow-md shadow-blue-500/25 border border-white/20">
            <AvoraAIIcon size={20} variant="current" className="text-white sm:w-[24px] sm:h-[24px]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-full w-full bg-cyan-500" />
            </span>
          </div>

          <div className="text-left min-w-0">
            <h1 className="text-xs sm:text-base font-extrabold text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-xs">
              {title || "New Chat"}
            </h1>
            <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[120px] sm:max-w-xs">
              Avora AI Copilot
            </p>
          </div>
        </div>

        {/* Right: Theme Toggle & New Chat Button */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* New Chat Button */}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 px-2.5 sm:px-4 py-1.5 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all hover:border-[#3559D4] dark:hover:border-indigo-500 hover:bg-blue-50/50 dark:hover:bg-slate-700 hover:text-[#3559D4] dark:hover:text-indigo-400 cursor-pointer shadow-2xs active:scale-95 shrink-0"
          >
            <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">New Chat</span>
            <span className="inline sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* New Chat Confirmation Modal */}
      <NewChatModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          onNewChat();
          setShowModal(false);
        }}
      />
    </header>
  );
};

export default AIHeader;