import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Images,
    Shield,
    KeyRound,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import LogoutModal from "../navigation/LogoutModal";

// ==========================================
// ADMIN SIDEBAR COMPONENT
// ==========================================
const AdminSidebar = ({ sidebarOpen, setSidebarOpen, isMobile }) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        setShowLogoutModal(false);
        
        // Completely clear all session data and tokens
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirect directly to the landing page and clear history stack
        window.location.replace("/");
    };

    const navItems = [
        {
            label: "Dashboard",
            to: "/admin",
            icon: LayoutDashboard,
            end: true,
        },
        {
            label: "Users",
            to: "/admin/users",
            icon: Users,
        },
        {
            label: "Memories",
            to: "/admin/memories",
            icon: Images,
        },
        {
            label: "Security Settings",
            to: "/admin/settings",
            icon: KeyRound,
        },
    ];

    const isOpen = sidebarOpen;

    return (
        <>
            {/* Mobile / Drawer Backdrop */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/20 dark:bg-slate-950/60 backdrop-blur-md transition-opacity duration-300 md:hidden"
                />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 flex flex-col bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800
                    transition-all duration-300 ease-in-out shadow-[0_10px_35px_rgba(30,58,138,0.08)] overflow-hidden
                    ${isMobile 
                        ? (sidebarOpen ? "translate-x-0 w-72 shadow-2xl" : "-translate-x-full w-72")
                        : (sidebarOpen ? "w-72 translate-x-0 shadow-2xl" : "w-20 translate-x-0")
                    }
                `}
            >
                {/* Background Glass Gradient Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-[#FAFBFD]/80 to-[#1E3A8A]/10 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-indigo-950/20" />
                    <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-[#1E3A8A]/10 dark:bg-indigo-500/10 blur-3xl" />
                </div>

                {/* Sidebar Inner Content */}
                <div className="relative z-10 flex h-full flex-col justify-between py-2">
                    {/* Top Header / Toggle Switcher */}
                    <div className="h-16 flex items-center px-4 shrink-0 border-b border-slate-100 dark:border-slate-800/80">
                        {isOpen ? (
                            <div className="flex items-center justify-between w-full min-w-0">
                                <div className="min-w-0 truncate pl-1">
                                    <div className="flex items-center gap-1.5">
                                        <h1 className="text-sm font-bold text-slate-900 dark:text-white truncate tracking-tight">
                                            Avora Admin
                                        </h1>
                                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800/50">
                                            <Shield size={9} /> Portal
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setSidebarOpen(false)}
                                    aria-label="Close Sidebar"
                                    className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl transition-all duration-300 hover:bg-[#1E3A8A]/5 hover:text-[#1E3A8A] text-slate-700 dark:text-slate-200 cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="mx-auto flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => setSidebarOpen(true)}
                                    aria-label="Open Sidebar"
                                    className="h-10 w-10 flex items-center justify-center rounded-xl transition-all duration-300 hover:bg-[#1E3A8A]/5 hover:text-[#1E3A8A] text-slate-700 dark:text-slate-200 cursor-pointer"
                                >
                                    <Menu size={22} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 px-3 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
                        {isOpen && (
                            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 truncate">
                                Control Center
                            </p>
                        )}
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    onClick={() => isMobile && setSidebarOpen(false)}
                                    title={!isOpen ? item.label : ""}
                                    className={({ isActive }) => `
                                        flex items-center h-12 rounded-xl transition-all duration-300 group
                                        ${
                                            isOpen
                                                ? "justify-start gap-3.5 px-3.5"
                                                : "justify-center"
                                        }
                                        ${
                                            isActive
                                                ? "bg-gradient-to-r from-[#1E3A8A] to-[#3559D4] text-white shadow-md shadow-[#1E3A8A]/20"
                                                : "text-slate-600 dark:text-slate-300 hover:bg-[#1E3A8A]/5 dark:hover:bg-slate-800 hover:text-[#1E3A8A] dark:hover:text-indigo-400"
                                        }
                                    `}
                                >
                                    <Icon size={isOpen ? 20 : 22} className="shrink-0 transition-transform duration-200 group-hover:scale-105" />
                                    {isOpen && <span className="truncate text-sm font-semibold">{item.label}</span>}
                                </NavLink>
                            );
                        })}
                    </div>

                    {/* Footer Section / Logout Action */}
                    <div className="px-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
                        <button
                            type="button"
                            onClick={() => setShowLogoutModal(true)}
                            title={!isOpen ? "Logout Account" : ""}
                            className={`
                                w-full h-12 rounded-xl cursor-pointer transition-all duration-300 flex items-center
                                ${isOpen ? "justify-start gap-3.5 px-3.5" : "justify-center"}
                                text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700 dark:hover:text-red-300
                            `}
                        >
                            <LogOut size={isOpen ? 20 : 22} className="shrink-0 transition-transform duration-200" />
                            {isOpen && <span className="truncate text-sm font-semibold">Logout Account</span>}
                        </button>
                    </div>
                </div>

                <LogoutModal
                    open={showLogoutModal}
                    onClose={() => setShowLogoutModal(false)}
                    onConfirm={handleLogout}
                    isAdmin={true}
                />
            </aside>
        </>
    );
};

export default AdminSidebar;