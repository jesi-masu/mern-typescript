//frontend/src/components/checkout/OrderSummary.tsx
import React from "react"; // No longer needs useState or useEffect
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CartItem } from "../../context/CartContext";
import { formatPrice } from "../../lib/formatters";
// No longer needs fetchProductById
import { Loader2, Package } from "lucide-react";

// Define the Product Part and Full Product types to accept as props
type ProductPart = {
  _id: string;
  name: string;
  description?: string;
  quantity: number;
  price?: number;
  image: string;
};
type FullProduct = {
  _id: string;
  images: string[];
  productParts: ProductPart[];
  // ... (add any other fields from your full product model)
} | null; // Can be null while loading

interface OrderSummaryProps {
  items: CartItem[];
  totalAmount: number;
  fullProduct: FullProduct; // Accept the full product as a prop
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  totalAmount,
  fullProduct,
}) => {
  // Get parts and loading state directly from the prop
  // @ts-ignore
  const parts: ProductPart[] = fullProduct?.productParts || [];
  const isLoadingParts = !fullProduct;

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Product details section */}
        <div className="space-y-4 mb-1 max-h-80 overflow-y-auto pr-2">
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

        {/* Accordion for Included Parts */}
        <Accordion type="single" collapsible className="w-full mb-4">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>View Included Parts ({parts.length})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {isLoadingParts ? (
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : parts.length > 0 ? (
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 text-xs">
                  {parts.map((part) => (
                    <div key={part._id} className="flex items-center gap-2.5">
                      <img
                        src={part.image}
                        alt={part.name}
                        className="h-10 w-10 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <span className="font-medium text-gray-800">
                          {part.name}
                        </span>
                        <p className="text-gray-500">
                          Quantity: {part.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No detailed parts list available.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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
