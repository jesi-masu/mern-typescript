export type OrderStatus = "Pending" | "In Review" | "In Production" | "Ready for Delivery" | "Delivered" | "Cancelled";
export type PaymentStatus = "Pending" | "Confirmed" | "Failed" | "Refunded";

export interface TrackingUpdate {
  status: string;
  message: string;
  timestamp: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  products: { productId: number; quantity: number }[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  estimatedDelivery?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZip?: string;
  trackingUpdates?: TrackingUpdate[];
}

// Enhanced mock orders data with proper typing
export const orders: Order[] = [
  {
    id: "ORD-001",
    customerId: "customer@example.com",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    products: [{ productId: 1, quantity: 1 }],
    totalAmount: 25000,
    status: "Pending",
    paymentStatus: "Pending",
    createdAt: "2024-06-20T10:00:00Z",
    estimatedDelivery: "2024-07-15",
    shippingAddress: "123 Main St",
    shippingCity: "Manila",
    shippingState: "Metro Manila",
    shippingZip: "1000",
    trackingUpdates: [
      {
        status: "Order Placed",
        message: "Your order has been successfully placed",
        timestamp: "2024-06-20T10:00:00Z"
      }
    ]
  },
  {
    id: "ORD-002", 
    customerId: "jane@example.com",
    customerName: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    products: [{ productId: 2, quantity: 2 }],
    totalAmount: 45000,
    status: "In Production",
    paymentStatus: "Confirmed",
    createdAt: "2024-06-18T14:30:00Z",
    estimatedDelivery: "2024-07-20",
    shippingAddress: "456 Oak Ave",
    shippingCity: "Cebu City",
    shippingState: "Cebu",
    shippingZip: "6000",
    trackingUpdates: [
      {
        status: "Order Placed",
        message: "Your order has been successfully placed",
        timestamp: "2024-06-18T14:30:00Z"
      },
      {
        status: "Payment Confirmed",
        message: "Payment has been verified and confirmed",
        timestamp: "2024-06-19T09:00:00Z"
      },
      {
        status: "In Production",
        message: "Your prefab module is now in production",
        timestamp: "2024-06-21T08:00:00Z"
      }
    ]
  },
  {
    id: "ORD-003",
    customerId: "bob@example.com", 
    customerName: "Bob Johnson",
    customerEmail: "bob.johnson@example.com",
    products: [{ productId: 3, quantity: 1 }],
    totalAmount: 35000,
    status: "Delivered",
    paymentStatus: "Confirmed",
    createdAt: "2024-06-15T09:15:00Z",
    estimatedDelivery: "2024-07-10",
    shippingAddress: "789 Pine Rd",
    shippingCity: "Davao City",
    shippingState: "Davao del Sur",
    shippingZip: "8000",
    trackingUpdates: [
      {
        status: "Order Placed",
        message: "Your order has been successfully placed",
        timestamp: "2024-06-15T09:15:00Z"
      },
      {
        status: "Payment Confirmed",
        message: "Payment has been verified and confirmed",
        timestamp: "2024-06-15T15:00:00Z"
      },
      {
        status: "In Production",
        message: "Your prefab module is now in production",
        timestamp: "2024-06-17T08:00:00Z"
      },
      {
        status: "Ready for Delivery",
        message: "Your order is ready for delivery",
        timestamp: "2024-06-25T10:00:00Z"
      },
      {
        status: "Delivered",
        message: "Your order has been successfully delivered",
        timestamp: "2024-06-26T14:00:00Z"
      }
    ]
  }
];

// Helper function to add new orders - now includes paymentStatus default
export const addOrder = (orderData: Omit<Order, "id" | "createdAt">): Order => {
  const newOrder: Order = {
    ...orderData,
    id: `ORD-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    paymentStatus: orderData.paymentStatus || "Pending",
    trackingUpdates: [{
      status: "Order Placed",
      message: "Your order has been successfully placed",
      timestamp: new Date().toISOString()
    }]
  };
  
  orders.push(newOrder);
  return newOrder;
};

// Helper function to get order status color
export const getOrderStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "In Review":
      return "bg-blue-100 text-blue-800";
    case "In Production":
      return "bg-purple-100 text-purple-800";
    case "Ready for Delivery":
      return "bg-orange-100 text-orange-800";
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Helper function to get order status progress
export const getOrderStatusProgress = (status: OrderStatus): number => {
  switch (status) {
    case "Pending":
      return 20;
    case "In Review":
      return 40;
    case "In Production":
      return 60;
    case "Ready for Delivery":
      return 80;
    case "Delivered":
      return 100;
    case "Cancelled":
      return 0;
    default:
      return 0;
  }
};
