import React, { useState, useEffect } from "react";
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
import { Order, OrderStatus, PaymentStatus, IProductPart } from "@/types";
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
  ListChecks,
  Camera,
  Puzzle,
  Loader2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator"; // ✏️ 2. IMPORT SEPARATOR

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
  onConfirmPayment: (order: Order) => void;
  isUpdating: boolean; // ✏️ 4. ADD THIS PROP
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
  isUpdating, // ✏️ 5. RECEIVE THE PROP
}) => {
  if (!order) return null;

  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const availableStages = order?.paymentInfo?.paymentReceipts
    ? Object.keys(order.paymentInfo.paymentReceipts)
    : [];

  useEffect(() => {
    if (isOpen) {
      if (availableStages.length > 0) {
        setSelectedStage(availableStages[0]);
      } else {
        setSelectedStage(null);
      }
    } else {
      setPreviewImage(null);
    }
  }, [order?._id, isOpen]);

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
      address.postalCode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const currentPaymentStatus = order.paymentInfo?.paymentStatus || "Pending";

  return (
    <>
      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-6xl p-2 bg-transparent border-none shadow-none">
          <img
            src={previewImage || ""}
            alt="Location Preview"
            className="w-full h-auto rounded-lg"
          />
        </DialogContent>
      </Dialog>

      {/* Main Order Details Modal */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              Order Details - #{order._id.slice(-6)}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-1">
            {/* Status Update Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 bg-gray-50 rounded-lg">
              {/* ... (Order Status Select) ... */}
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
                    disabled={isUpdating} // ✏️ 6. DISABLE WHILE UPDATING
                  >
                    <SelectTrigger className="w-full">
                      <div className="flex items-center gap-2">
                        {isUpdating && ( // ✏️ 7. SHOW SPINNER
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="In Production">
                        In Production
                      </SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* ... (Payment Status Badge and Button) ... */}
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
                      disabled={isUpdating} // ✏️ 8. DISABLE WHILE UPDATING
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Update Payment
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6 pt-4">
                {/* ... (Customer Info) ... */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-500" />
                    Customer Information
                  </h3>
                  <div className="text-sm">
                    <p className="text-base font-medium">
                      {order.customerInfo.deliveryAddress.firstName}{" "}
                      {order.customerInfo.deliveryAddress.lastName}
                    </p>
                    <p className="text-gray-600">{order.customerInfo.email}</p>
                    <div className="flex items-center gap-2 text-gray-600 pt-1">
                      <p>{order.customerInfo.deliveryAddress.phone}</p>
                    </div>
                  </div>
                </div>
                {/* ... (Delivery Address) ... */}
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
                      <strong>Notes/Landmark:</strong>{" "}
                      {order.customerInfo.deliveryAddress.additionalAddressLine}
                    </p>
                  )}
                </div>
                {/* ... (Order Timeline) ... */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    Order Timeline
                  </h3>
                  <p className="text-sm text-gray-500">
                    Ordered: {formatDate(order.createdAt)}
                  </p>
                </div>
                {/* ... (Payment Details) ... */}
                <div className="bg-gray-50/50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ListChecks className="h-5 w-5 text-gray-500" />
                    Payment Details
                  </h3>
                  <div className="text-sm bg-gray-50 space-y-2 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment Selection:</span>
                      <Badge variant="outline" className="capitalize text-xs">
                        {order.paymentInfo.paymentMethod}
                      </Badge>
                    </div>
                    {/* ... (This block will now refresh) ... */}
                    {order.paymentInfo.paymentMethod === "installment" &&
                      order.paymentInfo.installmentStage && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 pl-2">
                            ↳ Installment Stage:
                          </span>
                          <Badge
                            variant="secondary"
                            className="capitalize text-xs"
                          >
                            {order.paymentInfo.installmentStage.replace(
                              "_",
                              " "
                            )}
                          </Badge>
                        </div>
                      )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment Type:</span>
                      <Badge variant="outline" className="uppercase text-xs">
                        {order.paymentInfo.paymentMode}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment Timing:</span>
                      <Badge variant="outline" className="capitalize text-xs">
                        {order.paymentInfo.paymentTiming}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* ... (Total Amount) ... */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-gray-500 mb-1 flex items-center gap-2">
                    <CreditCardIcon className="h-5 w-5 text-gray-500" />
                    Total Order Amount
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
                {/* ... (Location Images) ... */}
                {order.locationImages && order.locationImages.length > 0 && (
                  <div className="px-4 pb-2">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Camera className="h-5 w-5 text-gray-500" />
                      Installation Location Images
                    </h3>
                    <div className="flex flex-wrap gap-2 rounded-lg bg-gray-50 p-3">
                      {order.locationImages.map((imageUrl, index) => (
                        <button
                          key={index}
                          onClick={() => setPreviewImage(imageUrl)}
                          className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
                        >
                          <img
                            src={imageUrl}
                            alt={`Location image ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-md border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {/* ... (Payment Receipts) ... */}
                {availableStages.length > 0 && (
                  <div className="px-4 pb-2">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Receipt className="h-5 w-5 text-gray-500" />
                      Uploaded Payment Receipts
                    </h3>
                    <Select
                      value={selectedStage || ""}
                      onValueChange={setSelectedStage}
                    >
                      <SelectTrigger className="w-full md:w-2/3">
                        <SelectValue placeholder="Select a payment stage to view" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStages.map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage
                              .replace("_", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedStage &&
                      order.paymentInfo.paymentReceipts?.[selectedStage] && (
                        <div className="mt-4 p-2 bg-gray-50 rounded-lg">
                          <div className="flex flex-wrap gap-2">
                            {order.paymentInfo.paymentReceipts[
                              selectedStage
                            ]!.map((receiptUrl, index) => (
                              <a
                                key={index}
                                href={receiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                              >
                                <img
                                  src={receiptUrl}
                                  alt={`Receipt ${
                                    index + 1
                                  } for ${selectedStage} stage`}
                                  className="w-20 h-20 object-cover rounded-md border-2 border-gray-200 hover:border-blue-500 transition-colors"
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>

            {/*  PRODUCT PARTS */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-gray-500" />
                <h3 className="font-semibold text-gray-900">
                  Ordered Products
                </h3>
              </div>
              <div className="space-y-4">
                {order.products.map((item) => (
                  <div
                    key={item.productId._id}
                    className="border rounded-lg bg-white overflow-hidden"
                  >
                    <div className="flex items-start gap-4 p-4">
                      <img
                        src={
                          item.productId.image ||
                          "https://placehold.co/150x150/E2E8F0/4A5568?text=No+Image"
                        }
                        alt={item.productId.productName || "Product"}
                        className="w-20 h-20 object-cover rounded border"
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
                            <p className="font-medium">
                              {item.productId.category || "N/A"}
                            </p>
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

                    {/* --- Display Product Parts --- */}
                    {item.productId.productParts &&
                      item.productId.productParts.length > 0 && (
                        <div className="bg-gray-50 p-3 border-t">
                          <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                            <Puzzle className="h-4 w-4 text-gray-500" />
                            Included Parts:
                          </h5>
                          <div className="space-y-2 pl-2 max-h-40 overflow-y-auto">
                            {item.productId.productParts.map(
                              (part, partIndex) => (
                                <div
                                  key={partIndex}
                                  className="flex items-center gap-2 text-xs"
                                >
                                  <img
                                    src={
                                      part.image ||
                                      "https://placehold.co/40x40/E2E8F0/4A5568?text=N/A"
                                    }
                                    alt={part.name}
                                    className="w-10 h-10 object-cover rounded border flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className="font-medium text-gray-800 truncate"
                                      title={part.name}
                                    >
                                      {part.name}
                                    </p>
                                    {part.description && (
                                      <p
                                        className="text-gray-500 truncate"
                                        title={part.description}
                                      >
                                        {part.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <p className="text-gray-600">
                                      Qty: {part.quantity}
                                    </p>
                                    {part.price && (
                                      <p className="font-medium text-gray-700">
                                        {formatPrice(part.price)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderDetailsModal;
