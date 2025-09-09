import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // ADDED: Import loader icon

interface CheckoutNavigationProps {
  currentStep: number;
  totalSteps: number;
  isStepValid: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean; // ADDED: Prop to track submission state
}

const CheckoutNavigation: React.FC<CheckoutNavigationProps> = ({
  currentStep,
  totalSteps,
  isStepValid,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting, // ADDED: Destructure the new prop
}) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
      >
        Previous
      </Button>
      {currentStep < totalSteps ? (
        <Button onClick={onNext} disabled={!isStepValid}>
          Next Step
        </Button>
      ) : (
        // UPDATED: Added loading state to the submit button
        <Button
          onClick={onSubmit}
          disabled={!isStepValid || isSubmitting}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </Button>
      )}
    </div>
  );
};

export default CheckoutNavigation;
