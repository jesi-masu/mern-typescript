// src/components/tracking/PaymentStatusCard.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, Percent, CheckCircle } from "lucide-react";
import { PaymentUpload } from "@/components/customer/PaymentUpload";
import { OrderDetail, PaymentStatus } from "@/types/order";

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
  // --- START: MODIFICATION ---
  // Use optional chaining (?.) for safety.
  const currentStatus = order.paymentInfo?.paymentStatus || "Pending";

  const currentPaymentStatusIndex = paymentStatusSteps.findIndex(
    (step) => step.key === currentStatus
  );
  const { remainingAmount, percentage } = getPaymentDetails(
    currentStatus,
    order.totalAmount
  );
  // --- END: MODIFICATION ---

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Payment Status</CardTitle>
          {/* --- MODIFICATION: Use the 'currentStatus' variable --- */}
          <Badge className={getPaymentStatusColor(currentStatus)}>
            {currentStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center pt-4">
            {paymentStatusSteps.map((step, index) => {
              const isCompleted = index < currentPaymentStatusIndex;
              const isCurrent = index === currentPaymentStatusIndex;
              const Icon = step.icon;
              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center text-center w-1/4"
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 mb-2 ${
                      isCompleted
                        ? "bg-green-100 border-green-500 text-green-600"
                        : isCurrent
                        ? "bg-blue-100 border-blue-500 text-blue-600"
                        : "bg-gray-100 border-gray-300 text-gray-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p
                    className={`text-xs font-medium ${
                      isCompleted || isCurrent
                        ? "text-gray-900"
                        : "text-gray-500"
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

          {/* --- MODIFICATION: Use the 'currentStatus' variable --- */}
          {currentStatus !== "100% Complete Paid" && (
            <PaymentUpload orderId={order._id} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
