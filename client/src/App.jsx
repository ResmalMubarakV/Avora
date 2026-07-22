import { Routes , Route } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/profile/Profile"
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicProfile from "./pages/profile/PublicProfile"
import PublicMemory from "./components/profile/PublicMemory";

function App() {
  return (
    <Routes>

       {/* Public Routes */}     
       <Route element ={<AuthLayout />}>
          <Route index element ={<Login/>} />
          <Route path = "register" element ={<Register/>} />
          <Route path="/:username" element={<PublicProfile />} />
          <Route path="/:username/:slug" element={<PublicMemory />}
/>
       </Route>

        {/* Protected Routes */} 
      <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
          </Route>
      </Route>
    </Routes>
  );
};

export default App;