import { Routes , Route } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import OwnerProfile from "./pages/profile/OwnerProfile"
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicProfile from "./pages/profile/PublicProfile"
import PublicMemory from "./components/profile/PublicMemory";
import Landing from "./pages/public/Landing";

function App() {
  return (
    <Routes>

       {/* Public Routes */}     
       <Route element ={<AuthLayout />}>
          <Route index element={<Landing />} />
          <Route path="/login" element ={<Login/>} />
          <Route path ="register" element ={<Register/>} />
          <Route path="/:username" element={<PublicProfile />} />
          <Route path="/:username/:slug" element={<PublicMemory />} />
       </Route>

        {/* Protected Routes */} 
      <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="Profile" element={<OwnerProfile />} />
          </Route>
      </Route>
    </Routes>
  );
};

export default App;