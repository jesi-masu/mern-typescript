import React, { useState } from "react"; // ✏️ 1. IMPORT 'useState'
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Package, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
// ✏️ 2. IMPORT 'useCancelReservation' (for the modal)
import { useUserOrders, useCancelReservation } from "@/hooks/useUserOrders";
import { OrderHistoryCard } from "./page-components/order-history/OrderHistoryCard";
// ✏️ 3. IMPORT THE MODAL COMPONENT
import ConfirmationModal from "@/components/checkout/ConfirmationModal";

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  // ✏️ 4. ADD STATE FOR THE MODAL
  const [modalState, setModalState] = useState({
    isOpen: false,
    orderIdToCancel: null as string | null,
  });

  // This is your existing hook to get the orders
  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useUserOrders(user?._id, token);

  // ✏️ 5. BRING THE CANCELLATION HOOK HERE (from the card)
  const { mutate: cancelReservation, isPending: isCancelling } =
    useCancelReservation();

  // ✏️ 6. CREATE HANDLERS TO CONTROL THE MODAL
  const handleOpenCancelModal = (orderId: string) => {
    setModalState({ isOpen: true, orderIdToCancel: orderId });
  };

  const handleCloseCancelModal = () => {
    setModalState({ isOpen: false, orderIdToCancel: null });
  };

  const handleConfirmCancel = () => {
    if (modalState.orderIdToCancel) {
      cancelReservation(modalState.orderIdToCancel, {
        onSuccess: () => {
          handleCloseCancelModal(); // Close the modal after success
        },
      });
    }
  };
  // --- End of new logic ---

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
        // ✏️ 7. ADDED 'animate-fadeIn'
        <div className="text-center py-20 bg-red-50 rounded-lg animate-fadeIn">
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
        // ✏️ 8. ADDED 'animate-fadeIn'
        <div className="text-center py-20 animate-fadeIn">
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
        {/* ✏️ 9. ADDED STAGGERED ANIMATION WRAPPER */}
        {orders.map((order, index) => (
          <div
            key={order._id}
            className="opacity-0 animate-fadeIn"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: "forwards",
            }}
          >
            <OrderHistoryCard
              order={order}
              // ✏️ 10. PASS THE MODAL TRIGGER FUNCTION AS A PROP
              onCancelClick={handleOpenCancelModal}
            />
          </div>
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

      {/* ✏️ 11. RENDER THE MODAL AT THE PAGE LEVEL */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
        isSubmitting={isCancelling}
      />
    </Layout>
  );
};

export default OrderHistory;
