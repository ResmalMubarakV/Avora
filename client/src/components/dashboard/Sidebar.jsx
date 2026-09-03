import {
  LayoutDashboard,
  Images,
  PlusCircle,
  User,
  Settings,
  Lock,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import LogoutModal from "../navigation/LogoutModal";
import { useState, useEffect } from "react";
import useCurrentUser from "../../hooks/useCurrentUser";
import AvoraAIIcon from "../common/AvoraAIIcon";

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
    title: "Profile",
    icon: User,
    path: "/dashboard/profile",
  },
  {
    title: "AI Assistant",
    icon: AvoraAIIcon,
    path: "/dashboard/ai",
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
  const location = useLocation();
  const { user } = useCurrentUser();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isSettingsActive = location.pathname.startsWith("/dashboard/settings");

  // Default state closed; auto-expand if settings path is active
  const [settingsOpen, setSettingsOpen] = useState(isSettingsActive);

  // Keep accordion synced if location changes externally
  useEffect(() => {
    if (isSettingsActive) {
      setSettingsOpen(true);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    setShowLogoutModal(false);
    
    // Completely clear all session data and tokens
    localStorage.clear();
    sessionStorage.clear();
    
    // Force a clean hard redirect to the login page to reset React memory state
    window.location.href = "/login";
  };

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Glassmorphic Backdrop Overlay (Active across all screens when expanded) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/20 dark:bg-slate-950/60 backdrop-blur-md transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 z-50 h-[100dvh] bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800 shadow-[0_10px_35px_rgba(30,58,138,0.08)] transition-all duration-300 ease-in-out flex flex-col overflow-hidden ${
          sidebarOpen
            ? "translate-x-0 w-72 shadow-2xl"
            : "-translate-x-full md:translate-x-0 w-20"
        }`}
      >
        {/* Background Glass Gradient Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-[#FAFBFD]/80 to-[#1E3A8A]/10 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-indigo-950/20" />
          <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-[#1E3A8A]/10 dark:bg-indigo-500/10 blur-3xl" />
        </div>

        {/* Sidebar Inner Content */}
        <div className="relative z-10 flex h-full flex-col justify-between py-2">
          
          {/* Top Section: Toggle Header + Navigation Links */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Toggle Header Button */}
            <div className="h-14 flex items-center px-4 shrink-0">
              {sidebarOpen ? (
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 pl-2">
                    Menu
                  </span>
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close Sidebar"
                    className="h-10 w-10 rounded-xl transition-all duration-300 hover:bg-[#1E3A8A]/5 hover:text-[#1E3A8A] flex items-center justify-center cursor-pointer text-slate-700"
                  >
                    <X size={22} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open Sidebar"
                  className="h-10 w-10 rounded-xl transition-all duration-300 hover:bg-[#1E3A8A]/5 hover:text-[#1E3A8A] flex items-center justify-center cursor-pointer text-slate-700 mx-auto"
                >
                  <Menu size={22} />
                </button>
              )}
            </div>

            {/* Navigation Links List */}
            <nav className="px-3 pt-4 space-y-3 overflow-y-auto shrink-0">
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
                      flex items-center h-12 rounded-xl transition-all duration-300 ${
                        sidebarOpen ? "justify-start gap-3.5 px-3.5" : "justify-center"
                      } ${
                        isActive && menu.title !== "Profile"
                          ? "bg-gradient-to-r from-[#1E3A8A] to-[#3559D4] text-white shadow-md shadow-[#1E3A8A]/20"
                          : "text-slate-600 dark:text-slate-300 hover:bg-[#1E3A8A]/5 dark:hover:bg-slate-800 hover:text-[#1E3A8A] dark:hover:text-indigo-400"
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={sidebarOpen ? 20 : 24}
                          variant={menu.title === "AI Assistant" ? (isActive ? "current" : "gradient") : undefined}
                          className="shrink-0 transition-all duration-300"
                        />
                        <span
                          className={`overflow-hidden whitespace-nowrap transition-all duration-300 text-sm font-medium ${
                            sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                          }`}
                        >
                          {menu.title}
                        </span>
                      </>
                    )}
                  </NavLink>
                );
              })}

              {/* Settings Accordion Section */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (!sidebarOpen) {
                      setSidebarOpen(true);
                      setSettingsOpen(true);
                    } else {
                      setSettingsOpen(!settingsOpen);
                    }
                  }}
                  title={!sidebarOpen ? "Settings" : ""}
                  className={`w-full flex items-center h-12 rounded-xl transition-all duration-300 cursor-pointer ${
                    sidebarOpen ? "justify-between px-3.5" : "justify-center"
                  } ${
                    isSettingsActive
                      ? "bg-slate-100 dark:bg-slate-800 text-[#1E3A8A] dark:text-indigo-400 font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-[#1E3A8A]/5 dark:hover:bg-slate-800 hover:text-[#1E3A8A] dark:hover:text-indigo-400"
                  }`}
                >
                  <div className={`flex items-center ${sidebarOpen ? "gap-3.5" : "justify-center w-full"}`}>
                    <Settings size={sidebarOpen ? 20 : 24} className="shrink-0 transition-all duration-300" />
                    <span
                      className={`overflow-hidden whitespace-nowrap transition-all duration-300 text-sm font-medium ${
                        sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                      }`}
                    >
                      Settings
                    </span>
                  </div>
                  {sidebarOpen && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${settingsOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </button>

                {sidebarOpen && settingsOpen && (
                  <div className="pl-5 pt-1 space-y-1 border-l-2 border-slate-200 dark:border-slate-800 ml-5 my-1">
                    <button
                      type="button"
                      onClick={() => handleNavigation("/dashboard/settings/profile")}
                      className={`w-full flex items-center gap-2.5 h-9 px-2.5 rounded-lg text-xs transition-all text-left cursor-pointer ${
                        location.pathname === "/dashboard/settings/profile" 
                          ? "bg-[#1E3A8A] text-white font-semibold" 
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <User size={15} /> Edit Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNavigation("/dashboard/settings/security")}
                      className={`w-full flex items-center gap-2.5 h-9 px-2.5 rounded-lg text-xs transition-all text-left cursor-pointer ${
                        location.pathname === "/dashboard/settings/security" 
                          ? "bg-[#1E3A8A] text-white font-semibold" 
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Lock size={15} /> Security & Password
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Logout Action Footer */}
          <div className="px-3 pt-2 border-t border-slate-200/70 dark:border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              title={!sidebarOpen ? "Logout" : ""}
              className={`w-full h-12 rounded-xl cursor-pointer transition-all duration-300 flex items-center ${
                sidebarOpen ? "justify-start gap-3.5 px-3.5" : "justify-center"
              } text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700 dark:hover:text-red-300`}
            >
              <LogOut size={sidebarOpen ? 20 : 24} className="shrink-0 transition-all duration-300" />
              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 text-sm font-medium ${
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