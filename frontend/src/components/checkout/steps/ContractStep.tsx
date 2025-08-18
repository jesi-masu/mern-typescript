
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FileText, User, Package, Eye, EyeOff, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { ContractInfo, CustomerInfo } from "@/types/checkout";
import { Product } from "@/data/products";
import SignaturePad from "@/components/contract/SignaturePad";

interface ContractStepProps {
  contractInfo: ContractInfo;
  onChange: (info: Partial<ContractInfo>) => void;
  customerInfo: CustomerInfo;
  product: Product;
}

const ContractStep: React.FC<ContractStepProps> = ({ 
  contractInfo, 
  onChange, 
  customerInfo, 
  product 
}) => {
  const [showContract, setShowContract] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSignatureSave = (signature: string) => {
    onChange({ signature });
    setShowContract(true);
  };

  const isContractComplete = contractInfo.signature && contractInfo.agreedToTerms;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">Contract & Finalization</h3>
        <p className="text-gray-600">Review your order details and complete the digital signing process</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4">
        <div className={`flex items-center space-x-2 ${contractInfo.agreedToTerms ? 'text-green-600' : 'text-gray-400'}`}>
          {contractInfo.agreedToTerms ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">Terms Agreed</span>
        </div>
        <div className="h-px w-8 bg-gray-300"></div>
        <div className={`flex items-center space-x-2 ${contractInfo.signature ? 'text-green-600' : 'text-gray-400'}`}>
          {contractInfo.signature ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">Digitally Signed</span>
        </div>
      </div>
      
      {/* Order Summary */}
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
                <p className="font-semibold text-gray-900">{customerInfo.firstName} {customerInfo.lastName}</p>
                <p className="text-sm text-gray-600">{customerInfo.email}</p>
                <p className="text-sm text-gray-600">{customerInfo.phone}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Package className="h-6 w-6 text-gray-500" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{product.name}</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(product.price)}</p>
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
                <p>{customerInfo.city}, {customerInfo.state} {customerInfo.postalCode}</p>
                <p>{customerInfo.country}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms & Conditions */}
      <Card className="border-2 border-gray-100">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="text-gray-900">Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Contract Terms</h4>
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
              <label htmlFor="terms" className="text-sm text-blue-900 cursor-pointer">
                <span className="font-medium">I acknowledge and agree</span> to the terms and conditions stated above, 
                and I understand that my digital signature will be legally binding.
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Digital Signature Section */}
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
                <span className="text-sm font-medium text-green-800">Signature Captured</span>
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

      {/* Contract Document View */}
      {contractInfo.signature && (
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
                {showContract ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showContract ? 'Hide' : 'View'} Contract
              </Button>
            </CardTitle>
          </CardHeader>
          {showContract && (
            <CardContent>
              <div className="bg-white p-6 rounded-lg border space-y-6">
                <div className="text-center border-b pb-4">
                  <h2 className="text-xl font-bold">PREFAB CONSTRUCTION CONTRACT</h2>
                  <p className="text-sm text-gray-600 mt-2">Contract No: PC-{Date.now()}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Customer Information</h3>
                    <div className="text-sm space-y-1">
                      <p><strong>Name:</strong> {customerInfo.firstName} {customerInfo.lastName}</p>
                      <p><strong>Email:</strong> {customerInfo.email}</p>
                      <p><strong>Phone:</strong> {customerInfo.phone}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Product Details</h3>
                    <div className="text-sm space-y-1">
                      <p><strong>Product:</strong> {product.name}</p>
                      <p><strong>Price:</strong> {formatCurrency(product.price)}</p>
                      <p><strong>Contract Date:</strong> {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Delivery Address</h3>
                  <div className="text-sm bg-gray-50 p-3 rounded">
                    {customerInfo.address1}<br />
                    {customerInfo.address2 && <>{customerInfo.address2}<br /></>}
                    {customerInfo.city}, {customerInfo.state} {customerInfo.postalCode}<br />
                    {customerInfo.country}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Terms and Conditions</h3>
                  <div className="text-sm space-y-2">
                    <p>1. <strong>Delivery Timeline:</strong> 8-12 weeks from order confirmation</p>
                    <p>2. <strong>Payment Terms:</strong> Full payment required before delivery</p>
                    <p>3. <strong>Installation:</strong> Professional installation included</p>
                    <p>4. <strong>Warranty:</strong> Standard manufacturer warranty applies</p>
                    <p>5. <strong>Modifications:</strong> Any changes must be agreed upon in writing</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Customer Signature</h3>
                  <div className="flex items-center gap-4">
                    <img 
                      src={contractInfo.signature} 
                      alt="Customer Signature" 
                      className="border border-gray-300 rounded max-w-48"
                    />
                    <div className="text-sm">
                      <p><strong>Signed by:</strong> {customerInfo.firstName} {customerInfo.lastName}</p>
                      <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Completion Status */}
      {isContractComplete && (
        <Card className="border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-3 text-green-800">
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-semibold">Contract Ready for Finalization</span>
            </div>
            <p className="text-center text-sm text-green-700 mt-2">
              All requirements have been met. You may now proceed to place your order.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContractStep;
