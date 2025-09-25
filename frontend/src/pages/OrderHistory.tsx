import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Package, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useUserOrders } from "@/hooks/useUserOrders"; // Assuming hook is in src/hooks/
import { OrderHistoryCard } from "./page-components/order-history/OrderHistoryCard";

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  // Use the custom hook to fetch data
  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useUserOrders(user?._id, token);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-20">
          <Loader2 className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold mb-2">Loading Your Orders...</h2>
          <p className="text-gray-600">Please wait a moment.</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-20 bg-red-50 rounded-lg">
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
        <div className="text-center py-20">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Order History</h2>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet.
          </p>
          <Button onClick={() => navigate("/shop")}>Start Shopping</Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {orders.map((order) => (
          <OrderHistoryCard key={order._id} order={order} />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container py-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Order History</h1>
          <Button variant="outline" onClick={() => navigate("/shop")}>
            Continue Shopping
          </Button>
        </div>
        {renderContent()}
      </div>
    </Layout>
  );
};

export default OrderHistory;
