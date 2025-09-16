import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Order, OrderStatus } from "@/types/order";
import { formatPrice } from "@/lib/formatters";
import { Eye, CreditCard, Calendar, MapPin } from "lucide-react";

interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
  onViewDetails: (order: Order) => void;
  onConfirmPayment: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onViewDetails,
  onConfirmPayment,
}) => {
  const getOrderStatusColor = (status: OrderStatus): string => {
    const colorMap: Record<OrderStatus, string> = {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // --- NEW: Format the address for display ---
  // Safely access the nested delivery address from the customerInfo object.
  const deliveryAddress = order.customerInfo?.deliveryAddress;
  const formattedAddress = deliveryAddress
    ? `${deliveryAddress.street}, ${deliveryAddress.subdivision}, ${deliveryAddress.cityMunicipality}, ${deliveryAddress.province}`
    : "Address not available";

  return (
    <Card className="border rounded-lg hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-xs text-gray-900">
              Order ID #{order._id}
            </h3>
            <Badge className={getOrderStatusColor(order.orderStatus)}>
              {order.orderStatus}
            </Badge>
          </div>
          <div className="text-right">
            <p className="font-bold text-xl text-green-600">
              {formatPrice(order.totalAmount)}
            </p>
            <Badge
              variant={order.paymentStatus === "Paid" ? "default" : "secondary"}
            >
              {order.paymentStatus}
            </Badge>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-sm text-gray-500">Customer</p>
          <p className="text-sm text-gray-900">
            {order.userId.firstName} {order.userId.lastName}
          </p>
        </div>

        <div className="mb-3">
          <p className="text-sm text-gray-500">Product</p>
          <p className="text-sm text-gray-900">{order.productId.productName}</p>
        </div>

        {/* --- REVISED STRUCTURE for better readability --- */}
        <div className="mb-3">
          <p className="text-sm text-gray-500 flex items-center">
            <Calendar className="inline h-4 w-4 mr-2" />
            Order Date
          </p>
          <p className="text-sm text-gray-900 ml-6">
            {formatDate(order.createdAt)}
          </p>
        </div>

        {/* --- UPDATED: Delivery address is now displayed --- */}
        <div className="mb-3">
          <p className="text-sm text-gray-500 flex items-center">
            <MapPin className="inline h-4 w-4 mr-2" />
            Delivery Address
          </p>
          <p
            className="text-sm text-gray-900 ml-6 truncate"
            title={formattedAddress}
          >
            {formattedAddress}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(order)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>

          {order.paymentStatus !== "Paid" && (
            <Button
              size="sm"
              onClick={() => onConfirmPayment(order)}
              className="bg-green-600 hover:bg-green-700"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Confirm Payment
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
