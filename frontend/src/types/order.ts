// frontend/src/types/order.ts
import { IProductPart } from "./product";
// (This is the complete, final file)

// 1. Define the DeliveryAddress (matches backend model)
export interface DeliveryAddress {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  subdivision: string;
  cityMunicipality: string;
  province: string;
  postalCode: string;
  country: string;
  additionalAddressLine?: string;
}

// 2. Define the CustomerInfo (matches backend model)
export interface OrderCustomerInfo {
  firstName: string; // Billing First Name
  lastName: string; // Billing Last Name
  email: string;
  phoneNumber: string; // Billing Phone

  // This is the correct nested structure
  deliveryAddress: DeliveryAddress;
}

// (These are your existing definitions, they are correct)
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

export interface Product {
  _id: string;
  productName: string;
  productPrice: number;
  squareFeet: number;
  image?: string;
  productShortDescription?: string;
  category?: string; // Add category if you populate it
  productParts?: IProductPart[]; // <-- Make sure this is included
}

export interface OrderProduct {
  productId: Product;
  quantity: number;
  _id: string;
}

// This is the 'paymentInfo' object on a fetched Order
export interface OrderPaymentInfo {
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  paymentReceipts?: {
    initial?: string[];
    pre_delivery?: string[];
    final?: string[];
  };
  paymentMode: "cash" | "bank" | "cheque" | "gcash";
  paymentTiming: "now" | "later";
  installmentStage?: "initial" | "pre_delivery" | "final";
}

// 3. This is the main, correct Order interface
export interface Order {
  _id: string;
  userId: string;
  orderStatus: OrderStatus;
  products: OrderProduct[];

  // This is the correct object matching your backend
  customerInfo: OrderCustomerInfo;

  paymentInfo: OrderPaymentInfo; // Use the specific OrderPaymentInfo
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingUpdates?: { status: string; message: string; timestamp: string }[];
  locationImages?: string[];
}
