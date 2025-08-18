import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/data/orders';
import { formatPrice } from '@/lib/formatters';
import { 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  FileText 
} from 'lucide-react';

interface PaymentConfirmationModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (order: Order, notes?: string) => void;
}

const PaymentConfirmationModal: React.FC<PaymentConfirmationModalProps> = ({
  order,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [notes, setNotes] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  if (!order) return null;

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm(order, notes);
      setNotes('');
      onClose();
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-green-600" />
            Confirm Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Payment Verification</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Please confirm that you have verified the payment for this order before proceeding.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Order ID:</span>
              <span className="font-medium">{order.id}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Customer:</span>
              <span className="font-medium">{order.customerName}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Amount:</span>
              <span className="font-bold text-green-600">{formatPrice(order.totalAmount)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Current Status:</span>
              <Badge variant="secondary">{order.paymentStatus}</Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Payment Verification Notes (Optional)
            </label>
            <Textarea
              placeholder="Add any notes about the payment verification..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-green-800">After confirmation:</p>
              <ul className="text-green-700 mt-1 space-y-1">
                <li>• Payment status will be changed to "Confirmed"</li>
                <li>• Customer will be notified automatically</li>
                <li>• Order will proceed to next stage</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={isConfirming}
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