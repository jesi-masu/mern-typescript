import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Phone, LayoutDashboard } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void; // This function will navigate the user
};

const ReservationSuccessModal = ({ isOpen, onClose }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center text-center">
            {/* 1. Icon */}
            <CheckCircle className="h-16 w-16 text-green-600 mb-4" />

            {/* 2. Title */}
            <DialogTitle className="text-2xl font-bold">
              Reservation Placed!
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-4 text-center space-y-5">
          <p className="text-muted-foreground">
            Thank you. Your reservation has been successfully submitted.
          </p>

          {/* 3. "What's Next" Section */}
          <div className="text-left bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">
              What Happens Next:
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-prefab-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">
                  Our team will call you within 24 hours to validate your
                  reservation details.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <LayoutDashboard className="h-5 w-5 text-prefab-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">
                  You can track your order's status in your 'My Orders'
                  dashboard.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 5. Buttons */}
        <DialogFooter>
          <Button
            type="button"
            className="w-full bg-prefab-600 hover:bg-prefab-700"
            onClick={onClose}
          >
            OK, Got It!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationSuccessModal;
