import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, User, Landmark, ListTree } from "lucide-react"; // ✏️ 1. IMPORT 'ListTree'
import { Order } from "../../types/order";
import { Separator } from "../ui/separator";
// ✏️ 2. IMPORT 'Accordion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface OrderDetailsSidebarProps {
  order: Order;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    currencyDisplay: "symbol",
  }).format(price);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatFullAddress = (
  address: Order["customerInfo"]["deliveryAddress"]
) => {
  if (!address) return "Address not available";
  return [
    address.street,
    address.subdivision,
    address.cityMunicipality,
    address.province,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
};

export const OrderDetailsSidebar: React.FC<OrderDetailsSidebarProps> = ({
  order,
}) => {
  const customer = order.customerInfo;
  const address = order.customerInfo.deliveryAddress;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Products in this Order</CardTitle>
        </CardHeader>
        <CardContent>
          {/* ✏️ 1. Reduced vertical spacing between products */}
          <div className="space-y-3">
            {order.products.map((item, index) => {
              const hasParts =
                item.productId.productParts &&
                item.productId.productParts.length > 0;

              return (
                <div key={item.productId._id}>
                  {/* ✏️ 2. Reduced gap between image and text */}
                  <div className="flex gap-3">
                    <img
                      src={
                        item.productId.image ||
                        "https://placehold.co/400x300/E2E8F0/4A5568?text=No+Image"
                      }
                      alt={item.productId.productName}
                      // ✏️ 3. Made image smaller
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h3
                        className="font-semibold text-base truncate" // ✏️ 4. Made title 'text-base'
                        title={item.productId.productName}
                      >
                        {item.productId.productName}
                      </h3>
                      {item.productId.productShortDescription && (
                        <p
                          // ✏️ 5. Made description 'text-xs'
                          className="text-xs text-gray-500 truncate"
                          title={item.productId.productShortDescription}
                        >
                          {item.productId.productShortDescription}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {" "}
                        {/* ✏️ 6. Made quantity 'text-xs' */}
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-blue-600 font-semibold text-sm mt-0.5">
                        {" "}
                        {/* Kept price at text-sm to stand out */}
                        {formatPrice(item.productId.productPrice)}
                      </p>
                    </div>
                  </div>

                  {/* (No changes to the "Parts" accordion logic) */}
                  {hasParts && (
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full mt-2" // ✏️ 7. Reduced top margin
                    >
                      <AccordionItem value="item-1" className="border-b-0">
                        <AccordionTrigger className="text-xs font-medium py-1.5 text-gray-600 hover:no-underline">
                          <div className="flex items-center gap-2">
                            <ListTree className="h-3.5 w-3.5" />
                            <span>
                              View Included Parts (
                              {item.productId.productParts!.length})
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="py-2 space-y-3 max-h-48 overflow-y-auto pr-2">
                            {item.productId.productParts!.map((part) => (
                              <div
                                key={part._id}
                                className="flex items-center gap-2.5"
                              >
                                <img
                                  src={part.image}
                                  alt={part.name}
                                  className="h-10 w-10 rounded object-cover flex-shrink-0 border"
                                />
                                <div className="flex-1">
                                  <span className="font-medium text-gray-800 text-xs">
                                    {part.name}
                                  </span>
                                  <p className="text-gray-500 text-xs">
                                    Quantity: {part.quantity}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}

                  {index < order.products.length - 1 && (
                    <Separator className="mt-3" /> // ✏️ 8. Reduced separator margin
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer & Delivery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {address && (
            <>
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="font-medium">
                  {address.firstName} {address.lastName}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>{address.phone}</span>
              </div>
            </>
          )}

          {customer && (
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span>{customer.email}</span>
            </div>
          )}

          {address && (
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>{formatFullAddress(address)}</span>
              </div>
              <div className="flex items-start gap-3">
                <Landmark className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>
                  {address.additionalAddressLine || "No landmark provided"}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Order Date:</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Total:</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>0997-951-7188</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>camco.prefab3@gmail.com</span>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <span>Masterson Ave., Upper Balulang, Cagayan de Oro City</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
