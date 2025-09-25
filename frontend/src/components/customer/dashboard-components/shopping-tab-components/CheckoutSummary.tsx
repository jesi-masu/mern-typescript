import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, CreditCard } from "lucide-react";
import { CartItem } from "@/context/CartContext";

interface CheckoutSummaryProps {
  selectedCartItems: CartItem[];
  onBackToCart: () => void;
  onProceedToCheckout: () => void;
  getSelectedItemsTotal: () => number;
  // --- [REMOVED] formatPrice prop is no longer needed ---
}

// --- [NEW] Self-contained price formatting function for PHP ---
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(price);
};

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  selectedCartItems,
  onBackToCart,
  onProceedToCheckout,
  getSelectedItemsTotal,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Order Summary</h2>
        <Button variant="outline" onClick={onBackToCart}>
          Back to Cart
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Selected Items ({selectedCartItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedCartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatPrice(item.price)} each
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total: {formatPrice(getSelectedItemsTotal())}</span>
              <Button
                onClick={onProceedToCheckout}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
