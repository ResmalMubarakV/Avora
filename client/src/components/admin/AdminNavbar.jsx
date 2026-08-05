import { LogOut, Menu, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import LogoutModal from "../navigation/LogoutModal";
import Logo from "../common/Logo";

// ==========================================
// ADMIN NAVBAR COMPONENT
// ==========================================
const AdminNavbar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/admin/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center px-4 sm:px-8">
        {/* Left Section */}
        <div className="flex flex-1 items-center gap-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 cursor-pointer shadow-sm md:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="hidden sm:block">
            <Logo to="/admin" size="sm" />
          </div>
        </div>

        {/* Right Section: Administrator Profile Badge & Logout Button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl py-2 px-3.5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#3559D4] text-white font-bold shadow-md shadow-blue-500/20">
              A
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-slate-900">Administrator</h3>
                <ShieldCheck size={14} className="text-blue-600" />
              </div>
              <p className="text-[11px] font-medium text-slate-500">Super Admin Gateway</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            aria-label="Logout"
            className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-4 text-xs font-bold text-red-600 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700 active:scale-95 cursor-pointer shadow-sm"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </header>
  );
};

export default AdminNavbar;