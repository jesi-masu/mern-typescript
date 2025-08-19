// frontend/src/components/admin/ProtectedAdminRoutes.tsx
// updated to allow access when either AuthContext or AdminAuthContext indicates admin login
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AdminAuthContext } from "@/context/AdminAuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedAdminRouteProps {
  component: React.ComponentType;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  component: Component,
}) => {
  const { isAuthenticated: isAuthAuthenticated, user, isLoading } = useAuth();
  const adminContext = useContext(AdminAuthContext); // may be undefined if AdminAuthProvider not mounted
  const location = useLocation();

  if (isLoading) {
    // Show a loading spinner while checking auth status
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Check for authentication and correct role either from AuthContext or AdminAuthContext
  const isAuthorizedFromAuth =
    isAuthAuthenticated &&
    user &&
    (user.role === "admin" || user.role === "personnel");

  const isAuthorizedFromAdmin = adminContext?.isAuthenticated === true;

  const isAuthorized = isAuthorizedFromAuth || isAuthorizedFromAdmin;

  if (!isAuthorized) {
    // Redirect to admin login page if not authorized, saving the intended destination
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return <Component />;
};

export default ProtectedAdminRoute;
