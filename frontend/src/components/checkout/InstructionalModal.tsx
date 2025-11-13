import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, FileCheck, PenSquare, ChevronRight } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};
const STEPS = [
  {
    step: 1,
    title: "Contact & Delivery", // <-- Changed from "Your Information"
    description: [
      "Provide your contact details.",
      "Confirm the delivery address and recipient information.", // <-- Consolidated all "address" info here.
    ],
    icon: <User className="h-10 w-10 text-prefab-600" />,
  },
  {
    step: 2,
    title: "Payment & Uploads", // <-- Clearer title
    description: [
      "Select your payment plan (Full or Installment).",
      "Choose your preferred payment schedule.", // <-- Clearer action
      "Upload your proof of payment (e.g., bank receipt).",
      "Upload required photos of your installation site.",
      // <-- REMOVED the redundant "Recipient & Delivery Address" item
    ],
    icon: <FileCheck className="h-10 w-10 text-prefab-600" />,
  },
  {
    step: 3,
    title: "Review & Confirm", // <-- More active title
    description: [
      "Do a final review of your complete order summary.",
      "Read and accept the Terms & Conditions.",
      "Click 'Place Reservation' to submit.", // <-- Clarifies the final action
      // <-- REMOVED the "24-hour call" message. It's better in the *next* modal.
    ],
    icon: <PenSquare className="h-10 w-10 text-prefab-600" />,
  },
];
const InstructionalModal = ({ isOpen, onClose }: Props) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = STEPS.length;
  const activeStepData = STEPS[currentStep - 1];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="sm:max-w-[480px]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">
            How Our Reservation Process Works
          </DialogTitle>
          <DialogDescription>
            Here’s a quick guide on what to expect.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 pt-2">
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStep}/{totalSteps}
          </span>
          <Progress
            value={(currentStep / totalSteps) * 100}
            className="w-full"
          />
        </div>

        <div className="py-6 min-h-[210px]">
          {activeStepData && (
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 p-3 bg-prefab-50 rounded-full">
                {activeStepData.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">
                  {activeStepData.title}
                </h3>

                {Array.isArray(activeStepData.description) ? (
                  <ul className="space-y-2.5">
                    {activeStepData.description.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <ChevronRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">
                    {activeStepData.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {currentStep < totalSteps ? (
            <Button onClick={handleNext} className="w-full">
              Next
            </Button>
          ) : (
            <Button
              onClick={onClose}
              className="w-full bg-prefab-600 hover:bg-prefab-700"
            >
              OK, Got It!
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionalModal;
