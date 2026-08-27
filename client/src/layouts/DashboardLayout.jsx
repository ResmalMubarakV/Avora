import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
import LandingFooter from "../components/landing/LandingFooter";
import FloatingAIChat from "../components/dashboard/FloatingAIChat";

// ==========================================
// DASHBOARD LAYOUT COMPONENT
// ==========================================
const DashboardLayout = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const isAIPage = location.pathname === "/dashboard/ai";
  
  // A path is strictly a public profile page if it's 1 segment long and NOT a dashboard/system route
  const isPublicProfile = pathSegments.length === 1 && 
    !["dashboard", "profile", "admin", "login", "register", "forgot-password", "403", "404"].includes(pathSegments[0]);

  // A path is a public memory page if it has 2 segments and does not start with dashboard
  const isPublicMemoryPage = pathSegments.length >= 2 && pathSegments[0] !== "dashboard";

  const hideSidebarAndNav = isPublicProfile || isPublicMemoryPage || isAIPage;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100 relative transition-colors duration-300">
      {/* Sidebar Navigation */}
      {!hideSidebarAndNav && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      )}

      {/* Main Content Wrapper */}
      <main className={`transition-all duration-300 ${hideSidebarAndNav ? "ml-0" : "ml-0 md:ml-20"}`}>
        {!hideSidebarAndNav && (
          <Navbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        )}

        <div
          className={
            isAIPage
              ? "h-[100dvh] overflow-hidden"
              : "max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6"
          }
        >
          <Outlet />
        </div>

        {!hideSidebarAndNav && <LandingFooter />}
      </main>

      {/* Floating AI Chat Assistant Widget (Hidden on the dedicated AI page) */}
      {!isAIPage && <FloatingAIChat />}
    </div>
  );
};

export default DashboardLayout;