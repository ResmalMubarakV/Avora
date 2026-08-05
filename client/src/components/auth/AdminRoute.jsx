import { Navigate, Outlet } from "react-router-dom";
import useCurrentUser from "../../hooks/useCurrentUser";

// ==========================================
// ADMIN ROUTE GUARD COMPONENT
// ==========================================
/**
 * Protects admin-only routes. Checks authentication token and 
 * verifies that the current user has 'admin' privileges.
 */
const AdminRoute = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const { user, loading } = useCurrentUser();

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          Verifying administrator session...
        </p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;