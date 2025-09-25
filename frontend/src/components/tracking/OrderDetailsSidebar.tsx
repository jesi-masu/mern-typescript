import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, User, Landmark } from "lucide-react"; // Added User and Landmark icons
import { OrderDetail } from "../../types/order";

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

// --- [NEW] Helper function to format the full address ---
const formatFullAddress = (
  address: OrderDetail["customerInfo"]["deliveryAddress"]
) => {
  if (!address) return "Address not available";
  // This array filters out any empty parts (like a missing street or subdivision)
  // to avoid awkward commas like ", , City"
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
      {/* --- Product Details Card --- */}
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <img
              src={
                order.productId.image ||
                "https://placehold.co/400x300/E2E8F0/4A5568?text=No+Image"
              }
              alt={order.productId.productName}
              className="w-full h-32 object-cover rounded"
            />
            <div>
              <h3 className="font-medium">{order.productId.productName}</h3>
              <p className="text-sm text-gray-600">
                {order.productId.squareFeet} sq ft
              </p>
              <p className="text-blue-600 font-semibold">
                {formatPrice(order.productId.productPrice)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- [NEW] Customer & Delivery Details Card --- */}
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

      {/* --- Order Summary Card --- */}
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

      {/* --- Contact/Help Card --- */}
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
