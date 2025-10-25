//frontend/src/components/checkout/steps/ContractDocument.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { FileText, Eye, EyeOff } from "lucide-react";
import {
  CustomerInfo,
  PaymentInfo,
  ContractInfo,
} from "../../../types/checkout";
import { CartItem } from "../../../context/CartContext";
import { formatPrice } from "../../../lib/formatters";

type DeliveryAddress = PaymentInfo["deliveryAddress"];

interface UpdatedContractInfo extends ContractInfo {
  signatureTimestamp?: string;
}

interface ContractDocumentProps {
  showContract: boolean;
  setShowContract: (show: boolean) => void;
  contractInfo: UpdatedContractInfo;
  customerInfo: CustomerInfo;
  deliveryAddress?: DeliveryAddress;
  items: CartItem[];
  totalAmount: number;
  getSignatureDate: () => string;
  getSignatureTime: () => string;
}

export const ContractDocument: React.FC<ContractDocumentProps> = ({
  showContract,
  setShowContract,
  contractInfo,
  customerInfo,
  deliveryAddress,
  items,
  totalAmount,
  getSignatureDate,
  getSignatureTime,
}) => {
  return (
    <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-green-900">
            <FileText className="h-5 w-5" />
            Contract Document
            <Badge className="bg-green-100 text-green-800">Ready</Badge>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowContract(!showContract)}
            className="flex items-center gap-2 border-green-300 hover:bg-green-100"
          >
            {showContract ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {showContract ? "Hide" : "View"} Contract
          </Button>
        </CardTitle>
      </CardHeader>
      {showContract && (
        <CardContent>
          <div className="bg-white p-6 rounded-lg border space-y-6">
            <div className="text-center border-b pb-4">
              <h2 className="text-xl font-bold">
                PREFAB CONSTRUCTION CONTRACT
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Contract No: PC-
                {contractInfo.signatureTimestamp
                  ? new Date(contractInfo.signatureTimestamp).getTime()
                  : "N/A"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Name:</strong> {customerInfo.firstName}{" "}
                    {customerInfo.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {customerInfo.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {customerInfo.phoneNumber}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Product Details</h3>
                <div className="text-sm space-y-2">
                  {items.map((item) => (
                    <p key={item.id}>
                      <strong>Product:</strong> {item.name} (x
                      {item.quantity})
                      <br />
                      <strong>Price:</strong>{" "}
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  ))}
                  <p className="border-t pt-1 font-bold">
                    <strong>Total:</strong> {formatPrice(totalAmount)}
                  </p>
                  <p>
                    <strong>Contract Date:</strong> {getSignatureDate()}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Delivery Address</h3>
              <div className="text-sm bg-gray-50 p-3 rounded">
                {deliveryAddress ? (
                  <>
                    <p>{deliveryAddress.street || "[No Street]"}</p>
                    <p>{deliveryAddress.subdivision || "[No Subdivision]"}</p>
                    {deliveryAddress.additionalAddressLine && (
                      <p>{deliveryAddress.additionalAddressLine}</p>
                    )}
                    <p>
                      {deliveryAddress.cityMunicipality || "[No City]"},{" "}
                      {deliveryAddress.province || "[No Province]"}{" "}
                      {deliveryAddress.postalCode || "[No Postal Code]"}
                    </p>
                    <p>{deliveryAddress.country || "[No Country]"}</p>
                  </>
                ) : (
                  <p className="text-red-600 italic">
                    Delivery address has not been provided.
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Terms and Conditions</h3>
              <div className="text-sm space-y-2">
                <p>
                  1. Standard prefab construction terms and conditions apply.
                </p>
                <p>
                  2. Estimated delivery time: 8-12 weeks from order
                  confirmation.
                </p>
                <p>3. Installation will be scheduled upon delivery.</p>
                <p>4. All payments must be completed before delivery.</p>
                <p>5. Warranty terms as specified in product documentation.</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Customer Signature</h3>
              <div className="flex items-center gap-4">
                <img
                  src={contractInfo.signature}
                  alt="Customer Signature"
                  className="border border-gray-300 rounded max-w-48 bg-white"
                />
                <div className="text-sm">
                  <p>
                    <strong>Signed by:</strong> {customerInfo.firstName}{" "}
                    {customerInfo.lastName}
                  </p>
                  <p>
                    <strong>Date:</strong> {getSignatureDate()}
                  </p>
                  <p>
                    <strong>Time:</strong> {getSignatureTime()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ContractDocument;
