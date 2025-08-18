// frontend/src/pages/OrderTracking.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Package,
  Truck,
  Clock,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { getOrderStatusColor, getOrderStatusProgress } from "@/data/orders";
import { products } from "@/data/products";
// Import the unified useAuth hook
import { useAuth } from "@/context/AuthContext";
import { useOrderUpdates } from "@/context/OrderUpdatesContext";
// Import the updated notifications component
import CustomerNotifications from "@/components/customer/CustomerNotifications";

const OrderTracking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Use the new, unified auth context
  const { isAuthenticated } = useAuth();
  const { getOrderById } = useOrderUpdates();

  // NOTE: This component assumes `useOrderUpdates` and `products` data sources are correctly set up.
  // The primary fix here is updating the authentication context hook.
  const order = getOrderById(id || "");
  const product = order
    ? products.find((p) => p.id === order.products[0]?.productId)
    : null;

  if (!order) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="mb-6">The order you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/order-history")}>
            View Order History
          </Button>
        </div>
      </Layout>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusSteps = [
    { key: "Pending", label: "Order Placed", icon: Package },
    { key: "In Review", label: "Under Review", icon: Clock },
    { key: "In Production", label: "In Production", icon: Package },
    { key: "Ready for Delivery", label: "Ready for Delivery", icon: Truck },
    { key: "Delivered", label: "Delivered", icon: CheckCircle },
  ];

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.key === order.status
  );
  const progress = getOrderStatusProgress(order.status);

  return (
    <Layout>
      <div className="container py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Order Tracking</h1>
            <p className="text-gray-600">Order #{order.id}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* The CustomerNotifications component now handles its own visibility based on auth state. */}
            <CustomerNotifications />
            <Button
              variant="outline"
              onClick={() => navigate("/order-history")}
            >
              Order History
            </Button>
            <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tracking Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Status */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Current Status</CardTitle>
                  <Badge className={getOrderStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={progress} className="h-3" />

                  {/* Status Timeline */}
                  <div className="flex justify-between items-center pt-4">
                    {statusSteps.map((step, index) => {
                      const isCompleted = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;
                      const Icon = step.icon;

                      return (
                        <div
                          key={step.key}
                          className="flex flex-col items-center text-center w-1/5"
                        >
                          <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 mb-2 ${
                              isCompleted
                                ? "bg-green-100 border-green-500 text-green-600"
                                : isCurrent
                                ? "bg-blue-100 border-blue-500 text-blue-600"
                                : "bg-gray-100 border-gray-300 text-gray-400"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <p
                            className={`text-xs font-medium ${
                              isCompleted || isCurrent
                                ? "text-gray-900"
                                : "text-gray-500"
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {order.estimatedDelivery && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Estimated Delivery:</strong>{" "}
                        {formatDate(order.estimatedDelivery)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tracking Updates */}
            <Card>
              <CardHeader>
                <CardTitle>Tracking Updates</CardTitle>
              </CardHeader>
              <CardContent>
                {order.trackingUpdates && order.trackingUpdates.length > 0 ? (
                  <div className="space-y-4">
                    {order.trackingUpdates
                      .slice()
                      .reverse()
                      .map((update, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{update.status}</p>
                                <p className="text-sm text-gray-600">
                                  {update.message}
                                </p>
                              </div>
                              <p className="text-xs text-gray-500">
                                {formatDate(update.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No tracking updates available yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Details Sidebar */}
          <div className="space-y-6">
            {/* Product Information */}
            {product && (
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600">
                        {product.squareFeet} sq ft
                      </p>
                      <p className="text-blue-600 font-semibold">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Summary */}
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
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{order.products[0]?.quantity || 1}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total:</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
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
                    <span>
                      Masterson Ave., Upper Balulang, Cagayan de Oro City
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderTracking;
