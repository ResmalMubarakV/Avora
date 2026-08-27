import { LogOut, Menu, Search, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import LogoutModal from "../navigation/LogoutModal";
import Logo from "../common/Logo";
import SearchBar from "../navigation/SearchBar";
import UserMenu from "../navigation/UserMenu";
import ThemeToggle from "../common/ThemeToggle";

// ==========================================
// NAVBAR COMPONENT
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
    /* Changed overflow-x-hidden to relative overflow-visible z-40 so search results can overlap page content freely */
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shrink-0 overflow-visible transition-colors duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-2.5 sm:px-6 gap-1 relative overflow-visible">
        
        {/* Expanded Mobile Search Overlay */}
        {mobileSearchOpen ? (
          <div className="absolute inset-0 bg-white dark:bg-slate-900 px-3 flex items-center justify-between z-50 md:hidden w-full">
            <div className="flex-1 pr-2">
              <SearchBar />
            </div>
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              aria-label="Close search"
              className="h-10 w-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 flex items-center justify-center shrink-0 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X size={20} />
            </button>
          </div>
        ) : null}

        {/* Left Section: Mobile Hamburger Menu & Brand Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 min-w-0">
          {!hideHamburger && (
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Sidebar"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer shadow-sm md:hidden shrink-0"
            >
              <Menu size={18} />
            </button>
          )}

          <div className="shrink-0 scale-95 sm:scale-100 origin-left">
            <Logo to="/dashboard" size="sm" />
          </div>
        </div>

        {/* Center Section: Search Bar Container (Relative with no clipping) */}
        <div className="hidden md:flex flex-1 max-w-md lg:max-xl:max-w-xs justify-center px-2 relative overflow-visible">
          <SearchBar />
        </div>

        {/* Right Section: Mobile Search Toggle, Theme Toggle, User Menu & Logout Button */}
        <div className="flex items-center justify-end gap-1.5 shrink-0">
          {/* Mobile Search Icon Button */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(true)}
            aria-label="Open search"
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer shadow-sm shrink-0"
          >
            <Search size={16} />
          </button>

          {/* Theme Toggle Button */}
          <ThemeToggle />

          <UserMenu />

          {/* Icon-only Logout for mobile screens right next to user menu */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            aria-label="Logout"
            className="flex sm:hidden h-9 w-9 items-center justify-center rounded-xl border border-red-200/80 bg-gradient-to-r from-red-50/60 to-rose-50/40 dark:border-red-900/60 dark:bg-gradient-to-r dark:from-red-950/40 dark:to-rose-950/30 p-2 text-xs font-bold text-red-600 dark:text-red-400 shadow-2xs transition-all duration-300 hover:border-red-300 dark:hover:border-red-700/80 hover:bg-red-100/80 dark:hover:bg-red-900/50 hover:text-red-700 dark:hover:text-red-300 dark:shadow-[0_0_12px_rgba(239,68,68,0.15)] hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            <LogOut size={15} />
          </button>

          {/* Logout button for tablets and desktops */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            aria-label="Logout"
            className="hidden sm:flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200/80 bg-gradient-to-r from-red-50/60 to-rose-50/40 dark:border-red-900/60 dark:bg-gradient-to-r dark:from-red-950/40 dark:to-rose-950/30 px-3.5 py-2 text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 shadow-2xs transition-all duration-300 hover:border-red-300 dark:hover:border-red-700/80 hover:bg-gradient-to-r hover:from-red-100/90 hover:to-rose-100/80 dark:hover:from-red-900/60 dark:hover:to-rose-900/50 hover:text-red-700 dark:hover:text-red-300 dark:shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0"
          >
            <LogOut size={16} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
            <span className="hidden md:inline font-bold">Logout</span>
          </button>
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