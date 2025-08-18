import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomerInfo } from "@/types/checkout";

interface CustomerInfoStepProps {
  customerInfo: CustomerInfo;
  onChange: (info: Partial<CustomerInfo>) => void;
}

const CustomerInfoStep: React.FC<CustomerInfoStepProps> = ({
  customerInfo,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Customer Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={customerInfo.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={customerInfo.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={customerInfo.email}
            onChange={(e) => onChange({ email: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={customerInfo.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            required
          />
        </div>
      </div>
      <p className="text-sm text-gray-500">
        Please provide your permanent address below.
      </p>
      <div>
        <Label htmlFor="address1">Street *</Label>
        <Input
          id="address1"
          value={customerInfo.address1}
          onChange={(e) => onChange({ address1: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="address2">Barangay / Subdivision *</Label>
        <Input
          id="address2"
          value={customerInfo.address2 || ""}
          onChange={(e) => onChange({ address2: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City / Municipality *</Label>
          <Input
            id="city"
            value={customerInfo.city}
            onChange={(e) => onChange({ city: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="state">Province *</Label>
          <Input
            id="state"
            value={customerInfo.state}
            onChange={(e) => onChange({ state: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="postalCode">Postal Code *</Label>
          <Input
            id="postalCode"
            value={customerInfo.postalCode}
            onChange={(e) => onChange({ postalCode: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="country">Country *</Label>
        <Input
          id="country"
          value={customerInfo.country}
          onChange={(e) => onChange({ country: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={customerInfo.notes || ""}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Any special instructions or requirements..."
        />
      </div>
    </div>
  );
};

export default CustomerInfoStep;
