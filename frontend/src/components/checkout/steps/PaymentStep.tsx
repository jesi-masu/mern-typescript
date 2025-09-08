//frontend/src/components/checkout/steps/PaymentStep.tsx
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Receipt, X, Info } from "lucide-react";
import { PaymentInfo } from "@/types/checkout";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/formatters";
import PaymentSelector from "../PaymentSelector";

// Define the full shape of the payment information object
interface ExtendedPaymentInfo extends PaymentInfo {
  deliveryAddress?: {
    street: string;
    subdivision: string;
    cityMunicipality: string;
    province: string;
    postalCode: string;
    country: string;
    additionalAddressLine: string;
  };
  paymentMethod: "installment" | "full" | "";
  installmentStage: "initial" | "pre_delivery" | "final" | "";
  paymentMode: "cash" | "bank" | "cheque" | "gcash" | "";
  paymentTiming: "now" | "later" | "";
}

interface PaymentStepProps {
  paymentInfo: ExtendedPaymentInfo;
  onChange: (info: Partial<ExtendedPaymentInfo>) => void;
  product: Product;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  paymentInfo,
  onChange,
  product,
}) => {
  const getCurrentPaymentAmount = () => {
    if (paymentInfo.paymentMethod === "full") {
      return product.productPrice;
    } else if (paymentInfo.paymentMethod === "installment") {
      switch (paymentInfo.installmentStage) {
        case "initial":
          return Math.round(product.productPrice * 0.5);
        case "pre_delivery":
          return Math.round(product.productPrice * 0.4);
        case "final":
          return (
            product.productPrice -
            Math.round(product.productPrice * 0.5) -
            Math.round(product.productPrice * 0.4)
          );
        default:
          return 0;
      }
    }
    return 0;
  };

  const handlePaymentReceiptChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    const existingFiles = paymentInfo.paymentReceipts || [];
    onChange({ paymentReceipts: [...existingFiles, ...files] });
  };

  const handleLocationImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    const existingFiles = paymentInfo.locationImages || [];
    onChange({ locationImages: [...existingFiles, ...files] });
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange({
      deliveryAddress: {
        ...(paymentInfo.deliveryAddress || {}),
        [name]: value,
      } as ExtendedPaymentInfo["deliveryAddress"],
    });
  };

  const removePaymentReceipt = (index: number) => {
    const updatedFiles = (paymentInfo.paymentReceipts || []).filter(
      (_, i) => i !== index
    );
    onChange({ paymentReceipts: updatedFiles });
  };

  const removeLocationImage = (index: number) => {
    const updatedFiles = (paymentInfo.locationImages || []).filter(
      (_, i) => i !== index
    );
    onChange({ locationImages: updatedFiles });
  };

  // START: ADDED LOGIC TO CLEAR STATE ON CHANGE
  const handlePaymentTimingChange = (timing: "now" | "later" | "") => {
    const updates: Partial<ExtendedPaymentInfo> = { paymentTiming: timing };
    // If the user selects "Pay Later," we must clear any receipts they may have uploaded.
    if (timing === "later") {
      updates.paymentReceipts = [];
    }
    onChange(updates);
  };
  // END: ADDED LOGIC TO CLEAR STATE ON CHANGE

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Payment & Location</h3>

      <PaymentSelector
        product={product}
        paymentMethod={paymentInfo.paymentMethod}
        onPaymentMethodChange={(method) => onChange({ paymentMethod: method })}
        installmentStage={paymentInfo.installmentStage}
        onInstallmentStageChange={(stage) =>
          onChange({ installmentStage: stage })
        }
        paymentMode={paymentInfo.paymentMode}
        onPaymentModeChange={(mode) => onChange({ paymentMode: mode })}
        paymentTiming={paymentInfo.paymentTiming}
        onPaymentTimingChange={handlePaymentTimingChange} // Use the new handler
      />

      {/* This section now correctly appears only when "Pay Now" is selected */}
      {paymentInfo.paymentTiming === "now" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Current Payment Details</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Amount Due:{" "}
                  <span className="font-semibold">
                    {formatPrice(getCurrentPaymentAmount())}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Please make the payment and upload the receipt(s) below.
                </p>
              </div>

              <div>
                <Label htmlFor="paymentReceipts">Payment Receipts *</Label>
                <div className="mt-1">
                  <Input
                    id="paymentReceipts"
                    type="file"
                    accept="image/*,.pdf"
                    multiple
                    onChange={handlePaymentReceiptChange}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Upload your payment receipts (PNG, JPG, or PDF).
                </p>

                {paymentInfo.paymentReceipts &&
                  paymentInfo.paymentReceipts.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-medium">Uploaded Receipts:</p>
                      {paymentInfo.paymentReceipts.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded"
                        >
                          <span className="text-sm text-gray-700">
                            {file.name}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePaymentReceipt(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* This message correctly appears only when "Pay Later" is selected */}
      {paymentInfo.paymentTiming === "later" && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-start gap-4">
            <Info className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-800">
                Pay Later Selected
              </h4>
              <p className="text-sm text-amber-700">
                You have chosen to submit your order now and upload the payment
                receipt later. You can find this order in your dashboard to
                complete the payment.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- Delivery Address and Location Cards (No Changes) --- */}
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
                value={paymentInfo.deliveryAddress?.street || ""}
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
                value={paymentInfo.deliveryAddress?.subdivision || ""}
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
                value={paymentInfo.deliveryAddress?.additionalAddressLine || ""}
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
                value={paymentInfo.deliveryAddress?.cityMunicipality || ""}
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
                value={paymentInfo.deliveryAddress?.province || ""}
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
                value={paymentInfo.deliveryAddress?.postalCode || ""}
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
                value={paymentInfo.deliveryAddress?.country || ""}
                onChange={handleAddressChange}
                required
              >
                <option value="Philippines">Philippines</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Installation Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Location Images Required</h4>
              <p className="text-sm text-gray-600">
                Please provide images of where the prefab unit will be
                installed.
              </p>
            </div>

            <div>
              <Label htmlFor="locationImages">Location Images *</Label>
              <div className="mt-1">
                <Input
                  id="locationImages"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleLocationImageChange}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Upload clear images of the installation site.
              </p>

              {paymentInfo.locationImages &&
                paymentInfo.locationImages.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium">
                      Uploaded Location Images:
                    </p>
                    {paymentInfo.locationImages.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <span className="text-sm text-gray-700">
                          {file.name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLocationImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStep;
