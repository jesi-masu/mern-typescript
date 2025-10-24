// --- TYPE DEFINITIONS FOR A DETAILED ORDER ---

export type PaymentStatus =
  | "Pending"
  | "50% Complete Paid"
  | "90% Complete Paid"
  | "100% Complete Paid";

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "In Production"
  | "Shipped"
  | "Delivered"
  | "Completed"
  | "Cancelled";

// Interface for the populated Product data
export interface Product {
  _id: string;
  productName: string;
  productPrice: number;
  squareFeet: number;
  image?: string;
  productShortDescription?: string; // We added this field
}

// Interface for the 'products' array in the order
export interface OrderProduct {
  productId: Product; // The populated product details
  quantity: number;
  _id: string;
}

// Interface for the nested paymentInfo object
export interface PaymentInfo {
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  paymentReceipts?: {
    initial?: string[];
    pre_delivery?: string[];
    final?: string[];
  };
}

// This is the main Order type your component should use
export interface Order {
  _id: string;
  userId: string; // Or a populated User interface
  orderStatus: OrderStatus;
  products: OrderProduct[]; // It's an array of products
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
    province: string;
    zipCode: string;
  };
  paymentInfo: PaymentInfo; // It's a nested object
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingUpdates?: { status: string; message: string; timestamp: string }[];
  locationImages?: string[];
}
