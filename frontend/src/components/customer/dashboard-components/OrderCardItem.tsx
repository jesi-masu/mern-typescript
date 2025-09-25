import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Order, PaymentStatus } from "@/types/order";
import { useNavigate } from "react-router-dom";

interface OrderCardItemProps {
  order: Order;
}

const getStatusClasses = (
  status: Order["orderStatus"] | PaymentStatus
): string => {
  const baseClasses = "font-semibold border-transparent text-xs px-2 py-0.5";
  switch (status) {
    case "Pending":
      return `bg-yellow-100 text-yellow-800 ${baseClasses}`;
    case "Processing":
      return `bg-blue-100 text-blue-800 ${baseClasses}`;
    case "In Production":
      return `bg-purple-100 text-purple-800 ${baseClasses}`;
    case "Shipped":
      return `bg-indigo-100 text-indigo-800 ${baseClasses}`;
    case "Delivered":
    case "Completed":
      return `bg-green-100 text-green-800 ${baseClasses}`;
    case "Cancelled":
      return `bg-red-100 text-red-800 ${baseClasses}`;
    case "50% Complete Paid":
      return `bg-blue-100 text-blue-800 ${baseClasses}`;
    case "90% Complete Paid":
      return `bg-indigo-100 text-indigo-800 ${baseClasses}`;
    case "100% Complete Paid":
      return `bg-green-100 text-green-800 ${baseClasses}`;
    default:
      return `bg-gray-100 text-gray-800 ${baseClasses}`;
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-ph", {
    style: "currency",
    currency: "PHP",
  }).format(price);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const OrderCardItem: React.FC<OrderCardItemProps> = ({ order }) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-md transition-shadow duration-300 bg-white">
      <div className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        {/* --- Left Side: Product Info --- */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <img
            src={
              order.productId.image ||
              "https://placehold.co/100x100/E2E8F0/4A5568?text=No+Image"
            }
            alt={order.productId.productName}
            className="w-16 h-16 object-cover rounded-md border"
          />
          <div className="min-w-0">
            <p
              className="font-semibold text-gray-900 truncate cursor-pointer hover:text-blue-600"
              onClick={() => navigate(`/product/${order.productId._id}`)}
              title={order.productId.productName}
            >
              {order.productId.productName}
            </p>
            <p className="text-sm text-muted-foreground">
              Order #{order._id.slice(-6)} • {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        {/* --- Right Side: Status, Price & Actions (stacks on mobile) --- */}
        <div className="flex flex-col items-stretch sm:items-end gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-none">
          <p className="font-bold text-xl text-blue-500 text-left sm:text-right">
            {formatPrice(order.totalAmount)}
          </p>
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full">
            {/* --- [MODIFIED] Labeled Status Badges --- */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <p className="text-xs text-muted-foreground">Order:</p>
                <Badge className={getStatusClasses(order.orderStatus)}>
                  {order.orderStatus}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs text-muted-foreground">Payment:</p>
                <Badge className={getStatusClasses(order.paymentStatus)}>
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/order-tracking/${order._id}`)}
              className="flex-shrink-0"
            >
              <Eye className="h-4 w-4 mr-2" />
              Track Order
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
