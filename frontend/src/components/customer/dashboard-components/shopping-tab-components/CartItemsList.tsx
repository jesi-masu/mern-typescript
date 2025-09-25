import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Package, CreditCard, Plus, Minus, Trash2 } from "lucide-react"; // Import Trash2 icon
import { CartItem } from "@/context/CartContext";

interface CartItemsListProps {
  cartItems: CartItem[];
  selectedItems: Set<string>;
  onItemSelect: (itemId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onCheckout: () => void;
  onRemoveSelected: () => void; // Add new prop
  getSelectedItemsCount: () => number;
  getSelectedItemsTotal: () => number;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(price);
};

export const CartItemsList: React.FC<CartItemsListProps> = ({
  cartItems,
  selectedItems,
  onItemSelect,
  onSelectAll,
  onUpdateQuantity,
  onCheckout,
  onRemoveSelected, // Destructure new prop
  getSelectedItemsCount,
  getSelectedItemsTotal,
}) => {
  if (cartItems.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Cart Items ({cartItems.length})
          </CardTitle>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={
                  selectedItems.size === cartItems.length &&
                  cartItems.length > 0
                }
                onCheckedChange={(checked) => onSelectAll(Boolean(checked))}
              />
              <label htmlFor="select-all" className="text-sm font-medium">
                Select All
              </label>
            </div>
            {/* --- [NEW] Clear Selected button --- */}
            <Button
              variant="outline"
              size="sm"
              onClick={onRemoveSelected}
              disabled={selectedItems.size === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Selected
            </Button>
            <Button
              onClick={onCheckout}
              disabled={selectedItems.size === 0}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Checkout ({getSelectedItemsCount()})
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 border rounded-lg"
          >
            <Checkbox
              id={`item-${item.id}`}
              checked={selectedItems.has(item.id)}
              onCheckedChange={(checked) =>
                onItemSelect(item.id, Boolean(checked))
              }
            />
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">
                {formatPrice(item.price)} each
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium w-8 text-center">
                {item.quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-right w-24">
              <p className="font-semibold">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
