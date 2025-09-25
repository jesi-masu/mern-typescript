import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Package } from "lucide-react";
import { Order, PaymentStatus } from "@/types/order";

interface OrderHistoryCardProps {
  order: Order;
}

const getStatusClasses = (
  status: Order["orderStatus"] | PaymentStatus
): string => {
  const baseClasses = "font-semibold border-transparent text-xs px-2.5 py-1";
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
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(price);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const OrderHistoryCard: React.FC<OrderHistoryCardProps> = ({
  order,
}) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      {/* --- Main Info Section --- */}
      <div className="p-4 flex justify-between items-start gap-4">
        <div className="flex items-start gap-4">
          <img
            src={
              order.productId.image ||
              "https://placehold.co/100x100/E2E8F0/4A5568?text=No+Image"
            }
            alt={order.productId.productName}
            className="w-16 h-16 object-cover rounded-lg border"
          />
          <div className="space-y-2">
            <div>
              <p className="font-semibold text-gray-900 leading-tight">
                {order.productId.productName}
              </p>
              <p className="text-sm text-muted-foreground">
                Order #{order._id.slice(-6)} · {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex flex-col items-start gap-1.5">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-muted-foreground w-14">
                  Order:
                </p>
                <Badge className={getStatusClasses(order.orderStatus)}>
                  {order.orderStatus}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-muted-foreground w-14">
                  Payment:
                </p>
                <Badge className={getStatusClasses(order.paymentStatus)}>
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-800">
            {formatPrice(order.totalAmount)}
          </p>
        </div>
      </div>

      {/* --- Footer Actions Section --- */}
      <div className="p-2 flex justify-end items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/product/${order.productId._id}`)}
          className="text-gray-600 hover:text-gray-900"
        >
          <Package className="h-4 w-4 mr-2" />
          View Product
        </Button>
        <Button
          size="sm"
          onClick={() => navigate(`/order-tracking/${order._id}`)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <Eye className="h-4 w-4 mr-2" />
          Track Order
        </Button>
      </div>
    </Card>
  );
};
