// frontend/src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useToast } from "@/components/ui/use-toast";

// Define the shape of the User object, matching your backend response
interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "client" | "personnel" | "admin";
  token: string;
}

// Define the context type
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the provider props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true to check session
  const { toast } = useToast();

  // Check for existing session on initial load
  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      const storedToken = sessionStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Failed to parse user from session storage", error);
      sessionStorage.clear(); // Clear corrupted storage
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login function that calls the backend
  const login = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const loggedInUser: User = data;

        // Persist user and token to session storage
        sessionStorage.setItem("user", JSON.stringify(loggedInUser));
        sessionStorage.setItem("token", loggedInUser.token);

        setUser(loggedInUser);
        setToken(loggedInUser.token);

        toast({
          title: "Login Successful",
          description: `Welcome back, ${loggedInUser.firstName}!`,
        });
        return loggedInUser;
      } else {
        throw new Error(data.error || "An unknown error occurred.");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  // Logout function
  const logout = useCallback(() => {
    // Clear state and session storage
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  }, [toast]);

  const value = {
    user,
    token,
    isAuthenticated: !!user, // isAuthenticated is true if user is not null
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
