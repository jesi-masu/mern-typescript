
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AdminUser, ActivityLog, CustomerNotification, AdminAuthContextType } from "@/types/admin";
import { DEMO_USERS, DEMO_PASSWORDS } from "@/data/adminUsers";
import { hasUserPermission } from "@/utils/adminPermissions";

export const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [customerNotifications, setCustomerNotifications] = useState<CustomerNotification[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already authenticated
    const adminAuth = sessionStorage.getItem("adminAuthenticated");
    const userData = sessionStorage.getItem("adminUserData");
    
    if (adminAuth === "true" && userData) {
      const user = JSON.parse(userData);
      setIsAuthenticated(true);
      setCurrentUser(user);
    }

    // Load activity logs from localStorage
    const savedLogs = localStorage.getItem("adminActivityLogs");
    if (savedLogs) {
      setActivityLogs(JSON.parse(savedLogs));
    }

    // Load customer notifications from localStorage
    const savedNotifications = localStorage.getItem("customerNotifications");
    if (savedNotifications) {
      setCustomerNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = DEMO_USERS.find(u => u.email === email);
    
    if (user && DEMO_PASSWORDS[email] === password) {
      sessionStorage.setItem("adminAuthenticated", "true");
      sessionStorage.setItem("adminUserData", JSON.stringify(user));
      setIsAuthenticated(true);
      setCurrentUser(user);
      
      // Log the login activity
      logActivity("User Login", `${user.name} logged into the system`, "system");
      
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
      logActivity("User Logout", `${currentUser.name} logged out of the system`, "system");
    }
    
    sessionStorage.removeItem("adminAuthenticated");
    sessionStorage.removeItem("adminUserData");
    setIsAuthenticated(false);
    setCurrentUser(null);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    // Ensure proper redirection to admin login page
    navigate("/admin-login", { replace: true });
  };

  const logActivity = (action: string, details: string, category: ActivityLog['category']) => {
    if (!currentUser) return;

    const newLog: ActivityLog = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      details,
      timestamp: new Date().toISOString(),
      category
    };

    const updatedLogs = [newLog, ...activityLogs].slice(0, 100); // Keep last 100 logs
    setActivityLogs(updatedLogs);
    localStorage.setItem("adminActivityLogs", JSON.stringify(updatedLogs));
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    return hasUserPermission(currentUser.role, permission);
  };

  const addCustomerNotification = (customerId: string, orderId: string, message: string, type: CustomerNotification['type']) => {
    if (!currentUser) return;

    const newNotification: CustomerNotification = {
      id: Date.now().toString(),
      customerId,
      orderId,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      fromPersonnel: currentUser.name
    };

    const updatedNotifications = [newNotification, ...customerNotifications];
    setCustomerNotifications(updatedNotifications);
    localStorage.setItem("customerNotifications", JSON.stringify(updatedNotifications));

    // Log the notification activity
    logActivity("Customer Notification", `Notification sent to customer for order ${orderId}: ${message}`, "orders");
  };

  const getCustomerNotifications = (customerId: string): CustomerNotification[] => {
    return customerNotifications.filter(notification => notification.customerId === customerId);
  };

  const markNotificationAsRead = (notificationId: string) => {
    const updatedNotifications = customerNotifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    setCustomerNotifications(updatedNotifications);
    localStorage.setItem("customerNotifications", JSON.stringify(updatedNotifications));
  };

  return (
    <AdminAuthContext.Provider value={{ 
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
      markNotificationAsRead
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Export the hook for convenience
export { useAdminAuth } from '@/hooks/useAdminAuth';
