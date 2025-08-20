import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AdminAuthContext } from "@/context/AdminAuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedAdminRouteProps {
  // Backward-compatible component prop (optional)
  component?: React.ComponentType;
  // Preferred wrapper usage: <ProtectedAdminRoute>...</ProtectedAdminRoute>
  children?: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  component: Component,
  children,
}) => {
  // Primary auth (customer/user) context
  const { isAuthenticated: isAuthAuthenticated, user, isLoading } = useAuth();
  // Optional admin-specific context (may be undefined if provider not mounted)
  const adminContext = useContext(AdminAuthContext);
  const location = useLocation();

  // Show a spinner while auth state is being resolved
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Determine authorization from either the main AuthContext or AdminAuthContext
  const isAuthorizedFromAuth =
    isAuthAuthenticated &&
    user &&
    (user.role === "admin" || user.role === "personnel");

  const isAuthorizedFromAdmin = adminContext?.isAuthenticated === true;

  const isAuthorized = isAuthorizedFromAuth || isAuthorizedFromAdmin;

  if (!isAuthorized) {
    // Not authorized — redirect to admin login with original location saved
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  // Render either the component prop (backwards compatible) or children (preferred)
  if (Component) {
    return <Component />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
