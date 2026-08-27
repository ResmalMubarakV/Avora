import { LogOut, Menu, ShieldCheck } from "lucide-react";
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
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-300">
      {/* max-w-7xl and mx-auto ensure it doesn't stretch infinitely on ultra-wide screens */}
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-8 gap-3">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer shadow-sm md:hidden shrink-0"
          >
            <Menu size={18} />
          </button>

          <div className="block">
            <Logo to="/admin" size="sm" />
          </div>
        </div>

        {/* Right Section: Theme Toggle, Administrator Profile Badge & Logout Button */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <ThemeToggle />

          <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl sm:rounded-2xl py-1.5 px-2.5 sm:px-3.5 shadow-sm">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#3559D4] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 shrink-0">
              A
            </div>
            <div className="hidden xs:block text-left">
              <div className="flex items-center gap-1.5">
                <h3 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-100">Administrator</h3>
                <ShieldCheck size={13} className="text-blue-600 dark:text-blue-400 shrink-0" />
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">Super Admin</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            aria-label="Logout"
            className="flex h-9 sm:h-11 items-center justify-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900 px-3 sm:px-4 text-xs font-bold text-red-600 dark:text-red-400 transition-all hover:border-red-300 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700 dark:hover:text-red-300 active:scale-95 cursor-pointer shadow-sm shrink-0"
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