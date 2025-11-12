import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CheckoutNavigationProps {
  currentStep: number;
  totalSteps: number;
  isStepValid: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void; // This will now trigger the modal
  isSubmitting: boolean;
}

const CheckoutNavigation: React.FC<CheckoutNavigationProps> = ({
  currentStep,
  totalSteps,
  isStepValid,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1 || isSubmitting}
      >
        Previous
      </Button>
      {currentStep < totalSteps ? (
        <Button onClick={onNext} disabled={!isStepValid || isSubmitting}>
          Next Step
        </Button>
      ) : (
        <Button
          onClick={onSubmit} // This now calls `handleTriggerSubmit` in the parent
          disabled={!isStepValid || isSubmitting}
          className="bg-green-600 hover:bg-green-700"
        >
          {/* ✏️ 1. CHANGED TEXT */}
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Placing..." : "Place Reservation"}
        </Button>
      )}
    </div>
  );
};

export default CheckoutNavigation;
