// src/components/customer/dashboard-components/DashboardTabs.tsx

import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, Bell, MessageSquare, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const DashboardTabs = () => {
  const { getTotalItems } = useCart();
  const cartItemsCount = getTotalItems();
  const unreadNotifications = 0; // Mock data
  const unreadMessages = 0; // Mock data

  return (
    <TabsList className="grid w-full grid-cols-5">
      <TabsTrigger value="orders" className="flex items-center gap-2">
        <Package className="h-4 w-4" />
        Orders
      </TabsTrigger>
      <TabsTrigger value="shopping" className="flex items-center gap-2">
        <ShoppingCart className="h-4 w-4" />
        Shopping
        {cartItemsCount > 0 && (
          <Badge
            variant="default"
            className="ml-1 h-5 w-5 text-xs p-0 flex items-center justify-center bg-blue-600"
          >
            {cartItemsCount}
          </Badge>
        )}
      </TabsTrigger>
      <TabsTrigger value="notifications" className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        Notifications
        {unreadNotifications > 0 && (
          <Badge
            variant="destructive"
            className="ml-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
          >
            {unreadNotifications}
          </Badge>
        )}
      </TabsTrigger>
      <TabsTrigger value="messages" className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        Messages
        {unreadMessages > 0 && (
          <Badge
            variant="destructive"
            className="ml-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
          >
            {unreadMessages}
          </Badge>
        )}
      </TabsTrigger>
      <TabsTrigger value="profile" className="flex items-center gap-2">
        <User className="h-4 w-4" />
        Profile
      </TabsTrigger>
    </TabsList>
  );
};
