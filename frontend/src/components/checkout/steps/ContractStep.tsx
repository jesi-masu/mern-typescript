import React, { useState } from "react";
import { Checkbox } from "../../ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Separator } from "../../ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FileText,
  User,
  Package,
  Shield,
  CheckCircle,
  AlertCircle,
  ListTree,
} from "lucide-react";
import {
  ContractInfo,
  CustomerInfo,
  PaymentInfo,
} from "../../../types/checkout";
import { CartItem } from "../../../context/CartContext";
import { formatPrice } from "../../../lib/formatters";
import OrderInvoice from "./OrderInvoice"; // Import the invoice component

type DeliveryAddress = PaymentInfo["deliveryAddress"];

// Define the Product Part and Full Product types
type ProductPart = {
  _id: string;
  name: string;
  description?: string;
  quantity: number;
  price?: number;
  image: string;
};
type FullProduct = {
  _id: string;
  images: string[];
  productParts: ProductPart[];
} | null;

// Update the props interface
interface ContractStepProps {
  contractInfo: ContractInfo;
  onChange: (info: Partial<ContractInfo>) => void;
  customerInfo: CustomerInfo;
  deliveryAddress?: DeliveryAddress;
  items: CartItem[];
  totalAmount: number;
  fullProduct: FullProduct; // Add the new prop
}

const ContractStep: React.FC<ContractStepProps> = ({
  contractInfo,
  onChange,
  customerInfo,
  deliveryAddress,
  items,
  totalAmount,
  fullProduct, // Accept the new prop
}) => {
  const [showInvoice, setShowInvoice] = useState(true); // Show invoice by default
  const isReviewComplete = contractInfo.agreedToTerms;

  // Get parts data from the new prop
  // @ts-ignore
  const productParts: ProductPart[] = fullProduct?.productParts || [];

  return (
    <div className="space-y-8">
      {/* --- Header & Status --- */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">
          Review & Finalization
        </h3>
        <p className="text-gray-600">
          Please review your order summary, check the invoice, and agree to the
          terms.
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
      </div>

      {/* --- Terms & Conditions --- */}
      <Card className="border-2 border-gray-100">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="text-gray-900">Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
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
                the terms and conditions stated above.
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- Order Summary Card --- */}
      <Card className="border-2 border-gray-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <FileText className="h-5 w-5 text-blue-600" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Delivery Address
              </h4>
              <div className="text-sm text-blue-800 space-y-1">
                {deliveryAddress ? (
                  <>
                    <p>
                      <strong>Recipient:</strong> {deliveryAddress.firstName}{" "}
                      {deliveryAddress.lastName} ({deliveryAddress.phone})
                    </p>
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

            {/* Products & Parts Section */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <Package className="h-6 w-6 text-gray-500" />
                <p className="font-semibold text-gray-900">
                  Products ({items.length})
                </p>
              </div>

              {/* Main Product List (Compact) */}
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="text-sm text-gray-700 flex items-center justify-between gap-3"
                  >
                    {/* Image + Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 rounded-md object-cover flex-shrink-0 border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <span className="font-semibold text-gray-800 flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Accordion for Parts (Compact) */}
              <Separator className="my-4 bg-gray-200" />
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
                    <div className="flex items-center gap-2 text-gray-700">
                      <ListTree className="h-4 w-4" />
                      <span>View Included Parts ({productParts.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="py-4 space-y-3 max-h-60 overflow-y-auto pr-2">
                      {productParts.length > 0 ? (
                        productParts.map((part) => (
                          <div
                            key={part._id}
                            className="flex items-center gap-2.5"
                          >
                            <img
                              src={part.image}
                              alt={part.name}
                              className="h-10 w-10 rounded-md object-cover flex-shrink-0 border"
                            />
                            <div className="flex-1">
                              <span className="font-medium text-gray-900 text-sm">
                                {part.name}
                              </span>
                              <p className="text-gray-600 text-xs">
                                Quantity: {part.quantity}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-10">
                          {!fullProduct
                            ? "Loading..."
                            : "No detailed parts list."}
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Total Amount */}
              <div className="border-t mt-4 pt-4 text-lg font-bold text-blue-600 flex justify-between">
                <span>Total Amount</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- OrderInvoice --- */}
      <OrderInvoice
        showInvoice={showInvoice}
        setShowInvoice={setShowInvoice}
        customerInfo={customerInfo}
        deliveryAddress={deliveryAddress}
        items={items}
        totalAmount={totalAmount}
      />

      {/* --- isReviewComplete Card --- */}
      {isReviewComplete && (
        <Card className="border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-3 text-green-800">
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-semibold">
                Order Ready for Finalization
              </span>
            </div>
            <p className="text-center text-sm text-green-700 mt-2">
              All requirements have been met. You may now proceed to place your
              order.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContractStep;
