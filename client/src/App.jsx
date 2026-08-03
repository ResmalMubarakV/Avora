import { Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import OwnerProfile from "./pages/profile/OwnerProfile";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicProfile from "./pages/profile/PublicProfile";
import PublicMemory from "./pages/public/PublicMemory";
import Landing from "./pages/public/Landing";
import PendingApproval from "./pages/onboarding/PendingApproval";
import Suspended from "./pages/auth/Suspended";
import NotFound from "./pages/errors/NotFound";
import Forbidden from "./pages/errors/Forbidden";
import CreateMemory from "./pages/memory/CreateMemory";
import EditMemory from "./pages/memory/EditMemory";


function App() {
    return (
        <Routes>

            {/* Landing */}
            <Route index element={<Landing />} />
            <Route path="/pending-approval" element={<PendingApproval />} />
            <Route path="/suspended" element={<Suspended />} />

            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Public Profiles */}
            <Route path="/:username" element={<PublicProfile />} />
            <Route path="/:username/:slug" element={<PublicMemory />} />

            {/* Protected */}
            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<OwnerProfile />} />
                    <Route path="/dashboard/create-memory" element={<CreateMemory />} />
                    <Route path="/dashboard/edit-memory/:id" element={<EditMemory />} />
                </Route>
            </Route>

            {/* Error Pages */}
            <Route path="/404" element={<NotFound />} />
            <Route path="/403" element={<Forbidden />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />

        </Routes>
    );
}

export default App;