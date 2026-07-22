import { Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import OwnerProfile from "./pages/profile/OwnerProfile";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicProfile from "./pages/profile/PublicProfile";
import PublicMemory from "./components/profile/PublicMemory";
import Landing from "./pages/public/Landing";

function App() {
    return (
        <Routes>

            {/* Landing */}
            <Route index element={<Landing />} />

            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Public Profiles */}
            <Route path="/:username" element={<PublicProfile />} />
            <Route path="/:username/:slug" element={<PublicMemory />} />

            {/* Protected */}
            <Route element={<ProtectedRoute />}>

                <Route element={<DashboardLayout />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/profile"
                        element={<OwnerProfile />}
                    />

                </Route>

            </Route>

        </Routes>
    );
}

export default App;