import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import {
  CheckCircle,
  CreditCard,
  Calendar,
  Wallet,
  Landmark,
  FileText,
  Smartphone,
  AlertCircle,
  Clock,
  Send,
  Hourglass,
} from "lucide-react";
import { formatPrice } from "../../lib/formatters";

type PaymentMode = "cash" | "bank" | "cheque" | "gcash" | "";
type PaymentPlan = "installment" | "full" | "";
type InstallmentStage = "initial" | "pre_delivery" | "final" | "";
type PaymentTiming = "now" | "later" | "";

interface PaymentSelectorProps {
  totalAmount: number;
  paymentMethod: PaymentPlan;
  onPaymentMethodChange: (method: PaymentPlan) => void;
  installmentStage: InstallmentStage;
  onInstallmentStageChange: (stage: InstallmentStage) => void;
  paymentMode: PaymentMode;
  onPaymentModeChange: (mode: PaymentMode) => void;
  paymentTiming: PaymentTiming;
  onPaymentTimingChange: (timing: PaymentTiming) => void;
}

const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  totalAmount,
  paymentMethod,
  onPaymentMethodChange,
  installmentStage,
  onInstallmentStageChange,
  paymentMode,
  onPaymentModeChange,
  paymentTiming,
  onPaymentTimingChange,
}) => {
  const initialPayment = Math.round(totalAmount * 0.5);
  const preDeliveryPayment = Math.round(totalAmount * 0.4);
  const finalPayment = totalAmount - initialPayment - preDeliveryPayment;

  const paymentOptions = [
    { value: "cash" as PaymentMode, label: "Cash", icon: Wallet },
    { value: "bank" as PaymentMode, label: "Bank Transfer", icon: Landmark },
    { value: "cheque" as PaymentMode, label: "Cheque", icon: FileText },
    { value: "gcash" as PaymentMode, label: "GCash", icon: Smartphone },
  ];

  const stages = [
    {
      id: "initial" as InstallmentStage,
      title: "Initial Payment (50% Completion)",
      amount: initialPayment,
      description: "Required to commence the project",
      icon: AlertCircle,
      color: "blue",
    },
    {
      id: "pre_delivery" as InstallmentStage,
      title: "Pre-Delivery Payment (90% Completion)",
      amount: preDeliveryPayment,
      description: "Due before scheduled delivery",
      icon: Clock,
      color: "orange",
    },
    {
      id: "final" as InstallmentStage,
      title: "Final Payment (100% Completion)",
      amount: finalPayment,
      description: "Due upon successful completion",
      icon: CheckCircle,
      color: "green",
    },
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Selection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Label
            htmlFor="installment"
            className={`block p-4 border rounded-lg cursor-pointer transition-all ${
              paymentMethod === "installment"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => onPaymentMethodChange("installment")}
          >
            <div className="flex-1">
              <div className="text-base font-medium mb-2">Installment Plan</div>
              <div className="p-4 bg-white rounded-lg border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">
                      Initial Payment (50%)
                    </span>
                  </div>
                  <span className="font-semibold text-blue-700">
                    {formatPrice(initialPayment)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">
                      Pre-Delivery Payment (40%)
                    </span>
                  </div>
                  <span className="font-semibold text-blue-700">
                    {formatPrice(preDeliveryPayment)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">
                      Final Payment (10%)
                    </span>
                  </div>
                  <span className="font-semibold text-blue-700">
                    {formatPrice(finalPayment)}
                  </span>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Flexible payment schedule to accommodate your budget
                </p>
              </div>

              {paymentMethod === "installment" && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <h4 className="font-medium mb-3">Payment Stages</h4>
                  <RadioGroup
                    value={installmentStage}
                    onValueChange={(val) =>
                      onInstallmentStageChange(val as InstallmentStage)
                    }
                    className="space-y-3"
                  >
                    {stages.map((stage) => {
                      const isDisabled = stage.id !== "initial";
                      return (
                        <Label
                          key={stage.id}
                          htmlFor={stage.id}
                          className={`flex items-center p-3 rounded-lg border-2 transition-colors ${
                            installmentStage === stage.id
                              ? `border-${stage.color}-400 bg-${stage.color}-50`
                              : "border-gray-200 bg-white"
                          } ${
                            isDisabled
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          <RadioGroupItem
                            value={stage.id}
                            id={stage.id}
                            className="mr-3"
                            disabled={isDisabled}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{stage.title}</span>
                              <span
                                className={`font-bold text-${stage.color}-700`}
                              >
                                {formatPrice(stage.amount)}
                              </span>
                            </div>
                            <p
                              className={`text-xs text-${stage.color}-600 mt-1`}
                            >
                              {stage.description}
                            </p>
                          </div>
                        </Label>
                      );
                    })}
                  </RadioGroup>
                </div>
              )}
            </div>
          </Label>

          <Label
            htmlFor="full"
            className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
              paymentMethod === "full"
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => onPaymentMethodChange("full")}
          >
            <div className="flex-1">
              <div className="text-base font-medium mb-2">
                Full Payment (100% Upfront)
              </div>
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">
                      Complete Payment
                      <p className="text-xs text-green-600">
                        Settle the entire amount - no additional payments
                        required
                      </p>
                    </span>
                  </div>
                  <span className="font-bold text-green-700">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </Label>
        </div>

        {paymentMethod && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-base font-medium mb-4">Choose Payment Type</h3>
            <RadioGroup
              value={paymentMode}
              onValueChange={(val) => onPaymentModeChange(val as PaymentMode)}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {paymentOptions.map((option) => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className={`relative flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMode === option.value
                      ? "bg-blue-50 border-blue-400"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {paymentMode === option.value && (
                    <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-blue-600 fill-white" />
                  )}
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="sr-only"
                  />
                  <option.icon className="h-6 w-6 mb-2 text-blue-600" />
                  <span className="text-sm font-medium">{option.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
        )}

        {paymentMethod && paymentMode && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-base font-medium mb-4">
              When would you like to pay?
            </h3>
            <RadioGroup
              value={paymentTiming}
              onValueChange={(val) =>
                onPaymentTimingChange(val as PaymentTiming)
              }
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <Label
                htmlFor="pay-now"
                className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentTiming === "now"
                    ? "bg-blue-50 border-blue-400"
                    : "hover:bg-gray-50"
                }`}
              >
                {paymentTiming === "now" && (
                  <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-blue-600 fill-white" />
                )}
                <RadioGroupItem value="now" id="pay-now" className="sr-only" />
                <Send className="h-6 w-6 mr-4 text-blue-600" />
                <div>
                  <span className="font-medium">Pay Now</span>
                  <p className="text-sm text-gray-600">
                    Upload your payment receipt to proceed.
                  </p>
                </div>
              </Label>
              <Label
                htmlFor="pay-later"
                className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentTiming === "later"
                    ? "bg-blue-50 border-blue-400"
                    : "hover:bg-gray-50"
                }`}
              >
                {paymentTiming === "later" && (
                  <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-blue-600 fill-white" />
                )}
                <RadioGroupItem
                  value="later"
                  id="pay-later"
                  className="sr-only"
                />
                <Hourglass className="h-6 w-6 mr-4 text-blue-600" />
                <div>
                  <span className="font-medium">Pay Later</span>
                  <p className="text-sm text-gray-600">
                    Submit your order now and pay later.
                  </p>
                </div>
              </Label>
            </RadioGroup>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentSelector;
