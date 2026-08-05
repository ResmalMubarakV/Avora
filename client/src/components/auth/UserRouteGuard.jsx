import { Navigate, Outlet } from "react-router-dom";

// ==========================================
// USER ROUTE GUARD FOR ADMINS
// ==========================================
/**
 * Prevents admin users from accessing regular user dashboard pages.
 * Redirects them back to the admin control panel.
 */
const UserRouteGuard = () => {
    // Retrieve role from localStorage (or your auth context/store)
    const userRole = localStorage.getItem("userRole");

    if (userRole === "admin") {
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
};

export default UserRouteGuard;