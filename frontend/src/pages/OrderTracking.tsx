import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
  Loader2,
  AlertCircle,
  Wallet,
  Percent,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import CustomerNotifications from "@/components/customer/CustomerNotifications";

// --- TYPE DEFINITIONS FOR A DETAILED ORDER ---
type PaymentStatus =
  | "Pending"
  | "50% Complete Paid"
  | "90% Complete Paid"
  | "100% Complete Paid";

interface Product {
  _id: string;
  productName: string;
  productPrice: number;
  squareFeet: number;
  image?: string;
}

interface OrderDetail {
  _id: string;
  orderStatus:
    | "Pending"
    | "Processing"
    | "In Production"
    | "Shipped"
    | "Delivered"
    | "Completed"
    | "Cancelled";
  paymentStatus: PaymentStatus;
  totalAmount: number;
  createdAt: string;
  estimatedDelivery?: string;
  trackingUpdates?: { status: string; message: string; timestamp: string }[];
  productId: Product;
}

// --- API FETCHING FUNCTION ---
const fetchOrderById = async (
  orderId: string,
  token: string | null
): Promise<OrderDetail> => {
  if (!token) {
    throw new Error("You must be logged in to view order details.");
  }
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch order details.");
  }
  return response.json();
};

const OrderTracking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery<OrderDetail>({
    queryKey: ["order", id],
    queryFn: () => fetchOrderById(id!, token),
    enabled: !!id && !!token,
  });

  // --- HELPER FUNCTIONS ---
  const getOrderStatusColor = (status: OrderDetail["orderStatus"]) => {
    const colorMap: Record<OrderDetail["orderStatus"], string> = {
      Pending: "bg-yellow-100 text-yellow-800",
      Processing: "bg-blue-100 text-blue-800",
      "In Production": "bg-purple-100 text-purple-800",
      Shipped: "bg-indigo-100 text-indigo-800",
      Delivered: "bg-green-100 text-green-800",
      Completed: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    const colorMap: Record<PaymentStatus, string> = {
      Pending: "bg-yellow-100 text-yellow-800",
      "50% Complete Paid": "bg-blue-100 text-blue-800",
      "90% Complete Paid": "bg-indigo-100 text-indigo-800",
      "100% Complete Paid": "bg-green-100 text-green-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  const getOrderStatusProgress = (status: OrderDetail["orderStatus"]) => {
    const progressMap: Record<OrderDetail["orderStatus"], number> = {
      Pending: 10,
      Processing: 30,
      "In Production": 50,
      Shipped: 75,
      Delivered: 100,
      Completed: 100,
      Cancelled: 0,
    };
    return progressMap[status] || 0;
  };

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --- PAYMENT CALCULATION ---
  const getPaymentDetails = (
    status: PaymentStatus,
    totalAmount: number
  ): { paidAmount: number; remainingAmount: number; percentage: number } => {
    let percentage = 0;
    if (status === "50% Complete Paid") percentage = 50;
    else if (status === "90% Complete Paid") percentage = 90;
    else if (status === "100% Complete Paid") percentage = 100;

    const paidAmount = (totalAmount * percentage) / 100;
    const remainingAmount = totalAmount - paidAmount;

    return { paidAmount, remainingAmount, percentage };
  };

  // --- STEP DEFINITIONS ---
  const orderStatusSteps = [
    { key: "Pending", label: "Order Placed", icon: Package },
    { key: "Processing", label: "Processing", icon: Clock },
    { key: "In Production", label: "In Production", icon: Package },
    { key: "Shipped", label: "Shipped", icon: Truck },
    { key: "Completed", label: "Completed", icon: CheckCircle },
  ];

  const paymentStatusSteps = [
    { key: "Pending", label: "Pending", icon: Wallet },
    { key: "50% Complete Paid", label: "50% Paid", icon: Percent },
    { key: "90% Complete Paid", label: "90% Paid", icon: Percent },
    { key: "100% Complete Paid", label: "Fully Paid", icon: CheckCircle },
  ];

  // --- LOADING, ERROR, AND NOT-FOUND STATES ---
  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Loading Order Details...</h1>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="container py-12 text-center bg-red-50 p-8 rounded-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-800 mb-4">
            Could Not Load Order
          </h1>
          <p className="mb-6 text-red-600">{(error as Error).message}</p>
          <Button onClick={() => navigate("/order-history")}>
            Return to Order History
          </Button>
        </div>
      </Layout>
    );
  }

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

  const currentOrderStatusIndex = orderStatusSteps.findIndex(
    (step) => step.key === order.orderStatus
  );
  const orderProgress = getOrderStatusProgress(order.orderStatus);

  const currentPaymentStatusIndex = paymentStatusSteps.findIndex(
    (step) => step.key === order.paymentStatus
  );

  const { remainingAmount, percentage } = getPaymentDetails(
    order.paymentStatus,
    order.totalAmount
  );

  return (
    <Layout>
      <div className="container py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Order Tracking</h1>
            <p className="text-gray-600">Order #{order._id}</p>
          </div>
          <div className="flex items-center gap-3">
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
          <div className="lg:col-span-2 space-y-6">
            {/* --- Order Status Card --- */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Order Status</CardTitle>
                  <Badge className={getOrderStatusColor(order.orderStatus)}>
                    {order.orderStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={orderProgress} className="h-3" />
                  <div className="flex justify-between items-center pt-4">
                    {orderStatusSteps.map((step, index) => {
                      const isCompleted = index < currentOrderStatusIndex;
                      const isCurrent = index === currentOrderStatusIndex;
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

            {/* --- Payment Status Indicator Card --- */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Payment Status</CardTitle>
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pt-4">
                    {paymentStatusSteps.map((step, index) => {
                      const isCompleted = index < currentPaymentStatusIndex;
                      const isCurrent = index === currentPaymentStatusIndex;
                      const Icon = step.icon;
                      return (
                        <div
                          key={step.key}
                          className="flex flex-col items-center text-center w-1/4"
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
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Payment Progress:</span>
                      <span className="font-semibold text-blue-600">
                        {percentage}%
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600">Remaining Balance:</span>
                      <span className="font-semibold text-red-600">
                        {formatPrice(remainingAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tracking Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  No real-time tracking updates available yet.
                </p>
              </CardContent>
            </Card>
          </div>

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
                    <h3 className="font-medium">
                      {order.productId.productName}
                    </h3>
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
