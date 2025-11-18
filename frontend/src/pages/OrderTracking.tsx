// src/pages/OrderTracking.tsx
import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import CustomerNotifications from "@/components/customer/CustomerNotifications";
import { Order } from "@/types/order";
import { OrderStatusCard } from "@/components/tracking/OrderStatusCard";
import { PaymentStatusCard } from "@/components/tracking/PaymentStatusCard";
import { OrderDetailsSidebar } from "@/components/tracking/OrderDetailsSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderHistoryLog } from "@/components/tracking/OrderHistoryLog";

// --- API FETCHING FUNCTION (No changes needed here) ---
const fetchOrderById = async (
  orderId: string,
  token: string | null
): Promise<Order> => {
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
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch order details.");
  }
  return response.json();
};

const OrderTracking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const location = useLocation();

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery<Order>({
    queryKey: ["order", id],
    queryFn: () => fetchOrderById(id!, token),
    enabled: !!id && !!token,
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
  });

  // ✏️ 3. PARSE THE URL AND HANDLE SCROLLING
  const queryParams = new URLSearchParams(location.search);
  const autoOpenPayment = queryParams.get("action") === "pay";
  const hash = location.hash;

  useEffect(() => {
    // This effect runs when the page loads or the hash changes
    if (hash === "#payment-stages") {
      // Give the page a tiny moment to render, then scroll
      setTimeout(() => {
        const element = document.getElementById("payment-stages");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100); // 100ms delay
    }
  }, [hash]); // Only re-run if the hash changes

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
        {/* ✏️ 1. Added 'animate-fadeIn' */}
        <div className="container py-12 text-center bg-red-50 p-8 rounded-lg animate-fadeIn">
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
        {/* ✏️ 2. Added 'animate-fadeIn' */}
        <div className="container py-12 text-center animate-fadeIn">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="mb-6">The order you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/order-history")}>
            View Order History
          </Button>
        </div>
      </Layout>
    );
  }

  // ✏️ 1. THIS IS THE MISSING LINE!
  // This flattens the receipts object into a single array
  const allReceipts = [
    ...(order.paymentInfo?.paymentReceipts?.initial || []),
    ...(order.paymentInfo?.paymentReceipts?.pre_delivery || []),
    ...(order.paymentInfo?.paymentReceipts?.final || []),
  ];

  return (
    <Layout>
      {/* ✏️ 3. Added 'animate-fadeIn' to the main content wrapper */}
      <div className="container py-8 max-w-6xl animate-fadeIn">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Order Tracking</h1>
            <p className="text-gray-600">Order #{order._id}</p>
          </div>
          <div className="flex items-center gap-3">
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
            <OrderStatusCard order={order} />

            <PaymentStatusCard
              order={order!}
              autoOpenPayment={autoOpenPayment}
            />

            <OrderHistoryLog updates={order.trackingUpdates} />

            {/* This receipt logic is now correct */}
            {allReceipts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Payment Proofs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {allReceipts.map((receipt, index) => (
                      <li key={index}>
                        <a
                          href={receipt}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Receipt #{index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="space-y-6">
            <OrderDetailsSidebar order={order} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderTracking;
