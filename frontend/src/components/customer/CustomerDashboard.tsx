// src/components/customer/CustomerDashboard.tsx

import React, { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Bell, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// --- [FIXED] Corrected the import path to point to the new location ---
import CustomerShoppingTab from "./dashboard-components/CustomerShoppingTab";

import { DashboardHeader } from "./dashboard-components/DashboardHeader";
import { DashboardTabs } from "./dashboard-components/DashboardTabs";
import { OrdersTab } from "./dashboard-components/OrdersTab";
import { ProfileTab } from "./dashboard-components/ProfileTab";
import { PlaceholderTab } from "./dashboard-components/PlaceholderTab";
import { useUserOrders } from "@/hooks/useUserOrders";

const CustomerDashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useUserOrders(user?._id, token);

  return (
    <div className="container py-8 max-w-6xl">
      <DashboardHeader />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <DashboardTabs />

        <TabsContent value="orders" className="space-y-6">
          <OrdersTab orders={orders} isLoading={isLoading} isError={isError} />
        </TabsContent>

        <TabsContent value="shopping" className="space-y-6">
          <CustomerShoppingTab />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <PlaceholderTab Icon={Bell} message="No new notifications." />
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <PlaceholderTab Icon={MessageSquare} message="No new messages." />
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <ProfileTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDashboard;
