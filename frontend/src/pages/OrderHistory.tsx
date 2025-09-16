import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Package, Calendar, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// --- TYPE DEFINITIONS ---

// Added PaymentStatus type
type PaymentStatus =
  | "Pending"
  | "50% Complete Paid"
  | "90% Complete Paid"
  | "100% Complete Paid";

// Updated Order type to include paymentStatus
interface Order {
  _id: string;
  orderStatus:
    | "Pending"
    | "Processing"
    | "In Production"
    | "Shipped"
    | "Delivered"
    | "Completed"
    | "Cancelled";
  paymentStatus: PaymentStatus; // Assumes the API now sends this field
  totalAmount: number;
  createdAt: string;
  productId: {
    _id: string;
    productName: string;
    image?: string;
  };
}

// --- API FETCHING FUNCTION ---
const fetchUserOrders = async (token: string | null): Promise<Order[]> => {
  if (!token) {
    throw new Error("You must be logged in to view your orders.");
  }
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch order history.");
  }
  return response.json();
};

const OrderHistory = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useQuery<Order[]>({
    queryKey: ["userOrders"],
    queryFn: () => fetchUserOrders(token),
    enabled: !!token,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getOrderStatusColor = (status: Order["orderStatus"]) => {
    const colorMap: Record<Order["orderStatus"], string> = {
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

  // --- NEW: Helper function for payment status colors ---
  const getPaymentStatusColor = (status: PaymentStatus) => {
    const colorMap: Record<PaymentStatus, string> = {
      Pending: "bg-yellow-100 text-yellow-800",
      "50% Complete Paid": "bg-blue-100 text-blue-800",
      "90% Complete Paid": "bg-indigo-100 text-indigo-800",
      "100% Complete Paid": "bg-green-100 text-green-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold mb-2">Loading Your Orders...</h2>
          <p className="text-gray-600">Please wait a moment.</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-red-800">
            Error Fetching Orders
          </h2>
          <p className="text-red-600 mb-6">{(error as Error).message}</p>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">
            Start shopping to see your orders here.
          </p>
          <Button onClick={() => navigate("/shop")}>Browse Products</Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Order #{order._id}</CardTitle>

                  {/* --- MODIFIED: Badges moved here for clarity --- */}
                  <div className="flex items-center flex-wrap gap-2 mt-2">
                    <Badge className={getOrderStatusColor(order.orderStatus)}>
                      Order: {order.orderStatus}
                    </Badge>
                    <Badge
                      className={getPaymentStatusColor(order.paymentStatus)}
                    >
                      Payment: {order.paymentStatus}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4" />
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-semibold">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      order.productId.image ||
                      "https://placehold.co/100x100/E2E8F0/4A5568?text=No+Image"
                    }
                    alt={order.productId.productName}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">
                      {order.productId.productName}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/order-tracking/${order._id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Track Order
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/product/${order.productId._id}`)}
                  >
                    View Product
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Order History</h1>
          <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
        </div>
        {renderContent()}
      </div>
    </Layout>
  );
};

export default OrderHistory;
