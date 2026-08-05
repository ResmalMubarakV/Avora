import { Navigate, Outlet } from "react-router-dom";

// ==========================================
// PROTECTED ROUTE COMPONENT
// ==========================================
/**
 * Route guard component that checks for an active authentication token and user role.
 * Redirects unauthenticated users to the landing page, blocks admins from user routes, 
 * and renders child routes via an Outlet if authenticated as a regular user.
 */
const ProtectedRoute = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  // Redirect to landing/login if no token exists
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Redirect admin users away from regular user views to the admin control center
  if (userRole === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Render child routes if authenticated as a regular user
  return <Outlet />;
};

export default ProtectedRoute;