import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { PaymentInfo } from "@/types/checkout";

interface DeliveryAddressStepProps {
  deliveryAddress: PaymentInfo["deliveryAddress"];
  onChange: (addressInfo: Partial<PaymentInfo["deliveryAddress"]>) => void;
}

const DeliveryAddressStep: React.FC<DeliveryAddressStepProps> = ({
  deliveryAddress,
  onChange,
}) => {
  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // This now correctly updates only the address part of the state
    onChange({
      ...deliveryAddress,
      [name]: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Delivery Address
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Delivery Address Required</h4>
            <p className="text-sm text-gray-600">
              Please provide the exact delivery address.
            </p>
          </div>
          <div className="form-group">
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              name="street"
              type="text"
              placeholder="e.g., Block 12 Lot 34 Mango Street"
              value={deliveryAddress?.street || ""}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div className="form-group">
            <Label htmlFor="subdivision">Subdivision/Barangay *</Label>
            <Input
              id="subdivision"
              name="subdivision"
              type="text"
              placeholder="e.g., Greenland Subdivision, Poblacion"
              value={deliveryAddress?.subdivision || ""}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div className="form-group">
            <Label htmlFor="additionalAddressLine">
              Additional Address Line (Optional)
            </Label>
            <Input
              id="additionalAddressLine"
              name="additionalAddressLine"
              type="text"
              placeholder="Any supplementary address or other specific location..."
              value={deliveryAddress?.additionalAddressLine || ""}
              onChange={handleAddressChange}
            />
          </div>
          <div className="form-group">
            <Label htmlFor="cityMunicipality">City/Municipality *</Label>
            <Input
              id="cityMunicipality"
              name="cityMunicipality"
              type="text"
              placeholder="e.g., Cagayan de Oro City"
              value={deliveryAddress?.cityMunicipality || ""}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div className="form-group">
            <Label htmlFor="province">Province *</Label>
            <Input
              id="province"
              name="province"
              type="text"
              placeholder="e.g., Misamis Oriental"
              value={deliveryAddress?.province || ""}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div className="form-group">
            <Label htmlFor="postalCode">Postal Code *</Label>
            <Input
              id="postalCode"
              name="postalCode"
              type="text"
              placeholder="e.g., 9000"
              pattern="[0-9]{4}"
              title="Please enter a 4-digit postal code"
              value={deliveryAddress?.postalCode || ""}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div className="form-group">
            <Label htmlFor="country">Country *</Label>
            <select
              id="country"
              name="country"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={deliveryAddress?.country || ""}
              onChange={handleAddressChange}
              required
            >
              <option value="Philippines">Philippines</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryAddressStep;
