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
import { CreditCard, FileText, Phone, Receipt } from "lucide-react"; // --- MODIFICATION: Added Phone and Receipt icons ---
import { Separator } from "@/components/ui/separator";

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

  const currentPaymentStatus = order.paymentInfo?.paymentStatus || "Pending";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            Order Details - #{order._id}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Customer Information
              </h3>
              <div className="space-y-1">
                <p className="text-lg font-medium">
                  {order.customerInfo.firstName} {order.customerInfo.lastName}
                </p>
                <p className="text-gray-600">{order.customerInfo.email}</p>
                {/* --- START: MODIFICATION --- */}
                {/* Added the client's phone number */}
                <div className="flex items-center gap-2 text-gray-600 pt-1">
                  <Phone className="h-4 w-4" />
                  <p>{order.customerInfo.phoneNumber}</p>
                </div>
                {/* --- END: MODIFICATION --- */}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Order Timeline
              </h3>
              <p className="text-sm">Ordered: {formatDate(order.createdAt)}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Products ({order.products.length})
            </h3>
            <div className="space-y-4 border rounded-lg p-4">
              {order.products.map((item, index) => (
                <React.Fragment key={item.productId._id}>
                  <div className="flex items-start gap-4">
                    {/* --- START: MODIFICATION --- */}
                    {/* Added smaller product image */}
                    <img
                      src={
                        item.productId.image ||
                        "https://placehold.co/100x100/E2E8F0/4A5568?text=No+Image"
                      }
                      alt={item.productId.productName}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    {/* --- END: MODIFICATION --- */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {item.productId.productName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      <p className="font-semibold text-gray-700">
                        {formatPrice(item.productId.productPrice)} each
                      </p>
                    </div>
                  </div>
                  {index < order.products.length - 1 && <Separator />}
                </React.Fragment>
              ))}
              <div className="border-t pt-2 mt-2 text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* --- START: MODIFICATION --- */}
          {/* Added section for uploaded payment receipts */}
          {order.paymentInfo.paymentReceipts &&
            order.paymentInfo.paymentReceipts.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Uploaded Payment Receipts
                </h3>
                <div className="border rounded-lg p-4 space-y-2">
                  {order.paymentInfo.paymentReceipts.map(
                    (receiptUrl, index) => (
                      <a
                        key={index}
                        href={receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-2"
                      >
                        View Receipt #{index + 1}
                      </a>
                    )
                  )}
                </div>
              </div>
            )}
          {/* --- END: MODIFICATION --- */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
