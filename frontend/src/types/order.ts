// --- UPDATED: New PaymentStatus type ---
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

export interface Order {
  _id: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  productId: {
    _id: string;
    productName: string;
    image?: string;
  };
  customerInfo: {
    deliveryAddress?: {
      street: string;
      subdivision: string;
      cityMunicipality: string;
    };
  };
  paymentInfo: any;
  contractInfo: any;
}
