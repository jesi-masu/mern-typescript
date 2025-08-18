import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Assuming Product type is now imported from "@/types/product"
import { Product } from "@/types/product"; // Corrected import path
import { formatPriceFromUSD } from "@/lib/formatters";

interface OrderSummaryProps {
  product: Product;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ product }) => {
  // Use a constant for the price formatting function to avoid recreation on every render
  const formatPrice = (price: number) => {
    return formatPriceFromUSD(price);
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Product details section */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
            <img
              // Use product.image or fallback to product.images[0] if available
              src={
                product.images && product.images.length > 0
                  ? product.images[0]
                  : product.image
              }
              alt={product.productName} // Use productName
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-lg">{product.productName}</h3>{" "}
            {/* Use productName */}
            <p className="text-sm text-gray-600">{product.squareFeet} sq ft</p>
            <p className="text-blue-600 font-semibold mt-1">
              {formatPrice(product.productPrice)} {/* Use productPrice */}
            </p>
          </div>
        </div>

        {/* Order breakdown section */}
        <div className="space-y-3 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(product.productPrice)}</span>{" "}
            {/* Use productPrice for subtotal */}
          </div>
          <div className="flex justify-between">
            <span>Quantity</span>
            <span>1</span>
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
          <span className="text-blue-600">
            {formatPrice(product.productPrice)}
          </span>{" "}
          {/* Use productPrice for total */}
        </div>

        {/* Lead time notice */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Lead Time:</strong> {product.leadTime || "6-8 weeks"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
