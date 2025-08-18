
import React from 'react';
import { CheckCircle } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface CheckoutStepsProps {
  currentStep: number;
  steps: Step[];
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center space-x-4">
      {steps.map((step) => (
        <div
          key={step.number}
          className={`flex items-center space-x-2 ${
            step.number <= currentStep ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          {step.number < currentStep ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
                step.number === currentStep
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300'
              }`}
            >
              {step.number}
            </div>
          )}
          <div className="hidden sm:block">
            <p className="text-sm font-medium">{step.title}</p>
            <p className="text-xs text-gray-500">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CheckoutSteps;
