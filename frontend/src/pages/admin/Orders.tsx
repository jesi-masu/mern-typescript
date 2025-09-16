import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import OrderCard from "@/components/admin/orders/OrderCard";
import OrderDetailsModal from "@/components/admin/orders/OrderDetailsModal";
import PaymentConfirmationModal from "@/components/admin/orders/PaymentConfirmationModal";
import {
  fetchAllOrders,
  updateOrderStatusAdmin,
} from "@/services/orderService";
import { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { Search, Filter, Package, Loader2, AlertCircle } from "lucide-react";

const Orders: React.FC = () => {
  const { logActivity } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // --- Data Fetching with React Query ---
  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useQuery<Order[]>({
    queryKey: ["adminOrders"],
    queryFn: fetchAllOrders,
  });

  // --- Mutation for updating any part of an order ---
  const updateOrderMutation = useMutation({
    mutationFn: ({
      orderId,
      updateData,
    }: {
      orderId: string;
      updateData: { orderStatus?: OrderStatus; paymentStatus?: PaymentStatus };
    }) => updateOrderStatusAdmin(orderId, updateData),
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      toast({
        title: "Success",
        description: `Order #${updatedOrder._id} has been updated successfully.`,
      });
      logActivity(
        "Order Update",
        `Updated order #${updatedOrder._id}`,
        "orders"
      );
    },
    onError: (err: any) => {
      toast({
        title: "Update Failed",
        description: err.message || "Could not update the order.",
        variant: "destructive",
      });
    },
  });

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      order._id.toLowerCase().includes(searchLower) ||
      order.userId.firstName.toLowerCase().includes(searchLower) ||
      order.userId.lastName.toLowerCase().includes(searchLower) ||
      order.userId.email.toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderMutation.mutate({
      orderId,
      updateData: { orderStatus: newStatus },
    });
  };

  // UPDATED: This handler now accepts the new, specific payment status from the modal
  const handlePaymentConfirmation = (
    orderId: string,
    newStatus: PaymentStatus
  ) => {
    updateOrderMutation.mutate({
      orderId,
      updateData: { paymentStatus: newStatus },
    });
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleConfirmPayment = (order: Order) => {
    setSelectedOrder(order);
    setIsPaymentModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center bg-red-50 p-4 rounded-lg">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="font-semibold text-red-700">Failed to Load Orders</p>
        <p className="text-sm text-red-600">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Order Management
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            Track and manage customer orders from start to finish.
          </p>
        </div>
      </div>
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
              <Filter className="h-6 w-6 text-blue-600" />
              Order Filters
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  placeholder="Search by ID, customer name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-2 rounded-lg border border-gray-300 w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-52 rounded-lg border border-gray-300">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="In Production">In Production</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onStatusUpdate={handleStatusUpdate}
              onViewDetails={handleViewDetails}
              onConfirmPayment={handleConfirmPayment}
            />
          ))
        ) : (
          <Card className="col-span-full text-center p-12">
            <Package className="h-16 w-16 text-gray-400 mb-6 mx-auto" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              No Orders Found
            </h3>
            <p className="text-gray-600">
              No orders match your current filters.
            </p>
          </Card>
        )}
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
        onConfirmPayment={() =>
          selectedOrder && handleConfirmPayment(selectedOrder)
        }
      />

      <PaymentConfirmationModal
        order={selectedOrder}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={handlePaymentConfirmation}
      />
    </div>
  );
};

export default Orders;
