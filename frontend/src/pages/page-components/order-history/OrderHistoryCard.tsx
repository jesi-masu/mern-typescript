import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Package,
  CalendarDays,
  ClipboardList,
  CreditCard,
  ChevronDown,
  Hash,
  XCircle,
  Loader2,
  Phone,
} from "lucide-react";
import { Order, PaymentStatus } from "@/types/order";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { useCancelReservation } from "@/hooks/useUserOrders";

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
    currencyDisplay: "symbol",
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

  const { mutate: cancelReservation, isPending: isCancelling } =
    useCancelReservation();

  const displayProduct = order.products?.[0]?.productId;
  const currentPaymentStatus = order.paymentInfo?.paymentStatus || "Pending";

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel this reservation? This action cannot be undone."
      )
    ) {
      cancelReservation(order._id);
    }
  };

  if (!displayProduct) {
    return null;
  }

  return (
    <Card
      className={`overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white ${
        order.orderStatus === "Cancelled" ? "opacity-60 bg-gray-50" : ""
      }`}
    >
      <div className="bg-gray-50 p-2 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm font-medium text-gray-700">
              {formatDate(order.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Hash className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-gray-500">
              Order #{order._id.slice(-6)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <span className="text-sm text-muted-foreground">Total:</span>
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(order.totalAmount)}
          </span>
        </div>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="p-3 flex flex-col sm:flex-row justify-between items-start gap-3">
          <div className="flex items-start gap-3 flex-1">
            <img
              src={
                displayProduct.image ||
                "https://placehold.co/150x150/E2E8F0/4A5568?text=No+Image"
              }
              alt={displayProduct.productName}
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border"
            />
            <div className="space-y-1">
              <p className="font-semibold text-gray-900 leading-tight">
                {displayProduct.productName}
                {order.products.length > 1 && (
                  <span className="text-sm text-gray-500 font-normal ml-2">
                    (+{order.products.length - 1} more)
                  </span>
                )}
              </p>
              {displayProduct.productShortDescription && (
                <p
                  className="text-sm text-muted-foreground truncate"
                  title={displayProduct.productShortDescription}
                >
                  {displayProduct.productShortDescription}
                </p>
              )}
            </div>
          </div>

          {/* ✏️ 2. UPDATED THIS BLOCK TO INCLUDE THE NEW "CALL US" LINK */}
          <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
            {/* Status Badges */}
            <div className="flex items-center gap-2">
              <ClipboardList className="h-3.5 w-3.5 text-muted-foreground" />
              <Badge className={getStatusClasses(order.orderStatus)}>
                {order.orderStatus}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
              <Badge className={getStatusClasses(currentPaymentStatus)}>
                {currentPaymentStatus}
              </Badge>
            </div>

            {/* ✏️ 3. THIS IS THE NEW "CALL US" LINK */}
            {/* It only appears if the order is "Pending" */}
            {order.orderStatus === "Pending" && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600 sm:justify-end w-full">
                <Phone className="h-3 w-3" />
                <span>Waiting for verification. </span>
                <a
                  href="tel:09974358037" // Replace with your actual number
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Call us?
                </a>
              </div>
            )}
          </div>
        </div>

        {order.products.length > 1 && (
          <CollapsibleContent className="px-3 pb-3 space-y-3">
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
                  className="w-10 h-10 object-cover rounded border"
                />
                <div className="flex-grow min-w-0">
                  <p className="font-medium text-gray-700 truncate">
                    {item.productId.productName}
                  </p>
                  {item.productId.productShortDescription && (
                    <p
                      className="text-xs text-muted-foreground truncate"
                      title={item.productId.productShortDescription}
                    >
                      {item.productId.productShortDescription}
                    </p>
                  )}
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

        <div className="bg-gray-50 px-3 py-2 flex justify-between items-center gap-2 border-t">
          <div className="flex items-center gap-2">
            {order.products.length > 1 && (
              <CollapsibleTrigger asChild>
                <Button
                  variant="link"
                  size="sm"
                  className="text-blue-600 px-0 sm:px-3"
                >
                  {isOpen ? "Show Less" : "View All Items"}
                  <ChevronDown
                    className={`h-4 w-4 ml-1 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
            )}

            {order.orderStatus !== "Cancelled" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/product/${displayProduct._id}`)}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              >
                <Package className="h-4 w-4 mr-2" />
                View Product
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {order.orderStatus === "Pending" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancel}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Cancel Reservation
              </Button>
            )}

            {order.orderStatus === "Processing" && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                // This now navigates to the tracking page with a query and hash
                onClick={() =>
                  navigate(
                    `/order-tracking/${order._id}?action=pay#payment-stages`
                  )
                }
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Payment
              </Button>
            )}

            {!["Pending", "Cancelled"].includes(order.orderStatus) && (
              <Button
                size="sm"
                onClick={() => navigate(`/order-tracking/${order._id}`)}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                Track Order
              </Button>
            )}

            {order.orderStatus === "Cancelled" && (
              <span className="text-sm text-red-600 font-medium px-3">
                Reservation Cancelled
              </span>
            )}
          </div>
        </div>
      </Collapsible>
    </Card>
  );
};
