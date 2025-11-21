import React, { useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, User, Phone } from "lucide-react";
import { PaymentInfo } from "@/types/checkout";
// ✏️ 1. ADD IMPORTS
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface DeliveryAddressStepProps {
  deliveryAddress: PaymentInfo["deliveryAddress"];
  onChange: (addressInfo: Partial<PaymentInfo["deliveryAddress"]>) => void;
}

// ✏️ 2. ADD JWT HELPER (Same as your CustomerInfoStep)
function parseJwt(token: string | undefined | null) {
  if (!token) return null;
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const DeliveryAddressStep: React.FC<DeliveryAddressStepProps> = ({
  deliveryAddress,
  onChange,
}) => {
  // ✏️ 3. GET AUTH DATA
  const { token, user: authUser } = useAuth() as any;
  const { toast } = useToast();
  const fetchedRef = useRef(false);

  // ✏️ 4. ADD EFFECT TO PRE-FILL DATA
  useEffect(() => {
    // If fields are already filled (user typed them or went back a step), don't overwrite
    if (
      fetchedRef.current ||
      (deliveryAddress?.firstName &&
        deliveryAddress?.lastName &&
        deliveryAddress?.phone)
    ) {
      return;
    }

    const fetchUserProfile = async () => {
      if (!token) return;

      try {
        const parsed = parseJwt(token);
        const userId = parsed?.id || authUser?._id;
        if (!userId) return;

        const base = (import.meta as any).env?.VITE_BACKEND_URL ?? "";
        const url = `${base}/api/users/${userId}`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const userData = await res.json();
          fetchedRef.current = true;

          // Pre-fill ONLY if the specific field is empty in the current state
          onChange({
            ...deliveryAddress,
            firstName: deliveryAddress?.firstName || userData.firstName || "",
            lastName: deliveryAddress?.lastName || userData.lastName || "",
            phone: deliveryAddress?.phone || userData.phoneNumber || "",
          });

          // Optional: You could also pre-fill address fields if you wanted to,
          // but your request specifically asked for Recipient info.
        }
      } catch (error) {
        console.error("Error fetching user details for delivery:", error);
        // We silently fail here; it's better to let the user type manually
        // than to show an error toast for a "convenience" feature.
      }
    };

    fetchUserProfile();
  }, [token, authUser, deliveryAddress, onChange]);

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
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
          {/* --- RECIPIENT FIELDS (Now Auto-filled) --- */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              Recipient Information
            </h4>
            <p className="text-sm text-gray-600">
              Who will be receiving this order?
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="form-group">
              <Label htmlFor="delivery-firstName">First Name *</Label>
              <Input
                id="delivery-firstName"
                name="firstName"
                type="text"
                placeholder="e.g., Juan"
                value={deliveryAddress?.firstName || ""}
                onChange={handleAddressChange}
                required
              />
            </div>
            <div className="form-group">
              <Label htmlFor="delivery-lastName">Last Name *</Label>
              <Input
                id="delivery-lastName"
                name="lastName"
                type="text"
                placeholder="e.g., Dela Cruz"
                value={deliveryAddress?.lastName || ""}
                onChange={handleAddressChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <Label htmlFor="delivery-phone">Phone Number *</Label>
            <Input
              id="delivery-phone"
              name="phone"
              type="tel"
              placeholder="e.g., 09171234567"
              value={deliveryAddress?.phone || ""}
              onChange={handleAddressChange}
              required
            />
          </div>

          {/* --- DELIVERY LOCATION FIELDS (Unchanged) --- */}
          <div className="bg-red-50 p-4 rounded-lg mt-6">
            <h4 className="font-medium mb-2">Delivery Location</h4>
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
            <Label htmlFor="additionalAddressLine">Landmark (Optional)</Label>
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
              value={deliveryAddress?.country || "Philippines"}
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
