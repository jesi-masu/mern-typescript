// src/components/tracking/OrderDetailsSidebar.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, User, Landmark } from "lucide-react";
import { OrderDetail } from "../../types/order";
import { Separator } from "../ui/separator"; // Import Separator for styling

interface OrderDetailsSidebarProps {
  order: OrderDetail;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
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
  address: OrderDetail["customerInfo"]["deliveryAddress"]
) => {
  if (!address) return "Address not available";
  return [
    address.street,
    address.subdivision,
    address.cityMunicipality,
    address.province,
  ]
    .filter(Boolean)
    .join(", ");
};

export const OrderDetailsSidebar: React.FC<OrderDetailsSidebarProps> = ({
  order,
}) => {
  const customer = order.customerInfo;
  const address = customer?.deliveryAddress;

  return (
    <div className="space-y-6">
      {/* --- MODIFICATION: Updated to handle multiple products --- */}
      <Card>
        <CardHeader>
          <CardTitle>Products in this Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.products.map((item, index) => (
              <React.Fragment key={item.productId._id}>
                <div className="flex gap-4">
                  <img
                    src={
                      item.productId.image ||
                      "https://placehold.co/400x300/E2E8F0/4A5568?text=No+Image"
                    }
                    alt={item.productId.productName}
                    className="w-20 h-20 object-cover rounded flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-medium">
                      {item.productId.productName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-blue-600 font-semibold text-sm">
                      {formatPrice(item.productId.productPrice)} each
                    </p>
                  </div>
                </div>
                {/* Add a separator between items, but not after the last one */}
                {index < order.products.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* --- Customer & Delivery Details Card (No changes needed here) --- */}
      <Card>
        <CardHeader>
          <CardTitle>Customer & Delivery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {customer && (
            <>
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="font-medium">
                  {customer.firstName} {customer.lastName}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>{customer.phoneNumber}</span>
              </div>
            </>
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
                  {address.additionalAddressLine ||
                    "No landmarks or notes provided"}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- Order Summary Card (No changes needed here) --- */}
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

      {/* --- Contact/Help Card (No changes needed here) --- */}
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
