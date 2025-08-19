import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useToast } from "@/components/ui/use-toast";

/**
 * Keep this shape aligned with your backend response.
 * The backend currently returns user fields and `token` at the top level.
 */
interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "client" | "personnel" | "admin";
  token?: string;
}

// Context shape — include setters so other components can update auth state.
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isPersonnel: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  setUser: (u: User | null) => void;
  setToken: (t: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const STORAGE_USER_KEY = "user";
const STORAGE_TOKEN_KEY = "token";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { toast } = useToast();

  // Initialize from localStorage so auth survives reloads.
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch (err) {
      console.error("Failed parsing stored user", err);
      localStorage.removeItem(STORAGE_USER_KEY);
      return null;
    }
  });

  const [token, setTokenState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Derived roles/flags
  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === "admin";
  const isPersonnel = user?.role === "personnel";

  // Keep localStorage in sync whenever user or token changes.
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_USER_KEY);
      }
    } catch (err) {
      console.error("Error writing user to localStorage", err);
    }
  }, [user]);

  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem(STORAGE_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(STORAGE_TOKEN_KEY);
      }
    } catch (err) {
      console.error("Error writing token to localStorage", err);
    }
  }, [token]);

  // finish initial load
  useEffect(() => {
    // small microtask to indicate we've finished reading local storage
    setIsLoading(false);
  }, []);

  // Exposed setUser/setToken that update both React state and localStorage (already synced via effects)
  const setUser = useCallback((u: User | null) => {
    setUserState(u);
  }, []);

  const setToken = useCallback((t: string | null) => {
    setTokenState(t);
  }, []);

  // Login implementation - calls backend and sets user/token on success
  const login = useCallback(
    async (email: string, password: string): Promise<User | null> => {
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

        if (!response.ok) {
          throw new Error(data?.error || "Login failed");
        }

        // backend returns user fields and token at top-level
        const receivedToken: string | undefined = data?.token ?? undefined;

        // Compose a user object that includes token for convenience
        const loggedInUser: User = {
          _id: data._id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          token: receivedToken,
        };

        // Persist
        setUserState(loggedInUser);
        if (receivedToken) setTokenState(receivedToken);

        toast({
          title: "Login Successful",
          description: `Welcome back, ${loggedInUser.firstName}!`,
        });

        return loggedInUser;
      } catch (error: any) {
        console.error("Login failed:", error);
        toast({
          title: "Login Failed",
          description: error?.message || "Unable to login",
          variant: "destructive",
        });
        return null;
      }
    },
    [toast]
  );

  // Logout clears react state and storage
  const logout = useCallback(() => {
    setUserState(null);
    setTokenState(null);
    try {
      localStorage.removeItem(STORAGE_USER_KEY);
      localStorage.removeItem(STORAGE_TOKEN_KEY);
    } catch (err) {
      console.error("Failed to clear localStorage during logout", err);
    }

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  }, [toast]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    isAdmin,
    isPersonnel,
    login,
    logout,
    setUser,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
