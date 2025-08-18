// src/pages/Orders.tsx (or wherever your main Orders component resides)

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { orders as initialOrdersData, Order, OrderStatus } from '@/data/orders'; // Renamed for clarity
import { useToast } from '@/hooks/use-toast';
import OrderCard from '@/components/admin/orders/OrderCard';
import OrderDetailsModal from '@/components/admin/orders/OrderDetailsModal';
import PaymentConfirmationModal from '@/components/admin/orders/PaymentConfirmationModal';
import {
  ShoppingCart,
  Search,
  Filter,
  BadgeDollarSign, // Added for payment status clarity
  Package, // Changed from ShoppingCart for a more direct "order" feel
  Clock, // For pending
  ClipboardCheck, // For in review
  Hammer, // For in production
  Truck, // For ready for delivery
  CheckCircle, // For delivered
  XCircle, // For cancelled
  Info, // For general status icon
} from 'lucide-react';

// Define a map for status icons for better visual representation
const statusIcons: Record<OrderStatus | 'all', React.ElementType> = {
  all: Filter,
  Pending: Clock,
  'In Review': ClipboardCheck,
  'In Production': Hammer,
  'Ready for Delivery': Truck,  
  Delivered: CheckCircle,
  Cancelled: XCircle,
};

const Orders: React.FC = () => {
  const { logActivity } = useAdminAuth();
  const { toast } = useToast();
  // Using a state for orders to allow in-place updates without direct mutation of imported 'orders'
  const [orders, setOrders] = useState<Order[]>(initialOrdersData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Effect to listen for custom order status updates (if dispatched elsewhere)
  useEffect(() => {
    const handleOrderStatusUpdateEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ orderId: string; newStatus: OrderStatus }>;
      const { orderId, newStatus } = customEvent.detail;
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    };

    window.addEventListener('orderStatusUpdated', handleOrderStatusUpdateEvent as EventListener);

    return () => {
      window.removeEventListener('orderStatusUpdated', handleOrderStatusUpdateEvent as EventListener);
    };
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusMessage = (status: OrderStatus): string => {
    switch (status) {
      case 'Pending':
        return 'Your order is pending review and will be processed soon.';
      case 'In Review':
        return 'Your order is currently under review by our team.';
      case 'In Production':
        return 'Great news! Your order is now in production.';
      case 'Ready for Delivery':
        return 'Your order is ready for delivery. We will contact you soon to schedule.';
      case 'Delivered':
        return 'Your order has been successfully delivered. Thank you for choosing us!';
      case 'Cancelled':
        return 'Your order has been cancelled. Please contact us if you have any questions.';
      default:
        return `Your order status has been updated to: ${status}`;
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order => {
        if (order.id === orderId) {
          const oldStatus = order.status;
          const updatedOrder = { ...order, status: newStatus };

          // Dispatch custom event for real-time updates
          const event = new CustomEvent('orderStatusUpdated', {
            detail: { orderId, newStatus }
          });
          window.dispatchEvent(event);

          // Log the activity
          logActivity("Order Status Update", `Order ${orderId} status changed from ${oldStatus} to ${newStatus}`, "orders");

          // Automatically send notification to customer for all status updates
          const statusMessage = getStatusMessage(newStatus);
          if (window.customerNotificationHandler) {
            window.customerNotificationHandler({
              orderId: updatedOrder.id,
              message: statusMessage,
              type: 'order_update',
              read: false,
              fromPersonnel: 'Admin Team'
            });
          }
          // Log the automatic notification
          logActivity("Automatic Customer Notification", `Status update notification sent to ${updatedOrder.customerName} for order ${updatedOrder.id}`, "orders");

          toast({
            title: "Order Status Updated",
            description: `Order ${orderId} status changed to ${newStatus}`,
          });

          return updatedOrder;
        }
        return order;
      });
      return updatedOrders;
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

  const handlePaymentConfirmation = (order: Order, notes?: string) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(o => {
        if (o.id === order.id) {
          const updatedOrder = { ...o, paymentStatus: 'Confirmed' as typeof o.paymentStatus };

          // Send notification to customer
          if (window.customerNotificationHandler) {
            window.customerNotificationHandler({
              orderId: updatedOrder.id,
              message: `Great news! Your payment for order ${updatedOrder.id} has been confirmed. Your order will now proceed to the next stage.`,
              type: 'payment_confirmed',
              read: false,
              fromPersonnel: 'Finance Team'
            });
          }

          // Log the activity
          logActivity(
            "Payment Confirmation",
            `Payment confirmed for order ${updatedOrder.id}${notes ? ` - Notes: ${notes}` : ''}`,
            "orders"
          );

          toast({
            title: "Payment Confirmed",
            description: `Payment for order ${updatedOrder.id} has been confirmed and customer notified.`,
          });

          return updatedOrder;
        }
        return o;
      });
      return updatedOrders;
    });
  };

  const totalOrdersCount = orders.length; // Count of all orders, not just filtered ones

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen"> {/* Added background and increased padding */}
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Order Management</h1> {/* Larger, bolder title */}
          <p className="text-lg text-gray-600 mt-1">Efficiently track and manage customer orders from start to finish.</p> {/* More descriptive subtitle */}
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"> {/* Styled badge */}
          <Package className="h-6 w-6 text-indigo-600" /> {/* Changed icon and color */}
          <span className="text-xl font-semibold text-gray-800">{totalOrdersCount}</span> {/* Larger count */}
          <span className="text-gray-500">Total Orders</span>
        </div>
      </div>

      <hr className="border-t border-gray-200" /> {/* Separator */}

      {/* Filter and Search Section */}
      <Card className="shadow-lg rounded-xl"> {/* More pronounced shadow and rounded corners */}
        <CardHeader className="pb-4"> {/* Reduced padding bottom */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"> {/* Adjusted for medium screens */}
            <CardTitle className="flex items-center gap-3 text-2xl text-gray-800"> {/* Larger title for filter section */}
              <Filter className="h-6 w-6 text-blue-600" /> {/* Larger icon, distinct color */}
              Order Filters
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto"> {/* Consistent spacing */}
              <div className="relative flex-grow"> {/* Flex-grow to make search input take available space */}
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" /> {/* Larger icon, better positioning */}
                <Input
                  placeholder="Search by ID, customer name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full" // Enhanced input style
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-52 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"> {/* Enhanced select style */}
                  <div className="flex items-center gap-2">
                    {React.createElement(statusIcons[statusFilter as OrderStatus | 'all'] || Info, { className: 'h-4 w-4 text-gray-600' })} {/* Dynamic icon */}
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-600" /> All Status
                    </div>
                  </SelectItem>
                  {Object.keys(statusIcons).filter(s => s !== 'all').map((status) => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        {React.createElement(statusIcons[status as OrderStatus] || Info, { className: 'h-4 w-4 text-gray-600' })} {status}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4"> {/* Adjusted padding top */}
          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredOrders.length}</span> of <span className="font-semibold text-gray-700">{totalOrdersCount}</span> orders
          </div>
        </CardContent>
      </Card>

      {/* Order List Section */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"> {/* Responsive grid for order cards */}
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusUpdate={handleStatusUpdate}
              onViewDetails={handleViewDetails}
              onConfirmPayment={handleConfirmPayment}
            />
          ))
        ) : (
          <Card className="col-span-full shadow-lg rounded-xl flex flex-col items-center justify-center p-12 text-center bg-white border border-dashed border-gray-300"> {/* Styled empty state */}
            <Package className="h-16 w-16 text-gray-400 mb-6" /> {/* Larger icon */}
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Orders Found</h3>
            <p className="text-lg text-gray-600 max-w-md">
              {searchQuery || statusFilter !== 'all'
                ? "No orders match your current search or filter criteria. Try adjusting your selections."
                : "It looks like there are no orders to display yet. Orders will appear here as they are placed by customers."}
            </p>
          </Card>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedOrder(null);
        }}
        onStatusUpdate={handleStatusUpdate}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* Payment Confirmation Modal */}
      <PaymentConfirmationModal
        order={selectedOrder}
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedOrder(null);
        }}
        onConfirm={handlePaymentConfirmation}
      />
    </div>
  );
};

export default Orders;