import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, Percent, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { PaymentUpload } from "@/components/customer/PaymentUpload";
import { OrderDetail, PaymentStatus } from "@/types/order";
import { Separator } from "../ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
interface PaymentStatusCardProps {
  order: OrderDetail;
}
const paymentStatusSteps = [
  { key: "Pending", label: "Pending", icon: Wallet },
  { key: "50% Complete Paid", label: "50% Paid", icon: Percent },
  { key: "90% Complete Paid", label: "90% Paid", icon: Percent },
  { key: "100% Complete Paid", label: "Fully Paid", icon: CheckCircle },
];
const getPaymentStatusColor = (status: PaymentStatus) => {
  const colorMap: Record<PaymentStatus, string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    "50% Complete Paid": "bg-blue-100 text-blue-800",
    "90% Complete Paid": "bg-indigo-100 text-indigo-800",
    "100% Complete Paid": "bg-green-100 text-green-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
};
const getPaymentDetails = (
  status: PaymentStatus,
  totalAmount: number
): { remainingAmount: number; percentage: number } => {
  let percentage = 0;
  if (status === "50% Complete Paid") percentage = 50;
  else if (status === "90% Complete Paid") percentage = 90;
  else if (status === "100% Complete Paid") percentage = 100;
  const paidAmount = (totalAmount * percentage) / 100;
  const remainingAmount = totalAmount - paidAmount;
  return { remainingAmount, percentage };
};
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(price);
};
export const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({
  order,
}) => {
  const currentStatus = order.paymentInfo?.paymentStatus || "Pending";
  const currentPaymentStatusIndex = paymentStatusSteps.findIndex(
    (step) => step.key === currentStatus
  );
  const { remainingAmount, percentage } = getPaymentDetails(
    currentStatus,
    order.totalAmount
  );
  const initialPayment = Math.round(order.totalAmount * 0.5);
  const preDeliveryPayment = Math.round(order.totalAmount * 0.4);
  const finalPayment = order.totalAmount - initialPayment - preDeliveryPayment;
  const paymentStages = [
    {
      id: "50% Complete Paid",
      stageKey: "initial" as const,
      title: "Initial Payment (50%)",
      amount: initialPayment,
      description: "Required to commence the project",
      icon: AlertCircle,
      styles: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        borderActive: "border-blue-400 ring-1 ring-blue-300",
        borderCompleted: "border-blue-300",
        text: "text-blue-600",
        textAmount: "text-blue-700",
        overlayBg: "bg-blue-200/60",
        overlayIcon: "text-blue-600",
      },
    },
    {
      id: "90% Complete Paid",
      stageKey: "pre_delivery" as const,
      title: "Pre-Delivery Payment (40%)",
      amount: preDeliveryPayment,
      description: "Due before scheduled delivery",
      icon: Clock,
      styles: {
        bg: "bg-orange-50",
        border: "border-orange-200",
        borderActive: "border-orange-400 ring-1 ring-orange-300",
        borderCompleted: "border-orange-300",
        text: "text-orange-600",
        textAmount: "text-orange-700",
        overlayBg: "bg-orange-200/60",
        overlayIcon: "text-orange-600",
      },
    },
    {
      id: "100% Complete Paid",
      stageKey: "final" as const,
      title: "Final Payment (10%)",
      amount: finalPayment,
      description: "Due upon successful completion",
      icon: CheckCircle,
      styles: {
        bg: "bg-green-50",
        border: "border-green-200",
        borderActive: "border-green-400 ring-1 ring-green-300",
        borderCompleted: "border-green-300",
        text: "text-green-600",
        textAmount: "text-green-700",
        overlayBg: "bg-green-200/60",
        overlayIcon: "text-green-600",
      },
    },
  ];
  const getCurrentStageIndex = () => {
    if (currentStatus === "100% Complete Paid") return 2;
    if (currentStatus === "90% Complete Paid") return 1;
    if (currentStatus === "50% Complete Paid") return 0;
    return -1;
  };
  const currentStageIndex = getCurrentStageIndex();
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Payment Status</CardTitle>
          <Badge className={getPaymentStatusColor(currentStatus)}>
            {currentStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center pt-4">
            {paymentStatusSteps.map((step, index) => {
              const isCompleted = index <= currentPaymentStatusIndex;
              const isCurrent = index === currentPaymentStatusIndex;
              const Icon = step.icon;
              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center text-center w-1/4"
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 mb-2 ${
                      isCurrent
                        ? "bg-blue-100 border-blue-500 text-blue-600"
                        : isCompleted
                        ? "bg-green-100 border-green-500 text-green-600"
                        : "bg-gray-100 border-gray-300 text-gray-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p
                    className={`text-xs font-medium ${
                      isCompleted ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Payment Progress:</span>
              <span className="font-semibold text-blue-600">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-2" />
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Remaining Balance:</span>
              <span className="font-semibold text-red-600">
                {formatPrice(remainingAmount)}
              </span>
            </div>
          </div>
          {order.paymentInfo?.paymentMethod === "installment" && (
            <div className="space-y-4 pt-4">
              <Separator />
              <h4 className="font-semibold text-gray-800">Payment Stages</h4>
              <div className="space-y-3">
                {paymentStages.map((stage, index) => {
                  const isCompleted = index <= currentStageIndex;
                  const isNextPayable = index === currentStageIndex + 1;
                  const isFutureStage = index > currentStageIndex + 1;
                  const isClickable = isNextPayable;
                  const Icon = stage.icon;
                  return (
                    <Collapsible key={stage.id} disabled={!isClickable}>
                      <CollapsibleTrigger asChild disabled={!isClickable}>
                        <div
                          className={`relative overflow-hidden p-3 rounded-lg border-2 flex items-start gap-3 transition-all ${
                            stage.styles.bg
                          } ${
                            isFutureStage
                              ? "border-gray-200 opacity-60 cursor-not-allowed"
                              : isNextPayable
                              ? `${stage.styles.borderActive} cursor-pointer`
                              : `${stage.styles.borderCompleted}`
                          }`}
                        >
                          {isCompleted && (
                            <div
                              className={`absolute inset-0 ${stage.styles.overlayBg} flex items-center justify-center rounded-lg z-10`}
                            >
                              <CheckCircle
                                className={`h-8 w-8 ${stage.styles.overlayIcon} opacity-70`}
                              />
                            </div>
                          )}
                          <Icon
                            className={`h-5 w-5 mt-0.5 flex-shrink-0 ${stage.styles.text}`}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <p className="font-medium text-sm">
                                {stage.title}
                              </p>
                              <p
                                className={`font-bold text-sm ${stage.styles.textAmount}`}
                              >
                                {formatPrice(stage.amount)}
                              </p>
                            </div>
                            <p className={`text-xs mt-1 ${stage.styles.text}`}>
                              {stage.description}
                            </p>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        {/* --- MODIFICATION: Use p-3 for slightly more space --- */}
                        <div className="p-3 border-x-2 border-b-2 rounded-b-lg -mt-1 border-gray-200">
                          <PaymentUpload
                            orderId={order._id}
                            paymentStage={stage.stageKey}
                            isDisabled={!isClickable}
                          />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </div>
          )}
          {currentStatus !== "100% Complete Paid" &&
            order.paymentInfo?.paymentMethod === "full" && (
              <PaymentUpload orderId={order._id} />
            )}
        </div>
      </CardContent>
    </Card>
  );
};
