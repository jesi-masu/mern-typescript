// src/pages/page-components/order-history/OrderHistoryCard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Package,
  Hash,
  CalendarDays,
  ClipboardList,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { Order, PaymentStatus } from "@/types/order";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

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
  const [isOpen, setIsOpen] = React.useState(false);

  const displayProduct = order.products?.[0]?.productId;
  const currentPaymentStatus = order.paymentInfo?.paymentStatus || "Pending";

  if (!displayProduct) {
    return null;
  }

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="p-4 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex items-start gap-4 flex-1">
            <img
              src={
                displayProduct.image ||
                "https://placehold.co/150x150/E2E8F0/4A5568?text=No+Image"
              }
              alt={displayProduct.productName}
              className="w-24 h-24 object-cover rounded-lg border"
            />
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-900 leading-tight">
                  {displayProduct.productName}
                  {order.products.length > 1 && (
                    <span className="text-sm text-gray-500 font-normal ml-2">
                      (+{order.products.length - 1} more)
                    </span>
                  )}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1.5">
                    <span>Order ID: #{order._id.slice(-6)}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{formatDate(order.createdAt)}</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground w-14">
                    Order:
                  </span>
                  <Badge className={getStatusClasses(order.orderStatus)}>
                    {order.orderStatus}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground w-14">
                    Payment:
                  </span>
                  <Badge className={getStatusClasses(currentPaymentStatus)}>
                    {currentPaymentStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right self-start sm:self-center">
            <p className="text-sm text-muted-foreground">Total Price</p>
            <p className="text-xl font-bold text-blue-600">
              {formatPrice(order.totalAmount)}
            </p>
          </div>
        </div>

        {/* --- START: MODIFICATION --- */}
        {/* This entire block will only render if there are multiple products */}
        {order.products.length > 1 && (
          <CollapsibleContent className="px-4 pb-4 space-y-4">
            <Separator />
            <h4 className="text-sm font-semibold text-gray-800">
              All Products in This Order
            </h4>
            {order.products.map((item) => (
              <div
                key={item.productId._id}
                className="flex items-center gap-3 text-sm"
              >
                <img
                  src={
                    item.productId.image ||
                    "https://placehold.co/100x100/E2E8F0/4A5568?text=N/A"
                  }
                  alt={item.productId.productName}
                  className="w-12 h-12 object-cover rounded border"
                />
                <div className="flex-grow">
                  <p className="font-medium text-gray-700">
                    {item.productId.productName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right font-medium text-gray-600">
                  {formatPrice(item.productId.productPrice * item.quantity)}
                </div>
              </div>
            ))}
          </CollapsibleContent>
        )}
        {/* --- END: MODIFICATION --- */}

        <div className="bg-gray-50 px-4 py-2 flex justify-between items-center gap-2 border-t">
          {/* --- START: MODIFICATION --- */}
          {/* This trigger button replaces the empty space when there are multiple products */}
          <div>
            {order.products.length > 1 && (
              <CollapsibleTrigger asChild>
                <Button variant="link" size="sm" className="text-blue-600">
                  {isOpen ? "Show Less" : "View All Items"}
                  <ChevronDown
                    className={`h-4 w-4 ml-1 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
            )}
          </div>
          {/* --- END: MODIFICATION --- */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/product/${displayProduct._id}`)}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-200"
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
        </div>
      </Collapsible>
    </Card>
  );
};
