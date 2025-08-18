
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Small delay to ensure proper navigation
    const timer = setTimeout(() => {
      navigate("/home", { replace: true });
    }, 100);

    return () => clearTimeout(timer);
  }, [navigate]);

  // Show a simple loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading PrefabPlus...</p>
      </div>
    </div>
  );
};

export default Index;
