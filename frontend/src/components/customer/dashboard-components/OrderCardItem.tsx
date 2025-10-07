// src/components/customer/dashboard-components/OrderCardItem.tsx

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ChevronDown } from "lucide-react";
import { Order, PaymentStatus } from "@/types/order";
import { useNavigate } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

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
  const [isOpen, setIsOpen] = React.useState(false);

  const displayProduct = order.products?.[0]?.productId;
  const currentPaymentStatus = order.paymentInfo?.paymentStatus || "Pending";

  if (!displayProduct) {
    return null;
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-300 bg-white">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          {/* --- Left Side: Product Info --- */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <img
              src={
                displayProduct.image ||
                "https://placehold.co/100x100/E2E8F0/4A5568?text=No+Image"
              }
              alt={displayProduct.productName}
              className="w-16 h-16 object-cover rounded-md border"
            />
            <div className="min-w-0">
              <p
                className="font-semibold text-gray-900 truncate cursor-pointer hover:text-blue-600"
                onClick={() => navigate(`/product/${displayProduct._id}`)}
                title={displayProduct.productName}
              >
                {displayProduct.productName}
              </p>
              <p className="text-sm text-muted-foreground">
                Order #{order._id.slice(-6)} • {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          {/* --- Right Side: Status, Price & Actions --- */}
          <div className="flex flex-col items-stretch sm:items-end gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-none">
            <p className="font-bold text-xl text-blue-500 text-left sm:text-right">
              {formatPrice(order.totalAmount)}
            </p>
            <div className="flex items-center justify-between sm:justify-end gap-2 w-full">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs text-muted-foreground">Order:</p>
                  <Badge className={getStatusClasses(order.orderStatus)}>
                    {order.orderStatus}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs text-muted-foreground">Payment:</p>
                  <Badge className={getStatusClasses(currentPaymentStatus)}>
                    {currentPaymentStatus}
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

        {order.products.length > 1 && (
          <>
            <CollapsibleContent className="px-4 pb-4 space-y-3">
              <Separator className="my-2" />
              <h4 className="text-sm font-semibold text-gray-800">
                All Products in This Order
              </h4>
              {/* --- START: MODIFICATION (1/2) --- */}
              {/* Added price to the list of products */}
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
                    className="w-10 h-10 object-cover rounded border"
                  />
                  <div className="flex-grow">
                    <p className="font-medium text-gray-700 truncate">
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
              {/* --- END: MODIFICATION (1/2) --- */}
            </CollapsibleContent>

            <div className="bg-gray-50 p-2 border-t text-center">
              <CollapsibleTrigger asChild>
                {/* --- START: MODIFICATION (2/2) --- */}
                {/* Made the button smaller by adjusting padding and text size */}
                <Button
                  variant="ghost"
                  className="w-full text-blue-600 h-auto py-1.5 text-xs"
                >
                  {isOpen
                    ? "Show Less"
                    : `Show ${order.products.length - 1} More Item(s)`}
                  <ChevronDown
                    className={`h-4 w-4 ml-2 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>
                {/* --- END: MODIFICATION (2/2) --- */}
              </CollapsibleTrigger>
            </div>
          </>
        )}
      </Collapsible>
    </Card>
  );
};
