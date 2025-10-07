import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Separator } from "../../ui/separator";
import { Badge } from "../../ui/badge";
import {
  FileText,
  User,
  Package,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { ContractInfo, CustomerInfo } from "../../../types/checkout";
import { CartItem } from "../../../context/CartContext";
import { formatPrice } from "../../../lib/formatters";
import SignaturePad from "../../contract/SignaturePad";

interface ContractStepProps {
  contractInfo: ContractInfo;
  onChange: (info: Partial<ContractInfo>) => void;
  customerInfo: CustomerInfo;
  items: CartItem[];
  totalAmount: number;
}

const ContractStep: React.FC<ContractStepProps> = ({
  contractInfo,
  onChange,
  customerInfo,
  items,
  totalAmount,
}) => {
  const [showContract, setShowContract] = useState(false);

  const handleSignatureSave = (signature: string) => {
    onChange({ signature });
    setShowContract(true);
  };

  const isContractComplete =
    contractInfo.signature && contractInfo.agreedToTerms;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">
          Contract & Finalization
        </h3>
        <p className="text-gray-600">
          Review your order details and complete the digital signing process
        </p>
      </div>

      <div className="flex items-center justify-center space-x-4">
        <div
          className={`flex items-center space-x-2 ${
            contractInfo.agreedToTerms ? "text-green-600" : "text-gray-400"
          }`}
        >
          {contractInfo.agreedToTerms ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">Terms Agreed</span>
        </div>
        <div className="h-px w-8 bg-gray-300"></div>
        <div
          className={`flex items-center space-x-2 ${
            contractInfo.signature ? "text-green-600" : "text-gray-400"
          }`}
        >
          {contractInfo.signature ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">Digitally Signed</span>
        </div>
      </div>

      <Card className="border-2 border-gray-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <FileText className="h-5 w-5 text-blue-600" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <User className="h-6 w-6 text-gray-500" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {customerInfo.firstName} {customerInfo.lastName}
                </p>
                <p className="text-sm text-gray-600">{customerInfo.email}</p>
                <p className="text-sm text-gray-600">
                  {customerInfo.phoneNumber}
                </p>
              </div>
            </div>

            <Separator />

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <Package className="h-6 w-6 text-gray-500" />
                <p className="font-semibold text-gray-900">
                  Products ({items.length})
                </p>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="text-sm text-gray-700 flex justify-between"
                  >
                    <span>
                      {item.name} (x{item.quantity})
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-2 text-lg font-bold text-blue-600 flex justify-between">
                <span>Total Amount</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <Separator />

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Delivery Address
              </h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>{customerInfo.address1}</p>
                {customerInfo.address2 && <p>{customerInfo.address2}</p>}
                <p>
                  {customerInfo.city}, {customerInfo.province}{" "}
                  {customerInfo.postalCode}
                </p>
                <p>{customerInfo.country}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-gray-100">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="text-gray-900">Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">
                Contract Terms
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  Standard prefab construction terms and conditions apply
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  Estimated delivery time: 8-12 weeks from order confirmation
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  Installation will be scheduled upon delivery
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  All payments must be completed before delivery
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  Warranty terms as specified in product documentation
                </li>
              </ul>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Checkbox
                id="terms"
                checked={contractInfo.agreedToTerms}
                onCheckedChange={(checked) =>
                  onChange({ agreedToTerms: checked === true })
                }
                className="mt-1"
              />
              <label
                htmlFor="terms"
                className="text-sm text-blue-900 cursor-pointer"
              >
                <span className="font-medium">I acknowledge and agree</span> to
                the terms and conditions stated above, and I understand that my
                digital signature will be legally binding.
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Shield className="h-5 w-5" />
            Digital Signature Required
          </CardTitle>
          <p className="text-sm text-blue-700">
            Complete your contract by providing a secure digital signature
          </p>
        </CardHeader>
        <CardContent>
          {contractInfo.signature && (
            <div className="mb-6 p-4 bg-white rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Signature Captured
                </span>
                <Badge className="bg-green-100 text-green-800">Verified</Badge>
              </div>
              <img
                src={contractInfo.signature}
                alt="Digital Signature"
                className="border border-gray-300 rounded-lg max-w-xs bg-white p-2"
              />
            </div>
          )}
          <SignaturePad onSave={handleSignatureSave} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractStep;
