//frontend/src/components/checkout/steps/CustomerInfoStep.tsx
import React, { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomerInfo } from "@/types/checkout";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CustomerInfoStepProps {
  customerInfo: CustomerInfo;
  onChange: (info: Partial<CustomerInfo>) => void;
}

/**
 * Helper - safely decode a JWT payload.
 */
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

const CustomerInfoStep: React.FC<CustomerInfoStepProps> = ({
  customerInfo,
  onChange,
}) => {
  const { token, user: authUser } = useAuth() as any;
  const { toast } = useToast();
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;

    const fetchProfile = async () => {
      if (!token) return; // Only fetch if the user is logged in

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

          // Map backend data to your form state, preserving any data the user may have already entered
          const mapped: Partial<CustomerInfo> = {
            firstName: customerInfo.firstName || userData.firstName || "",
            lastName: customerInfo.lastName || userData.lastName || "",
            email: customerInfo.email || userData.email || "",
            phoneNumber: customerInfo.phoneNumber || userData.phoneNumber || "",
            address1: customerInfo.address1 || userData.address?.street || "",
            address2:
              customerInfo.address2 ||
              userData.address?.barangaySubdivision ||
              "",
            // NOTE: This new field is not in your backend model yet.
            // We'll map it from the 'notes' field for now.
            additionalAddressLine:
              customerInfo.additionalAddressLine || userData.notes || "",
            city: customerInfo.city || userData.address?.city || "",
            province: customerInfo.province || userData.address?.province || "",
            postalCode:
              customerInfo.postalCode || userData.address?.postalCode || "",
            country:
              customerInfo.country ||
              userData.address?.country ||
              "Philippines",
          };
          onChange(mapped);
        } else {
          // Handle non-OK responses
        }
      } catch (error: any) {
        console.error("Error fetching user profile:", error);
        toast({
          title: "Network error",
          description: error?.message || "Unable to load profile data.",
          variant: "destructive",
        });
      }
    };

    fetchProfile();
  }, [token, authUser, customerInfo, onChange, toast]);

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
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            value={customerInfo.phoneNumber}
            onChange={(e) => onChange({ phoneNumber: e.target.value })}
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

      {/* --- START: NEW FIELD --- */}
      <div>
        <Label htmlFor="additionalAddressLine">
          Additional Address Line (Optional)
        </Label>
        <Textarea
          id="additionalAddressLine"
          value={customerInfo.additionalAddressLine || ""}
          onChange={(e) => onChange({ additionalAddressLine: e.target.value })}
          placeholder="Building name, floor number, or other location details..."
        />
      </div>
      {/* --- END: NEW FIELD --- */}

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
          <Label htmlFor="province">Province *</Label>
          <Input
            id="province"
            value={customerInfo.province}
            onChange={(e) => onChange({ province: e.target.value })}
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
    </div>
  );
};

export default CustomerInfoStep;
