import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Trash2, Save, Loader2 } from "lucide-react";

// The shape of the data this form collects and passes to the parent
export interface ManualEntryData {
  createdAt: string;
  totalAmount: string;
  products: { productId: string; quantity: number }[];
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    deliveryAddress: {
      street: string;
      subdivision: string;
      cityMunicipality: string;
      province: string;
      postalCode: string;
      country: string;
    };
  };
  paymentInfo: {
    paymentMethod: "full" | "installment";
    paymentMode: "cash" | "bank" | "cheque" | "gcash";
    paymentTiming: "now" | "later";
  };
}

// The props this component accepts
interface ManualEntryFormProps {
  onSubmit: (data: ManualEntryData) => void;
  isProcessing: boolean;
}

// Initial state for resetting the form
const initialFormState: ManualEntryData = {
  createdAt: "",
  totalAmount: "",
  products: [{ productId: "", quantity: 1 }],
  customerInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    deliveryAddress: {
      street: "",
      subdivision: "",
      cityMunicipality: "",
      province: "",
      postalCode: "",
      country: "Philippines",
    },
  },
  paymentInfo: {
    paymentMethod: "full",
    paymentMode: "cash",
    paymentTiming: "now",
  },
};

export const ManualEntryForm: React.FC<ManualEntryFormProps> = ({
  onSubmit,
  isProcessing,
}) => {
  const [formState, setFormState] = useState(initialFormState);

  // --- Handlers for state changes ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (keys.length === 1) {
      setFormState((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormState((prev) => {
        const newState = { ...prev };
        let currentLevel: any = newState;
        for (let i = 0; i < keys.length - 1; i++) {
          currentLevel = currentLevel[keys[i]];
        }
        currentLevel[keys[keys.length - 1]] = value;
        return newState;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    const keys = name.split(".");
    setFormState((prev) => ({
      ...prev,
      [keys[0]]: {
        ...prev[keys[0] as keyof ManualEntryData],
        [keys[1]]: value,
      },
    }));
  };

  const handleProductChange = (
    index: number,
    field: "productId" | "quantity",
    value: string
  ) => {
    const newProducts = [...formState.products];
    newProducts[index] = {
      ...newProducts[index],
      [field]: field === "quantity" ? parseInt(value) || 1 : value,
    };
    setFormState((prev) => ({ ...prev, products: newProducts }));
  };

  const handleAddProduct = () =>
    setFormState((prev) => ({
      ...prev,
      products: [...prev.products, { productId: "", quantity: 1 }],
    }));
  const handleRemoveProduct = (index: number) =>
    setFormState((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));

  const handleSubmit = () => {
    onSubmit(formState);
    setFormState(initialFormState);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Single Historical Order</CardTitle>
        <p className="text-sm text-muted-foreground">
          Fill in the details for a past order. Fields marked with an asterisk
          (*) are required.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* === Order Details === */}
        <div className="space-y-4 p-4 border rounded-md">
          <h3 className="font-semibold text-lg">Order Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Order Date *</label>
              <Input
                type="date"
                name="createdAt"
                value={formState.createdAt}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Total Amount (₱) *</label>
              <Input
                type="number"
                name="totalAmount"
                placeholder="e.g., 150000"
                value={formState.totalAmount}
                onChange={handleChange}
                onWheel={(e) => (e.target as HTMLElement).blur()}
              />
            </div>
          </div>
        </div>

        {/* === Customer Information === */}
        <div className="space-y-4 p-4 border rounded-md">
          <h3 className="font-semibold text-lg">Customer Information *</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="customerInfo.firstName"
              placeholder="First Name"
              value={formState.customerInfo.firstName}
              onChange={handleChange}
            />
            <Input
              name="customerInfo.lastName"
              placeholder="Last Name"
              value={formState.customerInfo.lastName}
              onChange={handleChange}
            />
            <Input
              name="customerInfo.email"
              type="email"
              placeholder="Email Address"
              value={formState.customerInfo.email}
              onChange={handleChange}
            />
            <Input
              name="customerInfo.phoneNumber"
              placeholder="Phone Number"
              value={formState.customerInfo.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <h4 className="font-medium pt-2">Delivery Address *</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="customerInfo.deliveryAddress.street"
              placeholder="Street"
              value={formState.customerInfo.deliveryAddress.street}
              onChange={handleChange}
            />
            <Input
              name="customerInfo.deliveryAddress.subdivision"
              placeholder="Subdivision / Barangay"
              value={formState.customerInfo.deliveryAddress.subdivision}
              onChange={handleChange}
            />
            <Input
              name="customerInfo.deliveryAddress.cityMunicipality"
              placeholder="City / Municipality"
              value={formState.customerInfo.deliveryAddress.cityMunicipality}
              onChange={handleChange}
            />
            <Input
              name="customerInfo.deliveryAddress.province"
              placeholder="Province"
              value={formState.customerInfo.deliveryAddress.province}
              onChange={handleChange}
            />
            <Input
              name="customerInfo.deliveryAddress.postalCode"
              placeholder="Postal Code"
              value={formState.customerInfo.deliveryAddress.postalCode}
              onChange={handleChange}
            />
            <Input
              name="customerInfo.deliveryAddress.country"
              placeholder="Country"
              value={formState.customerInfo.deliveryAddress.country}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* === Payment Information === */}
        <div className="space-y-4 p-4 border rounded-md">
          <h3 className="font-semibold text-lg">Payment Information *</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={formState.paymentInfo.paymentMethod}
              onValueChange={(v) =>
                handleSelectChange("paymentInfo.paymentMethod", v)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Payment</SelectItem>
                <SelectItem value="installment">Installment</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={formState.paymentInfo.paymentMode}
              onValueChange={(v) =>
                handleSelectChange("paymentInfo.paymentMode", v)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank">Bank</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="gcash">GCash</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={formState.paymentInfo.paymentTiming}
              onValueChange={(v) =>
                handleSelectChange("paymentInfo.paymentTiming", v)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="now">Paid Now</SelectItem>
                <SelectItem value="later">Paid Later</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* === Products === */}
        <div className="space-y-4 p-4 border rounded-md">
          <h3 className="font-semibold text-lg">Products *</h3>
          {formState.products.map((product, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Product ID"
                value={product.productId}
                onChange={(e) =>
                  handleProductChange(index, "productId", e.target.value)
                }
                className="flex-grow"
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={product.quantity}
                onChange={(e) =>
                  handleProductChange(index, "quantity", e.target.value)
                }
                className="w-24"
                min="1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveProduct(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={handleAddProduct}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Another Product
          </Button>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Historical Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
