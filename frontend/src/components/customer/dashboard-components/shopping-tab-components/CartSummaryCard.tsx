import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

interface CartSummaryCardProps {
  totalItems: number;
  totalPrice: number;
  // --- [REMOVED] formatPrice prop is no longer needed ---
}

// --- [NEW] Self-contained price formatting function for PHP ---
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(price);
};

export const CartSummaryCard: React.FC<CartSummaryCardProps> = ({
  totalItems,
  totalPrice,
}) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Shopping Cart</h3>
              <p className="text-sm text-gray-600">{totalItems} items</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              {formatPrice(totalPrice)}
            </p>
            <p className="text-sm text-gray-500">Total Amount</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
