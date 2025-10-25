// frontend/src/components/tracking/OrderDetailsSidebar.tsx
// (This is the complete, final file)

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, User, Landmark } from "lucide-react";
import { Order } from "../../types/order"; // This imports the correct, new Order type
import { Separator } from "../ui/separator";

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

// Updated to use the correct fields
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
  // Read from the correct nested locations
  const customer = order.customerInfo; // This is the billing/account info
  const address = order.customerInfo.deliveryAddress; // This is the recipient/delivery info

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Products in this Order</CardTitle>
        </CardHeader>
        <CardContent>
          {/* (Product list is correct) */}
          <div className="space-y-4">
            {order.products.map((item, index) => (
              <div key={item.productId._id}>
                <div className="flex gap-4">
                  <img
                    src={
                      item.productId.image ||
                      "https://placehold.co/400x300/E2E8F0/4A5568?text=No+Image"
                    }
                    alt={item.productId.productName}
                    className="w-20 h-20 object-cover rounded flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3
                      className="font-medium truncate"
                      title={item.productId.productName}
                    >
                      {item.productId.productName}
                    </h3>
                    {item.productId.productShortDescription && (
                      <p
                        className="text-sm text-gray-600 truncate"
                        title={item.productId.productShortDescription}
                      >
                        {item.productId.productShortDescription}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-blue-600 font-semibold text-sm">
                      {formatPrice(item.productId.productPrice)} each
                    </p>
                  </div>
                </div>
                {index < order.products.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer & Delivery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {/* Recipient's info (from 'address' object) */}
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
          {/* Account email (from 'customer' object) */}
          {customer && (
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span>{customer.email}</span>
            </div>
          )}
          {/* Delivery address details (from 'address' object) */}
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
        {/* (Order Summary is correct) */}
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
        {/* (Need Help? is correct) */}
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
