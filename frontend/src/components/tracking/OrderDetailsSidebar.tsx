import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Phone,
  Mail,
  User,
  Landmark,
  ListTree,
  CreditCard,
  Clock,
  ListChecks,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Order } from "../../types/order";
import { Separator } from "../ui/separator";
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
          <div className="space-y-3">
            {order.products.map((item, index) => {
              const hasParts =
                item.productId.productParts &&
                item.productId.productParts.length > 0;

              return (
                <div key={item.productId._id}>
                  <div className="flex gap-3">
                    <img
                      src={
                        item.productId.image ||
                        "https://placehold.co/400x300/E2E8F0/4A5568?text=No+Image"
                      }
                      alt={item.productId.productName}
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h3
                        className="font-semibold text-base truncate"
                        title={item.productId.productName}
                      >
                        {item.productId.productName}
                      </h3>
                      {item.productId.productShortDescription && (
                        <p
                          className="text-xs text-gray-500 truncate"
                          title={item.productId.productShortDescription}
                        >
                          {item.productId.productShortDescription}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {" "}
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-blue-600 font-semibold text-sm mt-0.5">
                        {" "}
                        {formatPrice(item.productId.productPrice)}
                      </p>
                    </div>
                  </div>

                  {hasParts && (
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full mt-2"
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
                    <Separator className="mt-3" />
                  )}
                </div>
              );
            })}
          </div>

          <Separator className="my-4" />

          {/* --- Order Summary Section --- */}
          <div className="space-y-3">
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

      {/* ✏️ 1. MERGED "Order Summary" AND "Customer & Delivery" CARD */}
      <Card>
        <CardHeader>
          <CardTitle>Order & Customer Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {/* --- Customer Info Section --- */}
          {customer && (
            <div className="space-y-3">
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
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>{customer.email}</span>
              </div>
            </div>
          )}

          {/* --- Delivery Info Section --- */}
          {address && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Delivery Address
                  </p>
                  <span className="font-medium">
                    {formatFullAddress(address)}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Landmark className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Landmark/Notes
                  </p>
                  <span className="font-medium">
                    {address.additionalAddressLine || "No landmark provided"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Separator className="my-4" />

          {/* --- Payment Details Section --- */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <ListChecks className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Payment Method</p>
                <Badge
                  variant="outline"
                  className="capitalize text-xs font-medium"
                >
                  {order.paymentInfo.paymentMethod}
                </Badge>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Payment Type</p>
                <Badge
                  variant="outline"
                  className="uppercase text-xs font-medium"
                >
                  {order.paymentInfo.paymentMode}
                </Badge>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Payment Timing</p>
                <Badge
                  variant="outline"
                  className="capitalize text-xs font-medium"
                >
                  Pay {order.paymentInfo.paymentTiming}
                </Badge>
              </div>
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
