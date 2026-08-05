import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// Layouts & Guards
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

// Public Pages
import Landing from "./pages/public/Landing";
import Profile from "./pages/profile/Profile";
import PublicMemory from "./pages/public/PublicMemory";

// Auth & Onboarding Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import PendingApproval from "./pages/onboarding/PendingApproval";
import Suspended from "./pages/auth/Suspended";

// Dashboard & App Pages
import Dashboard from "./pages/dashboard/Dashboard";
import Memories from "./pages/dashboard/Memories";
import CreateMemory from "./pages/memory/CreateMemory";
import EditMemory from "./pages/memory/EditMemory";
import EditProfile from "./pages/profile/EditProfile";
import AI from "./pages/ai/AI";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminMemories from "./pages/admin/AdminMemories";

// Error Pages
import Forbidden from "./pages/errors/Forbidden";
import NotFound from "./pages/errors/NotFound";

// ==========================================
// APP ROUTING CONFIGURATION
// ==========================================
/**
 * Main application component defining the route hierarchy.
 * Implements public routes, dynamic user profile routes, 
 * protected dashboard routes, administrative routes, and global cross-tab synchronization.
 */
function App() {
  // --- Global Cross-Tab Synchronization Listener ---
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

  return (
    <Routes>
      {/* Public Auth & Marketing Routes */}
      <Route index element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/pending-approval" element={<PendingApproval />} />
      <Route path="/suspended" element={<Suspended />} />

      {/* Admin Auth Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Public Profile Routes */}
      <Route path="/:username" element={<Profile />} />
      <Route path="/:username/:slug" element={<PublicMemory />} />

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/memories" element={<Memories />} />
          <Route path="/dashboard/create-memory" element={<CreateMemory />} />
          <Route path="/dashboard/edit-memory/:id" element={<EditMemory />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/dashboard/ai" element={<AI />} />
        </Route>
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/memories" element={<AdminMemories />} />
        </Route>
      </Route>

      {/* Error Routes */}
      <Route path="/403" element={<Forbidden />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;