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
/**
 * Renders the top navigation bar. Features brand logo, a mobile-only hamburger toggle button, 
 * search bars, user profile menu, and conditional logout options.
 */
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
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center px-4 sm:px-6">
        {/* Left Section: Mobile Hamburger Menu & Brand Logo */}
        <div className="flex flex-1 items-center gap-3">
          {!hideHamburger && (
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Sidebar"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 cursor-pointer shadow-sm md:hidden"
            >
              <Menu size={20} />
            </button>
          )}

          <Logo to="/dashboard" size="sm" />
        </div>

        {/* Center Section: Desktop Search Bar */}
        <div className="hidden lg:flex w-full max-w-xl justify-center">
          <SearchBar />
        </div>

        {/* Right Section: User Menu & Tablet/Desktop Logout Button */}
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          <UserMenu />

          {/* Logout button next to profile avatar for tablet and desktop viewports */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            aria-label="Logout"
            className="hidden md:flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-all duration-300 hover:border-red-300 hover:bg-red-50 hover:text-red-700 cursor-pointer shadow-sm"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>

          {/* Conditional extra logout action if on profile/public pages */}
          {hideHamburger && (
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              aria-label="Logout"
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-white p-2 text-sm font-medium text-red-600 transition-all duration-300 hover:border-red-300 hover:bg-red-50 hover:text-red-700 cursor-pointer shadow-sm"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar View */}
      <div className="px-4 pb-4 sm:px-6 lg:hidden">
        <SearchBar />
      </div>

      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </header>
  );
};

export default Navbar;