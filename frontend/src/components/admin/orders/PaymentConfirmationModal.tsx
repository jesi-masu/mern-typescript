import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  const [notes, setNotes] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(null);
      setNotes("");
      setIsConfirming(false);
    }
  }, [isOpen]);

  if (!order) return null;

  const handleConfirm = () => {
    if (!selectedStatus) return;
    setIsConfirming(true);
    onConfirm(order._id, selectedStatus, notes);
    setIsConfirming(false);
    onClose();
  };

  // --- MODIFIED: Added "Pending Payment" to the array ---
  const paymentStages: PaymentStatus[] = [
    "Pending",
    "50% Complete Paid",
    "90% Complete Paid",
    "100% Complete Paid",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-green-600" />
            Confirm Payment Stage
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
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

          <div className="space-y-3 border-b pb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Order ID:</span>
              <span className="font-mono text-xs bg-gray-100 p-1 rounded">
                {order._id}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Amount:</span>
              <span className="font-bold text-lg text-green-600">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Current Status:</span>
              <Badge variant="secondary">{order.paymentStatus}</Badge>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">
              Select New Payment Stage
            </Label>
            <RadioGroup
              onValueChange={(value) =>
                setSelectedStatus(value as PaymentStatus)
              }
              className="space-y-2 mt-2"
            >
              {paymentStages.map((stage) => (
                <Label
                  key={stage}
                  className="flex items-center space-x-2 p-3 border rounded-md cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-300"
                >
                  <RadioGroupItem value={stage} id={stage} />
                  <span>{stage}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label
              htmlFor="notes"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add verification notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isConfirming}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedStatus || isConfirming}
              className="bg-green-600 hover:bg-green-700"
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentConfirmationModal;
