import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";

// ==========================================
// ADMIN LAYOUT COMPONENT
// ==========================================
const AdminLayout = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) setSidebarOpen(true); // Default open on desktop
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Auto-close sidebar on route change for mobile viewports
    useEffect(() => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    }, [location.pathname, isMobile]);

    return (
        <div className="min-h-screen bg-slate-50 overflow-x-hidden relative">
            {/* Sidebar Drawer */}
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                isMobile={isMobile}
            />

            {/* Main Container */}
            <div
                className={`
                    transition-all duration-300 min-h-screen flex flex-col w-full
                    ${isMobile ? "ml-0" : sidebarOpen ? "ml-72" : "ml-20"}
                `}
                style={{ width: isMobile ? "100%" : undefined }}
            >
                {/* Navbar */}
                <AdminNavbar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    isMobile={isMobile}
                />

                {/* Page Content Container with strict box containment */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;