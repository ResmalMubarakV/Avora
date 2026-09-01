import { LogOut, Menu, ShieldCheck, Activity } from "lucide-react";
import { useState } from "react";

import LogoutModal from "../navigation/LogoutModal";
import Logo from "../common/Logo";
import ThemeToggle from "../common/ThemeToggle";

// ==========================================
// ADMIN NAVBAR COMPONENT
// ==========================================
const AdminNavbar = ({ sidebarOpen, setSidebarOpen }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    
    // Completely clear all session data and tokens
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect directly to the landing page and clear history stack
    window.location.replace("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 dark:border-slate-800/80 dark:bg-slate-900/95 backdrop-blur-md shrink-0 transition-colors duration-300">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8 gap-3">
        {/* Left Section: Mobile Toggle & Brand Logo with Admin Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/80 text-slate-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer shadow-2xs active:scale-95 md:hidden shrink-0"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <Logo to="/admin" size="md" />
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-800/50">
              <ShieldCheck size={12} /> Admin
            </span>
          </div>
        </div>

        {/* Center: System Status Pill (Desktop only) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Enterprise Portal • All Systems Operational</span>
        </div>

        {/* Right Section: Theme Toggle, Administrator Profile Badge & Logout Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* Administrator Chip */}
          <div className="flex items-center gap-2 sm:gap-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl sm:rounded-2xl py-1 px-2 sm:px-3 shadow-xs">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#3559D4] text-white text-xs font-black shadow-xs shrink-0">
              A
            </div>
            <div className="hidden sm:block text-left pr-1">
              <div className="flex items-center gap-1">
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">Admin</h3>
                <ShieldCheck size={12} className="text-blue-600 dark:text-blue-400 shrink-0" />
              </div>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 leading-tight">Super Admin</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            aria-label="Logout"
            className="flex h-9 sm:h-10 items-center justify-center gap-1.5 rounded-xl sm:rounded-2xl border border-red-200/80 bg-gradient-to-r from-red-50/60 to-rose-50/40 dark:border-red-900/60 dark:bg-gradient-to-r dark:from-red-950/40 dark:to-rose-950/30 px-3 sm:px-3.5 text-xs font-bold text-red-600 dark:text-red-400 shadow-2xs transition-all duration-300 hover:border-red-300 dark:hover:border-red-700/80 hover:bg-gradient-to-r hover:from-red-100/90 hover:to-rose-100/80 dark:hover:from-red-900/60 dark:hover:to-rose-900/50 hover:text-red-700 dark:hover:text-red-300 dark:shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-xs hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0"
          >
            <LogOut size={15} />
            <span className="hidden xs:inline">Logout</span>
          </button>
        </div>
      </div>

      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        isAdmin={true}
      />
    </header>
  );
};

export default AdminNavbar;