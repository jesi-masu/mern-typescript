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
// ✏️ 1. IMPORT A 'Check' ICON FOR THE BULLETS
import { User, FileCheck, PenSquare, ChevronRight } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void; // This is the function we call on "OK"
};

// ✏️ 2. UPDATED THE STEPS CONSTANT
const STEPS = [
  {
    step: 1,
    title: "Your Information",
    description: [
      "Fill in your personal contact and delivery address details.",
    ],
    icon: <User className="h-10 w-10 text-prefab-600" />,
  },
  {
    step: 2,
    title: "Uploads & Payment",
    // Changed from a string to an array of strings
    description: [
      "Select your payment method (Full or Installment).",
      "Choose when would you like to pay. ",
      "Upload your proof of payment (e.g., bank receipt).",
      "Fill up the required information (Recepient & Delivery Address).",
      "Provide photos of your installation site.",
    ],
    icon: <FileCheck className="h-10 w-10 text-prefab-600" />,
  },
  {
    step: 3,
    title: "Review & Finalize",
    description: [
      "Review the final order details and  the Terms & Conditions .",
      "After placing a reservation, expect calls from our Customer Service for your item validation within 24 hours",
    ],
    icon: <PenSquare className="h-10 w-10 text-prefab-600" />,
  },
];

const InstructionalModal = ({ isOpen, onClose }: Props) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = STEPS.length;
  const activeStepData = STEPS[currentStep - 1];

  // Reset to step 1 every time the modal becomes visible
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
          // Prevent closing by clicking overlay
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {/* I saw you changed this, nice! */}
            Take a moment before you proceed
          </DialogTitle>
          <DialogDescription>
            Here's a quick guide to our 3-step reservation process.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 pt-2">
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStep}/{totalSteps}
          </span>
          <Progress
            value={(currentStep / totalSteps) * 100}
            className="w-full"
          />
        </div>

        {/* ✏️ 3. UPDATED STEP CONTENT SECTION */}
        {/* Increased min-h to comfortably fit the new list */}
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

                {/* This logic now checks if the description is an array.
                  If true, it renders a list. If false, it renders a paragraph.
                */}
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
            // Show "Next" button
            <Button onClick={handleNext} className="w-full">
              Next
            </Button>
          ) : (
            // Show "OK, Got It!" button on the last step
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
