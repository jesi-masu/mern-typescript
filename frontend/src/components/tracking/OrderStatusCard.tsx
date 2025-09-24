import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, Clock, Truck, CheckCircle } from "lucide-react";
import { OrderDetail } from "@/types/order";

interface OrderStatusCardProps {
  order: OrderDetail;
}

const orderStatusSteps = [
  { key: "Pending", label: "Order Placed", icon: Package },
  { key: "Processing", label: "Processing", icon: Clock },
  { key: "In Production", label: "In Production", icon: Package },
  { key: "Shipped", label: "Shipped", icon: Truck },
  { key: "Completed", label: "Completed", icon: CheckCircle },
];

const getOrderStatusColor = (status: OrderDetail["orderStatus"]) => {
  const colorMap: Record<OrderDetail["orderStatus"], string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    Processing: "bg-blue-100 text-blue-800",
    "In Production": "bg-purple-100 text-purple-800",
    Shipped: "bg-indigo-100 text-indigo-800",
    Delivered: "bg-green-100 text-green-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
};

const getOrderStatusProgress = (status: OrderDetail["orderStatus"]) => {
  const progressMap: Record<OrderDetail["orderStatus"], number> = {
    Pending: 10,
    Processing: 30,
    "In Production": 50,
    Shipped: 75,
    Delivered: 100,
    Completed: 100,
    Cancelled: 0,
  };
  return progressMap[status] || 0;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const OrderStatusCard: React.FC<OrderStatusCardProps> = ({ order }) => {
  const currentOrderStatusIndex = orderStatusSteps.findIndex(
    (step) => step.key === order.orderStatus
  );
  const orderProgress = getOrderStatusProgress(order.orderStatus);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Order Status</CardTitle>
          <Badge className={getOrderStatusColor(order.orderStatus)}>
            {order.orderStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={orderProgress} className="h-3" />
          <div className="flex justify-between items-center pt-4">
            {orderStatusSteps.map((step, index) => {
              const isCompleted = index < currentOrderStatusIndex;
              const isCurrent = index === currentOrderStatusIndex;
              const Icon = step.icon;
              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center text-center w-1/5"
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 mb-2 ${
                      isCompleted
                        ? "bg-green-100 border-green-500 text-green-600"
                        : isCurrent
                        ? "bg-blue-100 border-blue-500 text-blue-600"
                        : "bg-gray-100 border-gray-300 text-gray-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p
                    className={`text-xs font-medium ${
                      isCompleted || isCurrent
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
          {order.estimatedDelivery && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Estimated Delivery:</strong>{" "}
                {formatDate(order.estimatedDelivery)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
