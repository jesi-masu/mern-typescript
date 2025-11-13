// src/components/customer/dashboard-components/OrdersTab.tsx

import React from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Order } from "@/types/order"; // Corrected path
import { OrderSummaryCards } from "./OrderSummaryCards";
import { OrderList } from "./OrderList";

interface OrdersTabProps {
  orders: Order[];
  isLoading: boolean;
  isError: boolean;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  isLoading,
  isError,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      // ✏️ 1. ADDED 'animate-fadeIn' TO THE ERROR BLOCK
      <div className="flex flex-col justify-center items-center h-64 bg-red-50 text-red-700 rounded-lg p-4 animate-fadeIn">
        <AlertCircle className="h-8 w-8 mb-2" />
        <h3 className="text-lg font-semibold">Failed to Load Orders</h3>
        <p>There was an error fetching your order data.</p>
      </div>
    );
  }

  return (
    // ✏️ 2. ADDED 'animate-fadeIn' WRAPPER AROUND THE CONTENT
    <div className="animate-fadeIn space-y-6">
      <OrderSummaryCards orders={orders} />
      <OrderList orders={orders} />
    </div>
  );
};
