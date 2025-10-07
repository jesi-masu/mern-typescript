// src/components/admin/orders/OrderCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { formatPrice } from "@/lib/formatters";
import { Eye, CreditCard, Calendar, MapPin, Package, User } from "lucide-react";

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
  onConfirmPayment: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onViewDetails,
  onConfirmPayment,
}) => {
  const getStatusClasses = (
    status: OrderStatus | PaymentStatus | undefined
  ): string => {
    const baseClasses = "font-semibold border-transparent text-xs px-2 py-1";
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const deliveryAddress = order.customerInfo?.deliveryAddress;
  const formattedAddress = deliveryAddress
    ? [
        deliveryAddress.street,
        deliveryAddress.subdivision,
        deliveryAddress.cityMunicipality,
        deliveryAddress.province,
      ]
        .filter(Boolean)
        .join(", ")
    : "No address provided";

  const currentPaymentStatus = order.paymentInfo?.paymentStatus || "Pending";

  const productNames =
    order.products?.map((item) => item.productId.productName).join(", ") ||
    "No products found";

  return (
    <Card className="flex flex-col justify-between rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-gray-800">
              Order #{order._id.slice(-6)}
            </h3>
            <p className="text-sm text-muted-foreground">Order ID</p>
          </div>
          <div className="text-right">
            <p className="font-extrabold text-xl text-green-600">
              {formatPrice(order.totalAmount)}
            </p>
            <p className="text-sm text-muted-foreground">Total Amount</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Order</p>
            <Badge className={getStatusClasses(order.orderStatus)}>
              {order.orderStatus}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Payment</p>
            <Badge className={getStatusClasses(currentPaymentStatus)}>
              {currentPaymentStatus}
            </Badge>
          </div>
        </div>

        <div className="border-t pt-4 space-y-3 text-sm">
          <div className="flex items-start">
            <Package className="h-4 w-4 mr-3 mt-1 flex-shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Product name(s)</p>
              <p className="font-medium text-gray-800">{productNames}</p>
            </div>
          </div>
          <div className="flex items-start">
            <User className="h-4 w-4 mr-3 mt-1 flex-shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Customer</p>
              <p className="font-medium text-gray-800">
                {order.customerInfo.firstName} {order.customerInfo.lastName}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <Calendar className="h-4 w-4 mr-3 mt-1 flex-shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Order placed</p>
              <p className="font-medium text-gray-800">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-3 mt-1 flex-shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Delivery address</p>
              <p className="font-medium text-gray-800" title={formattedAddress}>
                {formattedAddress}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <div className="bg-gray-50 p-4 flex gap-3 rounded-b-xl border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onViewDetails(order)}
        >
          <Eye className="h-4 w-4 mr-2" />
          Details
        </Button>
        {/* --- START: MODIFICATION --- */}
        {/* Removed the disabled prop from this button */}
        <Button
          size="sm"
          className="flex-1 bg-green-600 hover:bg-green-700"
          onClick={() => onConfirmPayment(order)}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Update Payment
        </Button>
        {/* --- END: MODIFICATION --- */}
      </div>
    </Card>
  );
};

export default OrderCard;
