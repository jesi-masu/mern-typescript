// src/components/admin/orders/OrderDetailsModal.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { formatPrice } from "@/lib/formatters";
import {
  CreditCard,
  FileText,
  CreditCardIcon,
  Receipt,
  Package,
  User,
  Calendar,
  MapPin,
} from "lucide-react";

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
  onConfirmPayment: (order: Order) => void;
}

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

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onStatusUpdate,
  onConfirmPayment,
}) => {
  if (!order) return null;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatFullAddress = (
    address: Order["customerInfo"]["deliveryAddress"]
  ) => {
    if (!address) return "No address provided";
    return [
      address.street,
      address.subdivision,
      address.cityMunicipality,
      address.province,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const currentPaymentStatus = order.paymentInfo?.paymentStatus || "Pending";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            Order Details - #{order._id.slice(-6)}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Order Status
              </label>
              <div className="mt-1">
                <Select
                  value={order.orderStatus}
                  onValueChange={(value: OrderStatus) =>
                    onStatusUpdate(order._id, value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="In Production">In Production</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Payment Status
              </label>
              <div className="mt-1 flex items-center gap-2">
                <Badge className={getStatusClasses(currentPaymentStatus)}>
                  {currentPaymentStatus}
                </Badge>
                {currentPaymentStatus !== "100% Complete Paid" && (
                  <Button
                    size="sm"
                    onClick={() => onConfirmPayment(order)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Update Payment
                  </Button>
                )}
              </div>
            </div>
          </div>
          {/* --- START: MODIFICATION --- */}
          {/* Restructured layout with new placement for Timeline and Total Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Left Column */}
            <div className="space-y-6 pt-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500" />
                  Customer Information
                </h3>
                <div className="text-sm">
                  <p className="text-base font-medium">
                    {order.customerInfo.firstName} {order.customerInfo.lastName}
                  </p>
                  <p className="text-gray-600">{order.customerInfo.email}</p>
                  <div className="flex items-center gap-2 text-gray-600 pt-1">
                    <p>{order.customerInfo.phoneNumber}</p>
                  </div>
                </div>
              </div>

              {/* Order Timeline is now here */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  Order Timeline
                </h3>
                <p className="text-sm text-gray-500">
                  Ordered: {formatDate(order.createdAt)}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  Delivery Address
                </h3>
                <p className="text-sm text-gray-700">
                  {formatFullAddress(order.customerInfo.deliveryAddress)}
                </p>
                {order.customerInfo.deliveryAddress.additionalAddressLine && (
                  <p className="text-xs text-gray-500 mt-1">
                    <strong>Notes:</strong>{" "}
                    {order.customerInfo.deliveryAddress.additionalAddressLine}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Total Order Amount is now here */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-gray-500 mb-1 flex items-center gap-2">
                  <CreditCardIcon className="h-5 w-5 text-gray-500" />
                  Total Order Amount
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(order.totalAmount)}
                </p>
              </div>

              {order.paymentInfo.paymentReceipts &&
                order.paymentInfo.paymentReceipts.length > 0 && (
                  <div className="px-4 py-2">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Receipt className="h-5 w-5 text-gray-500" />
                      Uploaded Payment Receipts
                    </h3>
                    <div className="rounded-lg p-3 space-y-2 bg-white">
                      {order.paymentInfo.paymentReceipts.map(
                        (receiptUrl, index) => (
                          <a
                            key={index}
                            href={receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-600 hover:underline flex items-center gap-2"
                          >
                            View Receipt #{index + 1}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
          {/* --- END: MODIFICATION --- */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Ordered Products</h3>
            </div>
            <div className="space-y-3">
              {order.products.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 border rounded-lg bg-white"
                >
                  <img
                    src={
                      item.productId.image ||
                      "https://placehold.co/150x150/E2E8F0/4A5568?text=No+Image"
                    }
                    alt={item.productId.productName || "Product"}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-base">
                      {item.productId.productName}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      {item.productId.productShortDescription ||
                        "No description available."}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-xs">
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <p className="font-medium">{item.productId.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Area:</span>
                        <p className="font-medium">
                          {item.productId.squareFeet} sq ft
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Quantity:</span>
                        <p className="font-medium">{item.quantity}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Price:</span>
                        <p className="font-medium text-green-600">
                          {formatPrice(item.productId.productPrice || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Total Order Amount was removed from here */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
