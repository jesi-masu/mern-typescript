import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CartItem } from "../../context/CartContext";
import { formatPrice } from "../../lib/formatters";

interface OrderSummaryProps {
  items: CartItem[];
  totalAmount: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, totalAmount }) => {
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Product details section */}
        <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-start space-x-4">
              <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium leading-tight">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity}
                </p>
                <p className="text-blue-600 font-semibold text-sm mt-1">
                  {formatPrice(item.price)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order breakdown section */}
        <div className="space-y-3 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span className="text-gray-500">Calculated at completion</span>
          </div>
        </div>

        {/* Total section */}
        <div className="border-t pt-4 mt-4 flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span className="text-blue-600">{formatPrice(totalAmount)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
