
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, CreditCard, Calendar } from "lucide-react";
import { Product } from "@/data/products";

interface PaymentMethodSelectorProps {
  paymentMethod: 'installment' | 'full' | '';
  onChange: (method: 'installment' | 'full') => void;
  product: Product;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  paymentMethod, 
  onChange, 
  product 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const initialPayment = Math.round(product.price * 0.5);
  const preDeliveryPayment = Math.round(product.price * 0.4);
  const finalPayment = product.price - initialPayment - preDeliveryPayment;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method Selection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={paymentMethod} onValueChange={onChange}>
          <div className="space-y-4">
            {/* Installment Payment Option */}
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="installment" id="installment" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="installment" className="text-base font-medium cursor-pointer">
                  Installment Payment Plan
                </Label>
                <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Initial Payment (50%)</span>
                      </div>
                      <span className="font-semibold text-blue-700">
                        {formatCurrency(initialPayment)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Pre-Delivery Payment (40%)</span>
                      </div>
                      <span className="font-semibold text-blue-700">
                        {formatCurrency(preDeliveryPayment)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Final Payment (10%)</span>
                      </div>
                      <span className="font-semibold text-blue-700">
                        {formatCurrency(finalPayment)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-blue-300">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-800">Total Amount</span>
                        <span className="font-bold text-blue-800">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    Flexible payment schedule to accommodate your budget
                  </p>
                </div>
              </div>
            </div>

            {/* Full Payment Option */}
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="full" id="full" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="full" className="text-base font-medium cursor-pointer">
                  Full Payment (100% Upfront)
                </Label>
                <div className="mt-2 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Complete Payment</span>
                    </div>
                    <span className="font-bold text-green-700">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                  <p className="text-xs text-green-600">
                    Settle the entire amount at checkout - no additional payments required
                  </p>
                </div>
              </div>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;
