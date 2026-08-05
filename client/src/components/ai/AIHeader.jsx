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
    <header className="sticky top-0 z-35 border-b border-slate-200/80 bg-white/80 backdrop-blur-2xl shadow-sm">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Left: Back Button to Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          aria-label="Go to dashboard"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 shadow-sm cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Center: Bot Branding & Title */}
        <div className="flex items-center gap-3 text-center">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3559D4] via-[#4166E0] to-[#1E3A8A] text-white shadow-md shadow-blue-500/20">
            <Bot size={22} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[#3559D4] shadow-sm">
              <Sparkles size={9} />
            </span>
          </div>

          <div className="text-left hidden sm:block">
            <h1 className="text-base font-bold text-slate-900 truncate max-w-xs">
              {title || "New Chat"}
            </h1>
            <p className="text-xs text-slate-500 truncate max-w-xs">
              Powered by Avora AI & your travel memories
            </p>
          </div>
        </div>

        {/* Right: New Chat Button */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-[#3559D4] hover:bg-blue-50/50 hover:text-[#3559D4] cursor-pointer shadow-sm"
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