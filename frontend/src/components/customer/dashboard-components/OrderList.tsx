// src/components/customer/dashboard-components/OrderList.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { Order } from "@/types/order"; // Corrected path
import { OrderCardItem } from "./OrderCardItem";
import { useNavigate } from "react-router-dom";

interface OrderListProps {
  orders: Order[];
}

export const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
        <p className="text-gray-600 mb-6">
          Start shopping to see your orders here.
        </p>
        <Button onClick={() => navigate("/shop")}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCardItem key={order._id} order={order} />
      ))}
    </div>
  );
};
