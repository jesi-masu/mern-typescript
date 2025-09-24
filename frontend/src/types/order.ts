// --- TYPE DEFINITIONS FOR A DETAILED ORDER ---

export type PaymentStatus =
  | "Pending"
  | "50% Complete Paid"
  | "90% Complete Paid"
  | "100% Complete Paid";

export interface Product {
  _id: string;
  productName: string;
  productPrice: number;
  squareFeet: number;
  image?: string;
}

export interface OrderDetail {
  _id: string;
  orderStatus:
    | "Pending"
    | "Processing"
    | "In Production"
    | "Shipped"
    | "Delivered"
    | "Completed"
    | "Cancelled";
  paymentStatus: PaymentStatus;
  totalAmount: number;
  createdAt: string;
  estimatedDelivery?: string;
  trackingUpdates?: { status: string; message: string; timestamp: string }[];
  productId: Product;
  paymentReceipts?: string[];
}
