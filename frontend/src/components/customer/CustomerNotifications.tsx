import React, { useState, useEffect, useCallback } from "react";
import { Bell, CheckCircle, Clock, FileText, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

// This interface must match the one used in AdminAuthContext
interface CustomerNotification {
  id: string;
  customerId: string; // Used to filter notifications for the current user
  orderId: string;
  message: string;
  type:
    | "order_update"
    | "payment_confirmed"
    | "contract_ready"
    | "delivery_scheduled";
  timestamp: string;
  read: boolean;
  fromPersonnel?: string;
}

const NOTIFICATIONS_STORAGE_KEY = "customerNotifications";

const CustomerNotifications: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<CustomerNotification[]>(
    []
  );
  const [isOpen, setIsOpen] = useState(false);

  // --- NEW: useCallback for stable state updates ---
  const loadNotifications = useCallback(() => {
    if (isAuthenticated && user) {
      try {
        const allNotifications: CustomerNotification[] = JSON.parse(
          localStorage.getItem(NOTIFICATIONS_STORAGE_KEY) || "[]"
        );
        // Filter notifications for the currently logged-in user
        const userNotifications = allNotifications.filter(
          (n) => n.customerId === user._id
        );
        setNotifications(userNotifications);
      } catch (error) {
        console.error("Failed to load notifications from storage:", error);
        setNotifications([]);
      }
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated, user]);

  // --- NEW: useEffect to listen for real-time storage changes ---
  useEffect(() => {
    // Initial load
    loadNotifications();

    // Listen for changes from other tabs/windows (e.g., admin panel)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === NOTIFICATIONS_STORAGE_KEY) {
        loadNotifications();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadNotifications]);

  const markNotificationAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    // Update local state immediately for a responsive UI
    setNotifications(updatedNotifications);

    // Persist the change to localStorage
    try {
      const allNotifications: CustomerNotification[] = JSON.parse(
        localStorage.getItem(NOTIFICATIONS_STORAGE_KEY) || "[]"
      );
      const updatedAll = allNotifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem(
        NOTIFICATIONS_STORAGE_KEY,
        JSON.stringify(updatedAll)
      );
    } catch (error) {
      console.error("Failed to save notification update to storage:", error);
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: CustomerNotification["type"]) => {
    switch (type) {
      case "order_update":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "payment_confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "contract_ready":
        return <FileText className="h-4 w-4 text-purple-500" />;
      case "delivery_scheduled":
        return <Truck className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: CustomerNotification["type"]) => {
    switch (type) {
      case "order_update":
        return "border-blue-200";
      case "payment_confirmed":
        return "border-green-200";
      case "contract_ready":
        return "border-purple-200";
      case "delivery_scheduled":
        return "border-orange-200";
      default:
        return "border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleNotificationClick = (notification: CustomerNotification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
    // Navigate to the relevant order tracking page
    navigate(`/order-tracking/${notification.orderId}`);
    setIsOpen(false); // Close the popover after navigation
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
              {unreadNotifications > 9 ? "9+" : unreadNotifications}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </div>
              {unreadNotifications > 0 && (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {unreadNotifications} new
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 cursor-pointer hover:bg-gray-50 transition-colors ${getNotificationColor(
                      notification.type
                    )} ${!notification.read ? "bg-blue-50" : ""}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm ${
                              !notification.read
                                ? "font-semibold"
                                : "font-medium"
                            }`}
                          >
                            Order #{notification.orderId}
                          </p>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          {notification.fromPersonnel && (
                            <p className="text-xs text-gray-500">
                              From: {notification.fromPersonnel}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 ml-auto">
                            {formatDate(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default CustomerNotifications;
