import { Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import Landing from "./pages/public/Landing";
import Profile from "./pages/profile/Profile";
import PublicMemory from "./pages/public/PublicMemory";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import PendingApproval from "./pages/onboarding/PendingApproval";
import Suspended from "./pages/auth/Suspended";

import Dashboard from "./pages/dashboard/Dashboard";
import Memories from "./pages/dashboard/Memories";
import CreateMemory from "./pages/memory/CreateMemory";
import EditMemory from "./pages/memory/EditMemory";
import EditProfile from "./pages/profile/EditProfile";
import AI from "./pages/ai/AI";

import Forbidden from "./pages/errors/Forbidden";
import NotFound from "./pages/errors/NotFound";

function App() {
    return (
        <Routes>

            {/* Public */}

            <Route index element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/pending-approval" element={<PendingApproval />} />
            <Route path="/suspended" element={<Suspended />} />

            {/* Public Profile */}

            <Route path="/:username" element={<Profile />} />
            <Route path="/:username/:slug" element={<PublicMemory />} />

            {/* Protected Dashboard */}

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

            {/* Error Pages */}

            <Route path="/403" element={<Forbidden />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />

        </Routes>
    );
}

export default App;