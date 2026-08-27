import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Images,
    LogOut,
    Shield,
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
    ];

    const isOpen = sidebarOpen;

    return (
        <>
            {/* Mobile / Drawer Backdrop */}
            {sidebarOpen && isMobile && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900
                    transition-all duration-300 ease-in-out shadow-sm
                    ${isMobile 
                        ? (sidebarOpen ? "translate-x-0 w-72" : "-translate-x-full w-72")
                        : (sidebarOpen ? "w-72 translate-x-0" : "w-20 translate-x-0")
                    }
                `}
            >
                {/* Header / Toggle Switcher */}
                <div className="flex h-20 items-center justify-between px-4 sm:px-6 border-b border-slate-100 dark:border-slate-800 overflow-hidden">
                    {isOpen ? (
                        <div className="flex items-center justify-between w-full min-w-0">
                            <div className="min-w-0 truncate">
                                <h1 className="text-base font-bold text-slate-900 dark:text-white truncate tracking-tight">
                                    Avora Admin
                                </h1>
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-full truncate mt-0.5 border border-blue-100 dark:border-blue-800/50">
                                    <Shield size={10} /> Secure Portal
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSidebarOpen(false)}
                                aria-label="Close Sidebar"
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer shadow-sm ml-2"
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
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer shadow-sm"
                            >
                                <Menu size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                <div className="flex-1 px-3 sm:px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
                    {isOpen && (
                        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 truncate">
                            Core Management
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
                                    flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 group
                                    ${
                                        isActive
                                            ? "bg-gradient-to-r from-[#1E3A8A] to-[#3559D4] dark:from-indigo-600 dark:to-blue-600 text-white shadow-md shadow-blue-500/20 dark:shadow-[0_0_20px_rgba(99,102,241,0.35)]"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                                    }
                                    ${!isOpen ? "justify-center px-0" : ""}
                                `}
                            >
                                <Icon size={20} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
                                {isOpen && <span className="truncate">{item.label}</span>}
                            </NavLink>
                        );
                    })}
                </div>

                {/* Footer Section / Logout */}
                <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={() => setShowLogoutModal(true)}
                        title={!isOpen ? "Logout Account" : ""}
                        className={`
                            w-full flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/60 hover:border-red-200 dark:hover:border-red-800 cursor-pointer shadow-sm
                            ${!isOpen ? "justify-center px-0" : ""}
                        `}
                    >
                        <LogOut size={20} className="shrink-0" />
                        {isOpen && <span className="truncate">Logout Account</span>}
                    </button>
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