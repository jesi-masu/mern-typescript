// frontend/src/pages/admin/Orders.tsx
import React, { useState, useEffect } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import OrderCard from "@/components/admin/orders/OrderCard";
import OrderDetailsModal from "@/components/admin/orders/OrderDetailsModal";
import PaymentConfirmationModal from "@/components/admin/orders/PaymentConfirmationModal";
import {
  fetchAllOrders,
  updateOrderStatusAdmin,
} from "@/services/orderService";
import { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { Package, Loader2, AlertCircle, MoreHorizontal } from "lucide-react";
import OrderFilterCard from "@/components/admin/orders/OrderFilterCard";

const OrderTable: React.FC<{
  orders: Order[];
  onViewDetails: (order: Order) => void;
  onConfirmPayment: (order: Order) => void;
}> = ({ orders, onViewDetails, onConfirmPayment }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(price);
  };

  const [tableAnimationParent] = useAutoAnimate();

  const getStatusClasses = (
    status: OrderStatus | PaymentStatus | undefined
  ): string => {
    const baseClasses = "font-semibold border-transparent";
    switch (status) {
      case "Pending":
        return `bg-yellow-100 text-yellow-800 ${baseClasses}`;
      case "Processing":
        return `bg-blue-100 text-blue-800 ${baseClasses}`;
      case "In Production":
        return `bg-purple-100 text-purple-800 ${baseClasses}`;
      case "Shipped":
        return `bg-indigo-100 text-indigo-800 ${baseClasses}`;
      case "Delivered":
      case "Completed":
        return `bg-green-100 text-green-800 ${baseClasses}`;
      case "Cancelled":
        return `bg-red-100 text-red-800 ${baseClasses}`;
      case "50% Complete Paid":
        return `bg-blue-100 text-blue-800 ${baseClasses}`;
      case "90% Complete Paid":
        return `bg-indigo-100 text-indigo-800 ${baseClasses}`;
      case "100% Complete Paid":
        return `bg-green-100 text-green-800 ${baseClasses}`;
      default:
        return `bg-gray-100 text-gray-800 ${baseClasses}`;
    }
  };

  const formatAddress = (address: Order["customerInfo"]["deliveryAddress"]) => {
    if (!address) return "N/A";
    return [
      address.street,
      address.subdivision,
      address.cityMunicipality,
      address.province,
    ]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <Card className="shadow-lg rounded-xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Delivery Location</TableHead>
            <TableHead>Landmarks/Notes</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-center">Payment</TableHead>
            <TableHead className="text-center">Order Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody ref={tableAnimationParent}>
          {orders.map((order) => {
            const currentPaymentStatus =
              order.paymentInfo?.paymentStatus || "Pending";
            return (
              <TableRow key={order._id}>
                <TableCell className="font-medium">
                  #{order._id.slice(-6)}
                </TableCell>
                <TableCell>
                  {order.customerInfo.firstName} {order.customerInfo.lastName}
                </TableCell>
                <TableCell>
                  {formatAddress(order.customerInfo.deliveryAddress)}
                </TableCell>
                <TableCell>
                  {order.customerInfo.deliveryAddress?.additionalAddressLine ||
                    "N/A"}
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatPrice(order.totalAmount)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={getStatusClasses(currentPaymentStatus)}>
                    {currentPaymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={getStatusClasses(order.orderStatus)}>
                    {order.orderStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(order)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onConfirmPayment(order)}
                        disabled={currentPaymentStatus === "100% Complete Paid"}
                      >
                        Confirm Payment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
};

// --- Main Orders Component ---
const Orders: React.FC = () => {
  const { isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // --- State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  // --- animation ---
  const [cardAnimationParent] = useAutoAnimate();

  // --- Queries ---
  const {
    data: orders = [],
    isLoading: isOrdersLoading,
    isError,
    error,
  } = useQuery<Order[]>({
    queryKey: ["adminOrders"],
    queryFn: fetchAllOrders,
    enabled: !isAuthLoading,
  });

  // --- Mutations ---
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
        description: `Order #${updatedOrder._id.slice(
          -6
        )} has been updated successfully.`,
      });
    },
    onError: (err: any) => {
      toast({
        title: "Update Failed",
        description: err.message || "Could not update the order.",
        variant: "destructive",
      });
    },
  });

  // ✏️ 2. ADD THIS 'useEffect'
  // This hook syncs the 'selectedOrder' state with the 'orders' list.
  // When 'orders' refetches, this finds the updated version and updates
  // the 'selectedOrder', which forces the modal to re-render.
  useEffect(() => {
    if (selectedOrder) {
      const updatedOrder = orders.find((o) => o._id === selectedOrder._id);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    }
    // We add 'selectedOrder' here to be thorough,
    // but 'orders' is the key dependency that drives the update.
  }, [orders, selectedOrder]);

  // --- Filtering Logic ---
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    const address = order.customerInfo?.deliveryAddress;
    const province = address?.province?.toLowerCase() ?? "";
    const city = address?.cityMunicipality?.toLowerCase() ?? "";
    const subdivision = address?.subdivision?.toLowerCase() ?? "";
    const street = address?.street?.toLowerCase() ?? "";
    const additionalInfo = address?.additionalAddressLine?.toLowerCase() ?? "";
    const productNames =
      order.products
        ?.map((p) => p.productId.productName.toLowerCase())
        .join(" ") || "";

    // 1. Short format (e.g., "11/10/2025")
    const shortDateStr = new Date(order.createdAt)
      .toLocaleDateString()
      .toLowerCase();

    // 2. Long format (e.g., "november 10, 2025")
    const longDateStr = new Date(order.createdAt)
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      .toLowerCase();

    // 1. Search Match
    const matchesSearch =
      order._id.toLowerCase().includes(searchLower) ||
      order.customerInfo.firstName.toLowerCase().includes(searchLower) ||
      order.customerInfo.lastName.toLowerCase().includes(searchLower) ||
      order.customerInfo.email.toLowerCase().includes(searchLower) ||
      productNames.includes(searchLower) ||
      shortDateStr.includes(searchLower) || // Check short date
      longDateStr.includes(searchLower) || // Check long date
      province.includes(searchLower) ||
      city.includes(searchLower) ||
      subdivision.includes(searchLower) ||
      street.includes(searchLower) ||
      additionalInfo.includes(searchLower);

    // 2. Status Match
    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;

    // ✏️ 4. ADDED Payment Status Match
    const matchesPaymentStatus =
      paymentStatusFilter === "all" ||
      order.paymentInfo.paymentStatus === paymentStatusFilter;

    // ✏️ 5. UPDATED final return
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  // --- Event Handlers ---
  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderMutation.mutate({
      orderId,
      updateData: { orderStatus: newStatus },
    });
  };
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

  // --- Loading and Error States ---
  if (isAuthLoading || isOrdersLoading) {
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

  // --- Render ---
  return (
    <div className="animate-fadeIn space-y-6 p-4 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Order Management
          </h1>
          <p className="text-gray-600 mt-1">
            Efficiently track and manage customer orders from start to finish
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <Package className="h-6 w-6 text-indigo-600" />
          <span className="text-xl font-semibold text-gray-800">
            {orders.length}
          </span>
          <span className="text-gray-500">Total Orders</span>
        </div>
      </div>
      <hr className="border-t border-gray-200" />

      {/* --- Filter Card Component --- */}
      {/* ✏️ 6. UPDATED PROPS */}
      <OrderFilterCard
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        paymentStatusFilter={paymentStatusFilter}
        setPaymentStatusFilter={setPaymentStatusFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        filteredOrderCount={filteredOrders.length}
        totalOrderCount={orders.length}
      />

      {/* --- Order Display Area --- */}
      <div>
        {filteredOrders.length > 0 ? (
          viewMode === "card" ? (
            // ✏️ 3. ATTACH THE 'ref' TO THE GRID
            <div
              ref={cardAnimationParent}
              className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
            >
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onViewDetails={handleViewDetails}
                  onConfirmPayment={handleConfirmPayment}
                />
              ))}
            </div>
          ) : (
            <div>
              {/* The OrderTable component will handle its own animation */}
              <OrderTable
                orders={filteredOrders}
                onViewDetails={handleViewDetails}
                onConfirmPayment={handleConfirmPayment}
              />
            </div>
          )
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

      {/* --- Modals --- */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
        onConfirmPayment={() =>
          selectedOrder && handleConfirmPayment(selectedOrder)
        }
        // ✏️ 3. PASS THE 'isUpdating' PROP
        isUpdating={updateOrderMutation.isPending}
      />
      <PaymentConfirmationModal
        order={selectedOrder}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={handlePaymentConfirmation}
        // ✏️ 4. (RECOMMENDED) PASS 'isUpdating' HERE AS WELL
        isUpdating={updateOrderMutation.isPending}
      />
    </div>
  );
};

export default Orders;
