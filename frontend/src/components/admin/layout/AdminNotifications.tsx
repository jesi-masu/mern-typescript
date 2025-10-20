import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  CheckCircle,
  Clock,
  FileText,
  Truck,
  Loader2,
  CheckCheck,
  ListOrdered,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface AdminNotification {
  _id: string;
  userId: string;
  orderId?: string;
  message: string;
  type: string;
  createdAt: string;
  readStatus: boolean;
}

const fetchNotifications = async (
  token: string | null
): Promise<AdminNotification[]> => {
  if (!token) return [];
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/notifications`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch notifications");
  return response.json();
};

const markAsReadAPI = async ({
  notificationId,
  token,
}: {
  notificationId: string;
  token: string | null;
}): Promise<AdminNotification> => {
  if (!token) throw new Error("Not authenticated");
  const response = await fetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/api/notifications/${notificationId}/read`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) throw new Error("Failed to mark as read");
  return response.json();
};

const markAllAsReadAPI = async (
  token: string | null
): Promise<{ message: string; modifiedCount: number }> => {
  if (!token) throw new Error("Not authenticated");
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/notifications/read-all`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) throw new Error("Failed to mark all as read");
  return response.json();
};

const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return `yesterday`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const AdminNotifications: React.FC = () => {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: notifications = [],
    isLoading,
    error,
  } = useQuery<AdminNotification[]>({
    queryKey: ["adminNotifications", user?._id],
    queryFn: () => fetchNotifications(token),
    enabled:
      isAuthenticated &&
      !!user?._id &&
      (user.role === "admin" || user.role === "personnel"),
    refetchInterval: 60000,
    staleTime: 30000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: markAsReadAPI,
    onSuccess: (updatedNotification) => {
      queryClient.setQueryData<AdminNotification[]>(
        ["adminNotifications", user?._id],
        (oldData) =>
          oldData?.map((n) =>
            n._id === updatedNotification._id ? { ...n, readStatus: true } : n
          ) ?? []
      );
      if (updatedNotification.orderId) {
        navigate(`/admin/orders/${updatedNotification.orderId}`);
        setIsOpen(false);
      }
    },
    onError: (err) => {
      toast({
        title: "Error",
        description:
          (err as Error).message || "Could not mark notification as read.",
        variant: "destructive",
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllAsReadAPI(token),
    onSuccess: (data) => {
      toast({ description: data.message });
      queryClient.setQueryData<AdminNotification[]>(
        ["adminNotifications", user?._id],
        (oldData) => oldData?.map((n) => ({ ...n, readStatus: true })) ?? []
      );
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: (err as Error).message || "Could not mark all as read.",
        variant: "destructive",
      });
    },
  });

  const unreadNotifications = notifications.filter((n) => !n.readStatus).length;

  const handleNotificationClick = (notification: AdminNotification) => {
    if (!notification.readStatus) {
      markAsReadMutation.mutate({ notificationId: notification._id, token });
    } else if (notification.orderId) {
      navigate(`/admin/orders/${notification.orderId}`);
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  const handleMarkAllRead = () => {
    if (unreadNotifications > 0) {
      markAllAsReadMutation.mutate();
    }
  };

  const getNotificationIcon = (type: AdminNotification["type"]) => {
    switch (type) {
      case "new_order_admin":
        return (
          <ListOrdered className="h-4 w-4 text-indigo-500 flex-shrink-0" />
        );
      case "order_update":
        return <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />;
      case "payment_confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500 flex-shrink-0" />;
    }
  };
  const getNotificationColor = (type: AdminNotification["type"]) => {
    switch (type) {
      case "new_order_admin":
        return "border-indigo-300";
      case "order_update":
        return "border-blue-300";
      case "payment_confirmed":
        return "border-green-300";
      default:
        return "border-gray-300";
    }
  };

  if (
    !isAuthenticated ||
    !user ||
    (user.role !== "admin" && user.role !== "personnel")
  ) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs rounded-full">
              {unreadNotifications > 9 ? "9+" : unreadNotifications}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="flex items-center justify-between text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </div>
              {unreadNotifications > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadNotifications} New
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-8 px-4 text-red-600 text-sm">
                Failed to load notifications.
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`px-4 py-3 border-l-4 cursor-pointer hover:bg-gray-50 transition-colors ${getNotificationColor(
                      notification.type
                    )} ${!notification.readStatus ? "bg-blue-50/50" : ""}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm break-words ${
                              !notification.readStatus
                                ? "font-semibold text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {notification.message}
                          </p>
                          {!notification.readStatus && (
                            <div
                              title="Unread"
                              className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"
                            ></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          {notifications.length > 0 && unreadNotifications > 0 && (
            <CardFooter className="p-2 border-t">
              <Button
                variant="link"
                size="sm"
                className="w-full text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                onClick={handleMarkAllRead}
                disabled={markAllAsReadMutation.isPending}
              >
                {markAllAsReadMutation.isPending ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <CheckCheck className="h-3 w-3 mr-1" />
                )}
                Mark all as read
              </Button>
            </CardFooter>
          )}
        </Card>
      </PopoverContent>
    </Popover>
  );
};
