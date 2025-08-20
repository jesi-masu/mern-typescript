import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  AdminUser,
  ActivityLog,
  CustomerNotification,
  AdminAuthContextType,
} from "@/types/admin";
import { DEMO_USERS, DEMO_PASSWORDS } from "@/data/adminUsers";
import { hasUserPermission } from "@/utils/adminPermissions";

export const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export const AdminAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Synchronously read sessionStorage so the initial render has the correct admin state
  const initialAdminAuth = (() => {
    try {
      return sessionStorage.getItem("adminAuthenticated") === "true";
    } catch {
      return false;
    }
  })();

  const initialUser = (() => {
    try {
      const raw = sessionStorage.getItem("adminUserData");
      return raw ? (JSON.parse(raw) as AdminUser) : null;
    } catch (err) {
      console.error("Failed parsing adminUserData from sessionStorage", err);
      try {
        sessionStorage.removeItem("adminUserData");
      } catch {}
      return null;
    }
  })();

  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(initialAdminAuth);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(initialUser);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem("adminActivityLogs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [customerNotifications, setCustomerNotifications] = useState<
    CustomerNotification[]
  >(() => {
    try {
      const saved = localStorage.getItem("customerNotifications");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  // Keep in effect in case storage changes externally; it will not clobber already-initialized state
  useEffect(() => {
    const adminAuth = sessionStorage.getItem("adminAuthenticated");
    const userData = sessionStorage.getItem("adminUserData");

    if (adminAuth === "true" && userData && !currentUser) {
      try {
        const user = JSON.parse(userData);
        setIsAuthenticated(true);
        setCurrentUser(user);
      } catch (err) {
        console.error("Failed parsing adminUserData in effect", err);
      }
    }
  }, [currentUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = DEMO_USERS.find((u) => u.email === email);

    if (user && DEMO_PASSWORDS[email] === password) {
      try {
        sessionStorage.setItem("adminAuthenticated", "true");
        sessionStorage.setItem("adminUserData", JSON.stringify(user));
      } catch (err) {
        console.warn("Failed to write admin sessionStorage", err);
      }

      setIsAuthenticated(true);
      setCurrentUser(user);

      // Log the login activity
      logActivity(
        "User Login",
        `${user.name} logged into the system`,
        "system"
      );

      toast({
        title: "Login successful",
        description: `Welcome ${user.name}`,
      });
      return true;
    }

    toast({
      title: "Login failed",
      description: "Invalid email or password",
      variant: "destructive",
    });
    return false;
  };

  const logout = () => {
    if (currentUser) {
      logActivity(
        "User Logout",
        `${currentUser.name} logged out of the system`,
        "system"
      );
    }

    try {
      sessionStorage.removeItem("adminAuthenticated");
      sessionStorage.removeItem("adminUserData");
    } catch (err) {
      console.warn("Failed to clear admin sessionStorage", err);
    }

    setIsAuthenticated(false);
    setCurrentUser(null);

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });

    // Redirect to admin login
    navigate("/admin-login", { replace: true });
  };

  const logActivity = (
    action: string,
    details: string,
    category: ActivityLog["category"]
  ) => {
    // Use System fallback if currentUser missing so logging still works
    const userId = currentUser?.id || "system";
    const userName = currentUser?.name || "System";

    const newLog: ActivityLog = {
      id: Date.now().toString(),
      userId,
      userName,
      action,
      details,
      timestamp: new Date().toISOString(),
      category,
    };

    const updatedLogs = [newLog, ...activityLogs].slice(0, 100);
    setActivityLogs(updatedLogs);
    try {
      localStorage.setItem("adminActivityLogs", JSON.stringify(updatedLogs));
    } catch (err) {
      console.warn("Failed to persist adminActivityLogs", err);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    return hasUserPermission(currentUser.role, permission);
  };

  const addCustomerNotification = (
    customerId: string,
    orderId: string,
    message: string,
    type: CustomerNotification["type"]
  ) => {
    if (!currentUser) return;

    const newNotification: CustomerNotification = {
      id: Date.now().toString(),
      customerId,
      orderId,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      fromPersonnel: currentUser.name,
    };

    const updatedNotifications = [newNotification, ...customerNotifications];
    setCustomerNotifications(updatedNotifications);
    try {
      localStorage.setItem(
        "customerNotifications",
        JSON.stringify(updatedNotifications)
      );
    } catch (err) {
      console.warn("Failed to persist customerNotifications", err);
    }

    logActivity(
      "Customer Notification",
      `Notification sent to customer for order ${orderId}: ${message}`,
      "orders"
    );
  };

  const getCustomerNotifications = (
    customerId: string
  ): CustomerNotification[] => {
    return customerNotifications.filter(
      (notification) => notification.customerId === customerId
    );
  };

  const markNotificationAsRead = (notificationId: string) => {
    const updatedNotifications = customerNotifications.map((notification) =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    setCustomerNotifications(updatedNotifications);
    try {
      localStorage.setItem(
        "customerNotifications",
        JSON.stringify(updatedNotifications)
      );
    } catch (err) {
      console.warn("Failed to persist customerNotifications", err);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        activityLogs,
        customerNotifications,
        login,
        logout,
        logActivity,
        hasPermission,
        addCustomerNotification,
        getCustomerNotifications,
        markNotificationAsRead,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

// Keep this export for convenience
export { useAdminAuth } from "@/hooks/useAdminAuth";
