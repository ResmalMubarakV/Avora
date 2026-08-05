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
  const isProfilePage = pathSegments.length === 1 && pathSegments[0] !== "dashboard" && pathSegments[0] !== "profile";
  const isPublicMemoryPage = pathSegments.length >= 2 && pathSegments[0] !== "dashboard";

  const hideSidebarAndNav = isProfilePage || isPublicMemoryPage || isAIPage;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 relative">
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
              ? "h-screen overflow-hidden"
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