// src/components/checkout/PaymentStep.tsx
import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { MapPin, Receipt, X, Info } from "lucide-react";
import { PaymentInfo } from "../../../types/checkout";
import { formatPrice } from "../../../lib/formatters";
import PaymentSelector from "../PaymentSelector";
import DeliveryAddressStep from "./DeliveryAddressStep";

// Define the keys for type safety
type PaymentStageKey = "initial" | "pre_delivery" | "final";

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
  installmentStage: PaymentStageKey | "";
  paymentMode: "cash" | "bank" | "cheque" | "gcash" | "";
  paymentTiming: "now" | "later" | "";
  // --- MODIFICATION: Updated paymentReceipts to be an object ---
  paymentReceipts?: {
    initial?: File[];
    pre_delivery?: File[];
    final?: File[];
  };
}

interface PaymentStepProps {
  paymentInfo: ExtendedPaymentInfo;
  onChange: (info: Partial<ExtendedPaymentInfo>) => void;
  totalAmount: number;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  paymentInfo,
  onChange,
  totalAmount,
}) => {
  const getCurrentPaymentAmount = () => {
    if (paymentInfo.paymentMethod === "full") {
      return totalAmount;
    } else if (paymentInfo.paymentMethod === "installment") {
      switch (paymentInfo.installmentStage) {
        case "initial":
          return Math.round(totalAmount * 0.5);
        case "pre_delivery":
          return Math.round(totalAmount * 0.4);
        case "final":
          return (
            totalAmount -
            Math.round(totalAmount * 0.5) -
            Math.round(totalAmount * 0.4)
          );
        default:
          return 0;
      }
    }
    return 0;
  };

  const handlePaymentMethodChange = (method: "installment" | "full" | "") => {
    const updates: Partial<ExtendedPaymentInfo> = { paymentMethod: method };
    if (method === "installment") {
      updates.installmentStage = "initial";
    } else {
      updates.installmentStage = "";
    }
    onChange(updates);
  };

  // --- MODIFICATION: Rewritten to handle object structure ---
  const handlePaymentReceiptChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    let stageKey: PaymentStageKey | undefined;

    if (paymentInfo.paymentMethod === "full") {
      stageKey = "initial";
    } else if (
      paymentInfo.paymentMethod === "installment" &&
      paymentInfo.installmentStage
    ) {
      stageKey = paymentInfo.installmentStage;
    }

    if (!stageKey) return; // Do nothing if there's no valid stage

    const existingReceipts = paymentInfo.paymentReceipts || {};
    const existingFilesForStage = existingReceipts[stageKey] || [];

    onChange({
      paymentReceipts: {
        ...existingReceipts,
        [stageKey]: [...existingFilesForStage, ...files],
      },
    });
  };

  const handleLocationImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    const existingFiles = paymentInfo.locationImages || [];
    onChange({ locationImages: [...existingFiles, ...files] });
  };

  const handleAddressChange = (
    addressInfo: Partial<PaymentInfo["deliveryAddress"]>
  ) => {
    onChange({ deliveryAddress: addressInfo });
  };

  // --- MODIFICATION: Rewritten to handle object structure ---
  const removePaymentReceipt = (stage: PaymentStageKey, index: number) => {
    const existingReceipts = { ...(paymentInfo.paymentReceipts || {}) };
    const filesForStage = existingReceipts[stage] || [];

    const updatedFiles = filesForStage.filter((_, i) => i !== index);

    if (updatedFiles.length > 0) {
      existingReceipts[stage] = updatedFiles;
    } else {
      delete existingReceipts[stage]; // Clean up the key if no files are left
    }

    onChange({ paymentReceipts: existingReceipts });
  };

  const removeLocationImage = (index: number) => {
    const updatedFiles = (paymentInfo.locationImages || []).filter(
      (_, i) => i !== index
    );
    onChange({ locationImages: updatedFiles });
  };

  const handlePaymentTimingChange = (timing: "now" | "later" | "") => {
    const updates: Partial<ExtendedPaymentInfo> = { paymentTiming: timing };
    // --- MODIFICATION: Reset to an object instead of an array ---
    if (timing === "later") {
      updates.paymentReceipts = {};
    }
    onChange(updates);
  };

  const hasUploadedReceipts =
    paymentInfo.paymentReceipts &&
    Object.values(paymentInfo.paymentReceipts).flat().length > 0;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Payment & Location</h3>

      <PaymentSelector
        totalAmount={totalAmount}
        paymentMethod={paymentInfo.paymentMethod}
        onPaymentMethodChange={handlePaymentMethodChange}
        installmentStage={paymentInfo.installmentStage}
        onInstallmentStageChange={(stage) =>
          onChange({ installmentStage: stage })
        }
        paymentMode={paymentInfo.paymentMode}
        onPaymentModeChange={(mode) => onChange({ paymentMode: mode })}
        paymentTiming={paymentInfo.paymentTiming}
        onPaymentTimingChange={handlePaymentTimingChange}
      />

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

                {/* --- MODIFICATION: Updated display logic for object --- */}
                {hasUploadedReceipts && (
                  <div className="mt-3 space-y-3">
                    <p className="text-sm font-medium">Uploaded Receipts:</p>
                    {Object.entries(paymentInfo.paymentReceipts!).map(
                      ([stage, files]) =>
                        files && files.length > 0 ? (
                          <div key={stage}>
                            <p className="text-xs font-semibold capitalize text-gray-600">
                              {stage.replace("_", " ")}:
                            </p>
                            {files.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded ml-2"
                              >
                                <span className="text-sm text-gray-700 truncate pr-2">
                                  {file.name}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removePaymentReceipt(
                                      stage as PaymentStageKey,
                                      index
                                    )
                                  }
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : null
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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

      <DeliveryAddressStep
        deliveryAddress={paymentInfo.deliveryAddress}
        onChange={handleAddressChange}
      />

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
                        <span className="text-sm text-gray-700 truncate pr-2">
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
