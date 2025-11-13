import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone, LayoutDashboard, Loader2 } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center text-center">
            {/* 1. Icon */}
            <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />

            {/* 2. Title */}
            <DialogTitle className="text-2xl font-bold">
              Confirm Your Reservation?
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* 3. Critical Policy */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <p className="font-semibold text-yellow-900">Please Note:</p>
            <p className="text-yellow-800 text-sm">
              Once your initial payment is made after your item is validated,
              this reservation cannot be cancelled.
            </p>
          </div>

          {/* 4. "What's Next" Section */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">
              Here's What Happens Next:
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-prefab-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">
                  Our team will call you within 24 hours to validate your
                  reservation.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <LayoutDashboard className="h-5 w-5 text-prefab-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">
                  You can track your order's status at any time in your 'My
                  Orders' dashboard.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 5. Buttons */}
        <DialogFooter className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Go Back
          </Button>
          <Button
            type="button"
            className="bg-green-600 hover:bg-green-700"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Placing..." : "Confirm & Proceed"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
