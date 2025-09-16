import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  MapPin,
  Bell,
  Eye,
  Calendar,
  MessageSquare,
  User,
  LogOut,
  ShoppingCart,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import CustomerShoppingTab from "./CustomerShoppingTab";

// --- TYPE DEFINITIONS ---

// NEW: Added PaymentStatus type
type PaymentStatus =
  | "Pending Payment"
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

// --- API fetching function for user orders ---
const fetchUserOrders = async (token: string | null): Promise<Order[]> => {
  if (!token) throw new Error("Authentication token not found.");

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch orders.");
  }

  return response.json();
};

const CustomerDashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const [activeTab, setActiveTab] = useState("orders");

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery<Order[]>({
    queryKey: ["userOrders", user?._id],
    queryFn: () => fetchUserOrders(token),
    enabled: !!user,
  });

  // MOCK DATA
  const notifications: any[] = [];
  const adminMessages: any[] = [];
  const unreadNotifications = 0;
  const unreadMessages = 0;

  const cartItemsCount = getTotalItems();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
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
      "Pending Payment": "bg-yellow-100 text-yellow-800",
      "50% Complete Paid": "bg-blue-100 text-blue-800",
      "90% Complete Paid": "bg-indigo-100 text-indigo-800",
      "100% Complete Paid": "bg-green-100 text-green-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Customer Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/shop")}>
            Continue Shopping
          </Button>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="shopping" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Shopping
            {cartItemsCount > 0 && (
              <Badge
                variant="default"
                className="ml-1 h-5 w-5 text-xs p-0 flex items-center justify-center bg-blue-600"
              >
                {cartItemsCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Notifications
            {unreadNotifications > 0 && (
              <Badge
                variant="destructive"
                className="ml-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
              >
                {unreadNotifications}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages
            {unreadMessages > 0 && (
              <Badge
                variant="destructive"
                className="ml-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
              >
                {unreadMessages}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : isError ? (
            <div className="flex flex-col justify-center items-center h-64 bg-red-50 text-red-700 rounded-lg p-4">
              <AlertCircle className="h-8 w-8 mb-2" />
              <h3 className="text-lg font-semibold">Failed to Load Orders</h3>
              <p>There was an error fetching your order data.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Orders
                        </p>
                        <p className="text-2xl font-bold">{orders.length}</p>
                      </div>
                      <Package className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          In Progress
                        </p>
                        <p className="text-2xl font-bold">
                          {
                            orders.filter(
                              (o) =>
                                ![
                                  "Delivered",
                                  "Completed",
                                  "Cancelled",
                                ].includes(o.orderStatus)
                            ).length
                          }
                        </p>
                      </div>
                      <MapPin className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Completed
                        </p>
                        <p className="text-2xl font-bold">
                          {
                            orders.filter((o) =>
                              ["Delivered", "Completed"].includes(o.orderStatus)
                            ).length
                          }
                        </p>
                      </div>
                      <Package className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">
                      No orders yet
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Start shopping to see your orders here.
                    </p>
                    <Button onClick={() => navigate("/shop")}>
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  orders.map((order) => (
                    <Card key={order._id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center space-x-4">
                            {order.productId.image && (
                              <img
                                src={order.productId.image}
                                alt={order.productId.productName}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            <div>
                              <h3 className="font-semibold">
                                Order #{order._id}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {order.productId.productName}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex-shrink-0 w-full sm:w-auto text-right">
                            {/* --- MODIFIED: Badges are now stacked here --- */}
                            <div className="flex flex-col items-end gap-2 mb-2">
                              <Badge
                                className={getOrderStatusColor(
                                  order.orderStatus
                                )}
                              >
                                Order: {order.orderStatus}
                              </Badge>
                              <Badge
                                className={getPaymentStatusColor(
                                  order.paymentStatus
                                )}
                              >
                                Payment: {order.paymentStatus}
                              </Badge>
                            </div>
                            <p className="text-lg font-semibold flex items-center justify-end gap-1">
                              {formatPrice(order.totalAmount)}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 w-full sm:w-auto"
                              onClick={() =>
                                navigate(`/order-tracking/${order._id}`)
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Track Order
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="shopping" className="space-y-6">
          <CustomerShoppingTab />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="text-center py-12 text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-4" />
            <p>No new notifications.</p>
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4" />
            <p>No new messages.</p>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user ? (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        First Name
                      </label>
                      <p className="text-lg">{user.firstName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Last Name
                      </label>
                      <p className="text-lg">{user.lastName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Email
                      </label>
                      <p className="text-lg">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Customer ID
                      </label>
                      <p className="text-lg">{user._id}</p>
                    </div>
                    {user.phoneNumber && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Phone Number
                        </label>
                        <p className="text-lg">{user.phoneNumber}</p>
                      </div>
                    )}
                    {user.address?.street && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Street
                        </label>
                        <p className="text-lg">{user.address.street}</p>
                      </div>
                    )}
                    {user.address?.barangaySubdivision && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Barangay/Subdivision
                        </label>
                        <p className="text-lg">
                          {user.address.barangaySubdivision}
                        </p>
                      </div>
                    )}
                    {user.address?.city && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          City
                        </label>
                        <p className="text-lg">{user.address.city}</p>
                      </div>
                    )}
                    {user.address?.province && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Province
                        </label>
                        <p className="text-lg">{user.address.province}</p>
                      </div>
                    )}
                    {user.address?.postalCode && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Postal Code
                        </label>
                        <p className="text-lg">{user.address.postalCode}</p>
                      </div>
                    )}
                    {user.address?.country && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Country
                        </label>
                        <p className="text-lg">{user.address.country}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p>Could not load user profile.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDashboard;
