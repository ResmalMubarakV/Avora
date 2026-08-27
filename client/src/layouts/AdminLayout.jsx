import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";

// ==========================================
// ADMIN LAYOUT COMPONENT
// ==========================================
const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
            {/* Sidebar */}
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                isMobile={isMobile}
            />

            {/* Main Container */}
            <div
                className={`
                    transition-all
                    duration-300
                    ${
                        isMobile
                            ? "ml-0"
                            : sidebarOpen
                                ? "ml-72"
                                : "ml-20"
                    }
                `}
            >
                {/* Navbar */}
                <AdminNavbar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    isMobile={isMobile}
                />

                {/* Page Content */}
                <main
                    className="
                        min-h-[calc(100vh-80px)]
                        p-4
                        sm:p-6
                        lg:p-8
                    "
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;