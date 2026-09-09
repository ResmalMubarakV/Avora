import {
  Plus,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import AvoraAIIcon from "../common/AvoraAIIcon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewChatModal from "./NewChatModal";
import ThemeToggle from "../common/ThemeToggle";

// ==========================================
// AI HEADER COMPONENT (FULLY RESPONSIVE)
// ==========================================
/**
 * Sticky header for the AI assistant page.
 * Seamlessly adapts across Mobile (320px-640px), Tablets (768px-1024px), Desktop, and Ultra-Wide screens.
 */
const AIHeader = ({
  title,
  onNewChat,
}) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <header className="sticky top-0 z-35 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl shadow-xs transition-colors duration-300">
      <div className="mx-auto flex h-14 sm:h-16 md:h-18 lg:h-20 max-w-5xl lg:max-w-6xl xl:max-w-7xl items-center justify-between px-3 sm:px-6 md:px-8">
        
        {/* Left: Return to Dashboard */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            aria-label="Return to dashboard"
            title="Return to Dashboard"
            className="group flex h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 items-center justify-center rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs cursor-pointer active:scale-95 shrink-0"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Center: Branding & Dynamic Conversation Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 justify-center sm:justify-start px-2 sm:px-3">
          <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1E3A8A] via-[#3559D4] to-[#4F46E5] text-white shadow-md shadow-blue-500/25 border border-white/20">
            <AvoraAIIcon size={18} variant="current" className="text-white sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-full w-full bg-cyan-500" />
            </span>
          </div>

          <div className="text-left min-w-0 flex-1 max-w-[160px] xs:max-w-[220px] sm:max-w-md md:max-w-lg lg:max-w-xl">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900 dark:text-white truncate">
                {title || "New Chat"}
              </h1>
            </div>
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
              <Sparkles size={10} className="text-blue-500 dark:text-indigo-400 shrink-0" />
              <span className="font-medium truncate">Avora AI Copilot</span>
              <span className="hidden md:inline text-slate-300 dark:text-slate-600">•</span>
              <span className="hidden md:inline text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Online</span>
            </div>
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
            aria-label="Start new chat"
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 px-2.5 sm:px-3.5 md:px-4 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all hover:border-[#3559D4] dark:hover:border-indigo-500 hover:bg-blue-50/60 dark:hover:bg-slate-700 hover:text-[#3559D4] dark:hover:text-indigo-400 cursor-pointer shadow-2xs active:scale-95 shrink-0"
          >
            <Plus size={16} className="text-[#3559D4] dark:text-indigo-400 sm:w-[18px] sm:h-[18px]" />
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