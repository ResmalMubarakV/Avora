import { LogOut, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import LogoutModal from "../navigation/LogoutModal";
import Logo from "../common/Logo";
import SearchBar from "../navigation/SearchBar";
import UserMenu from "../navigation/UserMenu";

// ==========================================
// NAVBAR COMPONENT
// ==========================================
const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const isProfilePage = pathSegments.length === 1 && pathSegments[0] !== "dashboard" && pathSegments[0] !== "profile";
  const isPublicMemoryPage = pathSegments.length >= 2 && pathSegments[0] !== "dashboard";
  const hideHamburger = isProfilePage || isPublicMemoryPage;

  const handleLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shrink-0 overflow-x-hidden">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-2.5 sm:px-6 gap-1">
        {/* Left Section: Mobile Hamburger Menu & Brand Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 min-w-0">
          {!hideHamburger && (
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Sidebar"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 cursor-pointer shadow-sm md:hidden shrink-0"
            >
              <Menu size={18} />
            </button>
          )}

          <div className="shrink-0 scale-95 sm:scale-100 origin-left">
            <Logo to="/dashboard" size="sm" />
          </div>
        </div>

        {/* Center Section: Search Bar (Hidden on small tablets, visible on large tablets & desktops) */}
        <div className="hidden md:flex flex-1 max-w-md lg:max-xl:max-w-xs justify-center px-2">
          <SearchBar />
        </div>

        {/* Right Section: User Menu & Logout Button */}
        <div className="flex items-center justify-end gap-1.5 shrink-0">
          <UserMenu />

          {/* Icon-only Logout for mobile screens right next to the user menu */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            aria-label="Logout"
            className="flex sm:hidden h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-white p-2 text-sm font-medium text-red-600 transition-all duration-300 hover:border-red-300 hover:bg-red-50 hover:text-red-700 cursor-pointer shadow-sm shrink-0"
          >
            <LogOut size={15} />
          </button>

          {/* Logout button with text for tablets and desktops */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            aria-label="Logout"
            className="hidden sm:flex h-10 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-red-600 transition-all duration-300 hover:border-red-300 hover:bg-red-50 hover:text-red-700 cursor-pointer shadow-sm shrink-0"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile & Small Tablet Search Bar View */}
      <div className="px-4 pb-3 sm:px-6 md:hidden">
        <SearchBar />
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