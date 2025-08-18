
import React from 'react';
import { Button } from "@/components/ui/button";

interface CheckoutNavigationProps {
  currentStep: number;
  totalSteps: number;
  isStepValid: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const CheckoutNavigation: React.FC<CheckoutNavigationProps> = ({
  currentStep,
  totalSteps,
  isStepValid,
  onPrevious,
  onNext,
  onSubmit
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
        <Button
          onClick={onNext}
          disabled={!isStepValid}
        >
          Next Step
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          disabled={!isStepValid}
          className="bg-green-600 hover:bg-green-700"
        >
          Place Order
        </Button>
      )}
    </div>
  );
};

export default CheckoutNavigation;
