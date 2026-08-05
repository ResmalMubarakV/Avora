import {
  LayoutDashboard,
  Images,
  PlusCircle,
  Sparkles,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import LogoutModal from "../navigation/LogoutModal";
import { useState } from "react";
import useCurrentUser from "../../hooks/useCurrentUser";

// ==========================================
// NAVIGATION MENUS CONFIGURATION
// ==========================================
const menus = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "My Memories",
    icon: Images,
    path: "/dashboard/memories",
  },
  {
    title: "Create Memory",
    icon: PlusCircle,
    path: "/dashboard/create-memory",
  },
  {
    title: "AI Assistant",
    icon: Sparkles,
    path: "/dashboard/ai",
  },
  {
    title: "Profile",
    icon: User,
    path: "/dashboard/profile",
  },
];

// ==========================================
// SIDEBAR COMPONENT
// ==========================================
const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Glassmorphic Backdrop Overlay (Active across all screens when expanded) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-md transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen bg-white/90 backdrop-blur-xl border-r border-slate-200/80 shadow-[0_10px_35px_rgba(30,58,138,0.08)] transition-all duration-300 ease-in-out flex flex-col ${
          sidebarOpen
            ? "translate-x-0 w-72 shadow-2xl"
            : "-translate-x-full md:translate-x-0 w-20"
        }`}
      >
        {/* Background Glass Gradient Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-[#FAFBFD]/80 to-[#1E3A8A]/10" />
          <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-[#1E3A8A]/10 blur-3xl" />
        </div>

        {/* Sidebar Inner Content */}
        <div className="relative z-10 flex h-full flex-col">
          {/* Toggle Header Button */}
          <div className="h-20 flex items-center px-4">
            {sidebarOpen ? (
              <div className="w-full flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 pl-2">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close Sidebar"
                  className="h-12 w-12 rounded-2xl transition-all duration-300 hover:bg-[#1E3A8A]/5 hover:text-[#1E3A8A] flex items-center justify-center cursor-pointer text-slate-700"
                >
                  <X size={22} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open Sidebar"
                className="h-12 w-12 rounded-2xl transition-all duration-300 hover:bg-[#1E3A8A]/5 hover:text-[#1E3A8A] flex items-center justify-center cursor-pointer text-slate-700 mx-auto"
              >
                <Menu size={22} />
              </button>
            )}
          </div>

          {/* Navigation Links List */}
          <nav className="flex-1 px-3 pt-6 space-y-3 overflow-y-auto">
            {menus.map((menu) => {
              const Icon = menu.icon;

              const destination =
                menu.title === "Profile"
                  ? user?.username
                    ? `/${user.username}`
                    : "/dashboard"
                  : menu.path;

              return (
                <NavLink
                  key={menu.title}
                  to={destination}
                  title={!sidebarOpen ? menu.title : ""}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `
                    flex items-center h-14 rounded-2xl transition-all duration-300 ${
                      sidebarOpen ? "justify-start gap-4 px-4" : "justify-center"
                    } ${
                      isActive
                        ? "bg-gradient-to-r from-[#1E3A8A] to-[#3559D4] text-white shadow-lg shadow-[#1E3A8A]/20"
                        : "text-slate-600 hover:bg-[#1E3A8A]/5 hover:text-[#1E3A8A]"
                    }
                  `}
                >
                  <Icon size={22} className="shrink-0" />
                  <span
                    className={`overflow-hidden whitespace-nowrap transition-all duration-300 font-medium ${
                      sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                    }`}
                  >
                    {menu.title}
                  </span>
                </NavLink>
              );
            })}
          </nav>

          {/* Logout Action Footer */}
          <div className="p-3 border-t border-slate-200/70">
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className={`w-full h-14 rounded-2xl cursor-pointer transition-all duration-300 flex items-center ${
                sidebarOpen ? "justify-start gap-4 px-4" : "justify-center"
              } text-red-600 hover:bg-red-50 hover:text-red-700`}
            >
              <LogOut size={22} className="shrink-0" />
              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 font-medium ${
                  sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                }`}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        isAdmin={false}
      />
    </>
  );
};

export default Sidebar;