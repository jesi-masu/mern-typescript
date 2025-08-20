import React, { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomerInfo } from "@/types/checkout";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface CustomerInfoStepProps {
  customerInfo: CustomerInfo;
  onChange: (info: Partial<CustomerInfo>) => void;
}

/**
 * Helper - safely decode a JWT payload in the browser.
 * Returns the parsed payload or null if it can't be decoded.
 */
function parseJwt(token: string | undefined | null) {
  if (!token) return null;
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    // atob is available in browsers
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
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
  const { token, user: authUser } = useAuth() as any; // some hooks provide user; tolerate either shape
  const { toast } = useToast();
  const fetchedRef = useRef(false); // avoid re-applying server values repeatedly

  useEffect(() => {
    // Only fetch once per mount (or until parent clears customerInfo)
    if (fetchedRef.current) return;

    let mounted = true;

    const fetchProfile = async () => {
      try {
        // If token contains id in payload use GET /api/users/:id (preferred).
        // Fallback to GET /api/users (handles older setups).
        const parsed = parseJwt(token);
        let userId: string | null = null;

        // token payload in your backend is { id, role }
        if (parsed && typeof parsed === "object") {
          if (parsed.id) userId = parsed.id;
          else if (parsed._id) userId = parsed._id;
          else if (parsed.sub) userId = parsed.sub;
        }

        // If useAuth already provided the user object, prefer that id
        if (!userId && authUser && authUser._id) {
          userId = authUser._id;
        }

        const base = (import.meta as any).env?.VITE_BACKEND_URL ?? "";
        // build request url
        const url = userId
          ? `${base}/api/users/${userId}`
          : `${base}/api/users`; // fallback

        const res = await fetch(url, {
          headers: token
            ? {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              }
            : { "Content-Type": "application/json" },
        });

        if (!mounted) return;

        if (res.ok) {
          const data = await res.json();

          // If backend returned an array (GET /api/users) try to pick the current user:
          let userData: any = data;
          if (Array.isArray(data)) {
            // try to find by token email (if available) or pick the first element
            const payloadEmail = parsed && parsed.email ? parsed.email : null;
            if (payloadEmail) {
              userData =
                data.find(
                  (u: any) =>
                    (u.email || "").toLowerCase() ===
                    (payloadEmail || "").toLowerCase()
                ) || data[0];
            } else {
              userData = data[0];
            }
          }

          if (!userData) {
            // Nothing to map
            fetchedRef.current = true;
            return;
          }

          // Map server values into the CustomerInfo shape used by the form.
          const mapped: Partial<CustomerInfo> = {
            firstName: customerInfo.firstName || userData.firstName || "",
            lastName: customerInfo.lastName || userData.lastName || "",
            email: customerInfo.email || userData.email || "",
            phone:
              customerInfo.phone ||
              userData.phoneNumber ||
              userData.phone ||
              "",
            address1:
              customerInfo.address1 ||
              (userData.address &&
                (userData.address.street || userData.address.streetAddress)) ||
              userData.address1 ||
              "",
            address2:
              customerInfo.address2 ||
              (userData.address &&
                (userData.address.barangaySubdivision ||
                  userData.address.line2)) ||
              userData.address2 ||
              "",
            city:
              customerInfo.city ||
              (userData.address && userData.address.city) ||
              userData.city ||
              "",
            state:
              customerInfo.state ||
              (userData.address && userData.address.province) ||
              userData.state ||
              "",
            postalCode:
              customerInfo.postalCode ||
              (userData.address &&
                (userData.address.postalCode || userData.address.zip)) ||
              userData.postalCode ||
              "",
            country:
              customerInfo.country ||
              (userData.address && userData.address.country) ||
              userData.country ||
              "Philippines",
            notes: customerInfo.notes || userData.notes || "",
          };

          // Only update parent with values we actually have (prevent overwriting intentional defaults)
          const toSet: Partial<CustomerInfo> = {};
          (Object.keys(mapped) as Array<keyof CustomerInfo>).forEach((k) => {
            const v = mapped[k];
            if (v !== undefined && v !== null && v !== "") {
              toSet[k] = v;
            }
          });

          if (Object.keys(toSet).length > 0) {
            onChange(toSet);
          }

          fetchedRef.current = true;
        } else {
          // don't show a toast for anonymous users if endpoint requires auth and there's no token
          if (res.status === 401) {
            if (token) {
              toast({
                title: "Not authorized",
                description: "Unable to load profile — please sign in again.",
                variant: "destructive",
              });
            }
          } else {
            const err = await res.json().catch(() => ({}));
            toast({
              title: "Failed to load profile",
              description: err.message || "Could not fetch profile data.",
              variant: "destructive",
            });
          }
          fetchedRef.current = true;
        }
      } catch (error: any) {
        if (!mounted) return;
        console.error("Error fetching user profile:", error);
        toast({
          title: "Network error",
          description: error?.message || "Unable to load profile data.",
          variant: "destructive",
        });
        fetchedRef.current = true;
      }
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

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
        <Label htmlFor="notes">Additional Address Line</Label>
        <Textarea
          id="notes"
          value={customerInfo.notes || ""}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Any supplementary address. Building names, or other specific locations..."
        />
      </div>
    </div>
  );
};

export default CustomerInfoStep;
