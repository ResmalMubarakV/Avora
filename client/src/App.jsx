import { useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

// Layouts & Guards
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

// Public Pages
import Landing from "./pages/public/Landing";
import Profile from "./pages/profile/Profile";
import PublicMemory from "./pages/public/PublicMemory";
import LegalPage from "./pages/public/LegalPage";

// Auth & Onboarding Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import PendingApproval from "./pages/onboarding/PendingApproval";
import Suspended from "./pages/auth/Suspended";

// Dashboard & App Pages
import Dashboard from "./pages/dashboard/Dashboard";
import AllMemories from "./pages/dashboard/AllMemories";
import CreateMemory from "./pages/memory/CreateMemory";
import EditMemory from "./pages/memory/EditMemory";
import EditProfile from "./pages/profile/EditProfile";
import SecuritySettings from "./pages/dashboard/SecuritySettings";
import AI from "./pages/ai/AI";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminMemories from "./pages/admin/AdminMemories";
import AdminSettings from "./pages/admin/AdminSettings";

// Error Pages
import Forbidden from "./pages/errors/Forbidden";
import NotFound from "./pages/errors/NotFound";

import OfflineBanner from "./components/common/OfflineBanner";

// ==========================================
// APP ROUTING CONFIGURATION
// ==========================================
function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const swipeIndicatorRef = useRef(null);

  // Force scroll restoration to top of page on every route navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const handleGlobalSync = (e) => {
      if (e.key === "avora_memory_updated" || e.key === "avora_profile_updated") {
        window.location.reload();
      }
    };

    const memoryChannel = new BroadcastChannel("avora_memory_channel");
    const profileChannel = new BroadcastChannel("avora_profile_channel");

    memoryChannel.onmessage = () => window.location.reload();
    profileChannel.onmessage = () => window.location.reload();

    window.addEventListener("storage", handleGlobalSync);

    return () => {
      window.removeEventListener("storage", handleGlobalSync);
      memoryChannel.close();
      profileChannel.close();
    };
  }, []);

  // Global Left-Edge Swipe to Navigate Back (iOS/Android Native Style)
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwipeBackEligible = false;

    const handleTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;

      // Only trigger if swipe starts from the extreme left edge (first 30px)
      isSwipeBackEligible = touchStartX < 30;

      if (swipeIndicatorRef.current) {
        swipeIndicatorRef.current.style.transition = "none";
      }
    };

    const handleTouchMove = (e) => {
      if (!isSwipeBackEligible || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;

      // If they swipe vertically more than horizontally, cancel the swipe back action
      if (Math.abs(dy) > Math.abs(dx)) {
        isSwipeBackEligible = false;
        if (swipeIndicatorRef.current) {
          swipeIndicatorRef.current.style.transition = "all 0.3s ease";
          swipeIndicatorRef.current.style.left = "-50px";
          swipeIndicatorRef.current.style.opacity = "0";
        }
        return;
      }

      if (dx > 0) {
        const progress = Math.min(dx / 90, 1); // Clamp progression between 0 and 1
        if (swipeIndicatorRef.current) {
          swipeIndicatorRef.current.style.left = `${-50 + progress * 70}px`;
          swipeIndicatorRef.current.style.opacity = `${progress}`;
          swipeIndicatorRef.current.style.transform = `translateY(-50%) scale(${0.8 + progress * 0.2})`;
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (!isSwipeBackEligible) return;

      const changeTouch = e.changedTouches[0];
      if (changeTouch) {
        const dx = changeTouch.clientX - touchStartX;
        const SWIPE_BACK_THRESHOLD = 80; // Trigger back navigation on 80px swipe

        if (dx > SWIPE_BACK_THRESHOLD) {
          // Play interactive trigger animation
          if (swipeIndicatorRef.current) {
            swipeIndicatorRef.current.style.transition = "all 0.2s ease";
            swipeIndicatorRef.current.style.left = "30px";
            swipeIndicatorRef.current.style.transform = "translateY(-50%) scale(1.2)";
            swipeIndicatorRef.current.style.opacity = "0";
          }
          // Navigate back
          setTimeout(() => {
            navigate(-1);
          }, 100);
        }
      }

      isSwipeBackEligible = false;
      setTimeout(() => {
        if (swipeIndicatorRef.current) {
          swipeIndicatorRef.current.style.transition = "all 0.3s ease";
          swipeIndicatorRef.current.style.left = "-50px";
          swipeIndicatorRef.current.style.opacity = "0";
          swipeIndicatorRef.current.style.transform = "translateY(-50%) scale(0.8)";
        }
      }, 150);
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [navigate]);

  return (
    <>
      {/* Edge Swipe Back Navigation Indicator Overlay */}
      <div
        ref={swipeIndicatorRef}
        style={{
          position: "fixed",
          left: "-50px",
          top: "50%",
          transform: "translateY(-50%) scale(0.8)",
          zIndex: 99999,
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          backgroundColor: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </div>
      <OfflineBanner />
      <Routes>
        {/* ========================================== */}
        {/* 1. STATIC PUBLIC & AUTH ROUTES (Must be first) */}
        {/* ========================================== */}
        <Route path="/" element={<Landing />} />
        <Route path="/privacy" element={<LegalPage defaultTab="privacy" />} />
        <Route path="/terms" element={<LegalPage defaultTab="terms" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route path="/suspended" element={<Suspended />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ========================================== */}
        {/* 2. PROTECTED DASHBOARD ROUTES */}
        {/* ========================================== */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/memories" element={<AllMemories />} />
            <Route path="/dashboard/create-memory" element={<CreateMemory />} />
            <Route path="/dashboard/edit-memory/:id" element={<EditMemory />} />
            <Route path="/dashboard/settings/profile" element={<EditProfile />} />
            <Route path="/dashboard/settings/security" element={<SecuritySettings />} />
            <Route path="/dashboard/ai" element={<AI />} />
          </Route>
        </Route>

        {/* ========================================== */}
        {/* 3. PROTECTED ADMIN ROUTES */}
        {/* ========================================== */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="memories" element={<AdminMemories />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* ========================================== */}
        {/* 4. DYNAMIC PROFILE & PUBLIC MEMORY ROUTES (Reverted to root /) */}
        {/* ========================================== */}
        <Route path="/:username" element={<Profile />} />
        <Route path="/:username/:slug" element={<PublicMemory />} />

        {/* Error Routes */}
        <Route path="/403" element={<Forbidden />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;