// src/components/customer/dashboard-components/OrderSummaryCards.tsx

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Package, MapPin } from "lucide-react";
import { Order } from "@/types/order"; // Corrected path

interface OrderSummaryCardsProps {
  orders: Order[];
}

export const OrderSummaryCards: React.FC<OrderSummaryCardsProps> = ({
  orders,
}) => {
  const inProgressCount = orders.filter(
    (o) => !["Delivered", "Completed", "Cancelled"].includes(o.orderStatus)
  ).length;

  const completedCount = orders.filter((o) =>
    ["Delivered", "Completed"].includes(o.orderStatus)
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold">{inProgressCount}</p>
            </div>
            <MapPin className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold">{completedCount}</p>
            </div>
            <Package className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
