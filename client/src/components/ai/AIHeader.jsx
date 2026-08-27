import {
  Sparkles,
  Bot,
  Plus,
  ArrowLeft,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewChatModal from "./NewChatModal";

// ==========================================
// AI HEADER COMPONENT
// ==========================================
/**
 * Sticky header for the AI assistant page. 
 * Provides responsive views for desktop and mobile, displaying conversation titles, 
 * branding, back buttons to return to the dashboard, and triggers for starting new chat sessions.
 */
const AIHeader = ({
  title,
  onNewChat,
}) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <header className="sticky top-0 z-35 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-sm transition-colors duration-300">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Left: Back Button to Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          aria-label="Go to dashboard"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Center: Bot Branding & Title */}
        <div className="flex items-center gap-3 text-center">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3559D4] via-[#4166E0] to-[#1E3A8A] text-white shadow-md shadow-blue-500/20">
            <Bot size={22} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-slate-900 text-[#3559D4] dark:text-indigo-400 shadow-sm">
              <Sparkles size={9} />
            </span>
          </div>

          <div className="text-left hidden sm:block">
            <h1 className="text-base font-bold text-slate-900 dark:text-white truncate max-w-xs">
              {title || "New Chat"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
              Powered by Avora AI & your travel memories
            </p>
          </div>
        </div>

        {/* Right: New Chat Button */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all hover:border-[#3559D4] dark:hover:border-indigo-500 hover:bg-blue-50/50 dark:hover:bg-slate-700 hover:text-[#3559D4] dark:hover:text-indigo-400 cursor-pointer shadow-sm"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">New Chat</span>
        </button>
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