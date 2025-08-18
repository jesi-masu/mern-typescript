// frontend/src/components/ProtectedCustomerRoutes.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedCustomerRouteProps {
  children: React.ReactNode;
}

const ProtectedCustomerRoute: React.FC<ProtectedCustomerRouteProps> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show a loading spinner while checking auth status
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render the children if authenticated
  return <>{children}</>;
};

export default ProtectedCustomerRoute;
