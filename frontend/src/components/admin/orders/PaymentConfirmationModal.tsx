// src/components/admin/PaymentConfirmationModal.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Order, PaymentStatus } from "@/types/order";
import { formatPrice } from "@/lib/formatters";
import { CreditCard, AlertTriangle, CheckCircle } from "lucide-react";

interface PaymentConfirmationModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    orderId: string,
    newStatus: PaymentStatus,
    notes?: string
  ) => void;
}

const PaymentConfirmationModal: React.FC<PaymentConfirmationModalProps> = ({
  order,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | null>(
    null
  );
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(null);
      setIsConfirming(false);
    }
  }, [isOpen]);

  const getPaymentStatusClasses = (status: PaymentStatus): string => {
    const baseClasses = "font-semibold border-transparent text-xs px-2 py-1";
    switch (status) {
      case "Pending":
        return `bg-yellow-100 text-yellow-800 ${baseClasses}`;
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

  if (!order) return null;

  const handleConfirm = () => {
    if (!selectedStatus) return;
    setIsConfirming(true);
    // Using a short timeout to give feedback to the user
    setTimeout(() => {
      onConfirm(order._id, selectedStatus);
      setIsConfirming(false);
      onClose();
    }, 500);
  };

  const paymentStages: PaymentStatus[] = [
    "Pending",
    "50% Complete Paid",
    "90% Complete Paid",
    "100% Complete Paid",
  ];

  // --- START: MODIFICATIONS ---
  const currentPaymentStatus = order.paymentInfo?.paymentStatus;
  const productNames =
    order.products?.map((item) => item.productId.productName).join(", ") ||
    "N/A";
  // --- END: MODIFICATIONS ---

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <CreditCard className="h-6 w-6 text-green-600" />
            Confirm Payment Stage
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto pr-6 space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-yellow-800">
                  Payment Verification
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Please verify the payment before confirming the new stage.
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 border-y py-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Order ID:</span>
              <span className="font-mono text-sm font-bold bg-gray-100 py-1 px-2 rounded">
                #{order._id.slice(-6)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Customer:</span>
              <span className="font-medium text-gray-800 text-sm">
                {order.customerInfo.firstName} {order.customerInfo.lastName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Product(s):</span>
              <span className="font-medium text-gray-800 text-sm text-right truncate max-w-[200px]">
                {/* --- MODIFICATION: Use productNames --- */}
                {productNames}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Total Amount:
              </span>
              <span className="font-bold text-lg text-green-600">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Current Payment Status:
              </span>
              {/* --- MODIFICATION: Use currentPaymentStatus --- */}
              <Badge className={getPaymentStatusClasses(currentPaymentStatus)}>
                {currentPaymentStatus}
              </Badge>
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">
              Select New Payment Stage
            </Label>
            <RadioGroup
              onValueChange={(value) =>
                setSelectedStatus(value as PaymentStatus)
              }
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3"
            >
              {paymentStages.map((stage) => (
                <Label
                  key={stage}
                  className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400 has-[:checked]:shadow-sm transition-all"
                >
                  <RadioGroupItem value={stage} id={stage} />
                  <Badge className={getPaymentStatusClasses(stage)}>
                    {stage}
                  </Badge>
                </Label>
              ))}
            </RadioGroup>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-green-800">After confirmation:</p>
              <ul className="text-green-700 mt-1 space-y-1">
                <li>• Payment status will be updated</li>
                <li>• Customer will be notified automatically</li>
                <li>• Order will proceed to next stage</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isConfirming}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedStatus || isConfirming}
            className="bg-green-600 hover:bg-green-700 min-w-[140px]"
          >
            {isConfirming ? (
              "Confirming..."
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Payment
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentConfirmationModal;
