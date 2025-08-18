
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";
import { Product } from "@/data/products";

interface InstallmentStageSelectorProps {
  installmentStage: 'initial' | 'pre_delivery' | 'final';
  onChange: (stage: 'initial' | 'pre_delivery' | 'final') => void;
  product: Product;
}

const InstallmentStageSelector: React.FC<InstallmentStageSelectorProps> = ({ 
  installmentStage, 
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

  const stages = [
    {
      id: 'initial',
      title: 'Initial Payment (50%)',
      amount: initialPayment,
      description: 'Required to commence the order or project',
      icon: AlertCircle,
      color: 'blue'
    },
    {
      id: 'pre_delivery',
      title: 'Pre-Delivery Payment (40%)',
      amount: preDeliveryPayment,
      description: 'Due before scheduled delivery',
      icon: Clock,
      color: 'orange'
    },
    {
      id: 'final',
      title: 'Final Payment (10%)',
      amount: finalPayment,
      description: 'Due upon successful completion',
      icon: CheckCircle,
      color: 'green'
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Select Payment Stage</CardTitle>
        <p className="text-sm text-gray-600">
          Choose which installment payment you are making
        </p>
      </CardHeader>
      <CardContent>
        <RadioGroup value={installmentStage} onValueChange={onChange}>
          <div className="space-y-3">
            {stages.map((stage) => {
              const Icon = stage.icon;
              return (
                <div key={stage.id} className="flex items-start space-x-3">
                  <RadioGroupItem value={stage.id} id={stage.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={stage.id} className="cursor-pointer">
                      <div className={`p-3 rounded-lg border-2 ${
                        installmentStage === stage.id 
                          ? `border-${stage.color}-300 bg-${stage.color}-50` 
                          : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 text-${stage.color}-600`} />
                            <span className="font-medium">{stage.title}</span>
                          </div>
                          <span className={`font-bold text-${stage.color}-700`}>
                            {formatCurrency(stage.amount)}
                          </span>
                        </div>
                        <p className={`text-xs text-${stage.color}-600`}>
                          {stage.description}
                        </p>
                      </div>
                    </Label>
                  </div>
                </div>
              );
            })}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default InstallmentStageSelector;
