// frontend/src/components/admin/ProtectedAdminRoutes.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedAdminRouteProps {
  component: React.ComponentType;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  component: Component,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show a loading spinner while checking auth status
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Check for authentication and correct role
  const isAuthorized =
    isAuthenticated &&
    user &&
    (user.role === "admin" || user.role === "personnel");

  if (!isAuthorized) {
    // Redirect to login page if not authorized, saving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render the component if authorized
  return <Component />;
};

export default ProtectedAdminRoute;
