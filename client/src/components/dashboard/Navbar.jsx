import { LogOut, Menu, Search, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import LogoutModal from "../navigation/LogoutModal";
import Logo from "../common/Logo";
import SearchBar from "../navigation/SearchBar";
import UserMenu from "../navigation/UserMenu";
import ThemeToggle from "../common/ThemeToggle";

// ==========================================
// NAVBAR COMPONENT (PERFECTLY CENTERED SEARCHBAR DESIGN)
// ==========================================
const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const isProfilePage = pathSegments.length === 1 && pathSegments[0] !== "dashboard" && pathSegments[0] !== "profile";
  const isPublicMemoryPage = pathSegments.length >= 2 && pathSegments[0] !== "dashboard";
  const hideHamburger = isProfilePage || isPublicMemoryPage;

  const handleLogout = () => {
    setShowLogoutModal(false);
    
    // Completely clear all session data and tokens
    localStorage.clear();
    sessionStorage.clear();
    
    // Force a clean hard redirect to the login page to reset React memory state
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 dark:border-slate-800/80 dark:bg-slate-900/95 backdrop-blur-md shrink-0 overflow-visible transition-colors duration-300">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-3 sm:px-6 gap-2 relative overflow-visible">
        
        {/* Expanded Mobile Search Overlay Drawer */}
        {mobileSearchOpen && (
          <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 px-3.5 flex items-center justify-between z-50 sm:hidden w-full backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex-1 pr-2">
              <SearchBar />
            </div>
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              aria-label="Close search"
              className="h-9 w-9 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 flex items-center justify-center shrink-0 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Left Section: Mobile Hamburger Menu & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0 z-10">
          {!hideHamburger && (
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Sidebar"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/80 text-slate-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer shadow-2xs active:scale-95 md:hidden shrink-0"
            >
              <Menu size={18} />
            </button>
          )}

          <div className="shrink-0">
            <Logo to="/dashboard" size="md" />
          </div>
        </div>

        {/* Center Section: Dead-Centered Search Bar (Tablet & Desktop) */}
        <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-full max-w-[240px] sm:max-w-xs md:max-w-md lg:max-w-lg justify-center px-2 pointer-events-none z-20 overflow-visible">
          <div className="w-full pointer-events-auto">
            <SearchBar />
          </div>
        </div>

        {/* Right Section: Mobile Glassmorphic Action Bar & Desktop Action Group */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 shrink-0 z-10">
          
          {/* Mobile Action Pill Group (Uncluttered Glassmorphic Capsule) */}
          <div className="flex sm:hidden items-center gap-1 border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 p-1 rounded-2xl backdrop-blur-md">
            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Open search"
              className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700/80 cursor-pointer transition active:scale-95"
            >
              <Search size={15} />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <UserMenu />

            {/* Icon-only Logout */}
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              aria-label="Logout"
              className="flex h-8 w-8 items-center justify-center rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer transition active:scale-95"
            >
              <LogOut size={15} />
            </button>
          </div>

          {/* Desktop & Tablet Action Group */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <UserMenu />

            {/* Desktop Logout button */}
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              aria-label="Logout"
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200/80 bg-gradient-to-r from-red-50/60 to-rose-50/40 dark:border-red-900/60 dark:bg-gradient-to-r dark:from-red-950/40 dark:to-rose-950/30 px-3.5 py-2 text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 shadow-2xs transition-all duration-300 hover:border-red-300 dark:hover:border-red-700/80 hover:bg-gradient-to-r hover:from-red-100/90 hover:to-rose-100/80 dark:hover:from-red-900/60 dark:hover:to-rose-900/50 hover:text-red-700 dark:hover:text-red-300 dark:shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0"
            >
              <LogOut size={16} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
              <span className="hidden md:inline font-bold">Logout</span>
            </button>
          </div>

        </div>
      </div>

      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        isAdmin={false}
      />
    </header>
  );
};

export default Navbar;