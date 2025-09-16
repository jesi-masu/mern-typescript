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
import { Order, OrderStatus } from "@/types/order";
import { formatPrice } from "@/lib/formatters";
import { CreditCard, FileText } from "lucide-react";

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
  onConfirmPayment: (order: Order) => void;
}

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            Order Details - #{order._id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
                <Badge
                  variant={
                    order.paymentStatus === "Paid" ? "default" : "secondary"
                  }
                >
                  {order.paymentStatus}
                </Badge>
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Customer Information
              </h3>
              <p className="text-lg font-medium">
                {order.userId.firstName} {order.userId.lastName}
              </p>
              <p className="text-gray-600">{order.userId.email}</p>
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
              Product Details
            </h3>
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <img
                src={
                  order.productId.image ||
                  "https://placehold.co/400x300/E2E8F0/4A5568?text=No+Image"
                }
                alt={order.productId.productName}
                className="w-20 h-20 object-cover rounded border"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">
                  {order.productId.productName}
                </h4>
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
