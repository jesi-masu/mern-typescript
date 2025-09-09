import mongoose, { Document, Schema, Types } from "mongoose";

// Define the structure of the order document in MongoDB
export interface IOrder extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    deliveryAddress: {
      street: string;
      subdivision: string;
      additionalAddressLine?: string;
      cityMunicipality: string;
      province: string;
      postalCode: string;
      country: string;
    };
  };
  paymentInfo: {
    paymentMethod: "installment" | "full";
    installmentStage?: "initial" | "pre_delivery" | "final";
    paymentMode: "cash" | "bank" | "cheque" | "gcash";
    paymentTiming: "now" | "later";
    // --- NEW: Store URLs of uploaded payment receipts ---
    paymentReceipts?: string[];
  };
  contractInfo: {
    signature: string; // This will likely be a Base64 string from the signature pad
    agreedToTerms: boolean;
  };
  // --- NEW: Store URLs of uploaded location images ---
  locationImages?: string[];
  totalAmount: number;
  orderStatus:
    | "Pending"
    | "Processing"
    | "In Production"
    | "Shipped"
    | "Delivered"
    | "Completed"
    | "Cancelled";
  paymentStatus: "Pending" | "Paid" | "Partially Paid" | "Refunded";
}

const orderSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    customerInfo: {
      type: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        deliveryAddress: {
          type: {
            street: { type: String, required: true },
            subdivision: { type: String, required: true },
            additionalAddressLine: { type: String, required: false },
            cityMunicipality: { type: String, required: true },
            province: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
          },
          required: true,
        },
      },
      required: true,
    },
    paymentInfo: {
      type: {
        paymentMethod: {
          type: String,
          enum: ["installment", "full"],
          required: true,
        },
        installmentStage: {
          type: String,
          enum: ["initial", "pre_delivery", "final"],
          required: false,
        },
        paymentMode: {
          type: String,
          enum: ["cash", "bank", "cheque", "gcash"],
          required: true,
        },
        paymentTiming: {
          type: String,
          enum: ["now", "later"],
          required: true,
        },
        // --- NEW: Added to schema ---
        paymentReceipts: {
          type: [String],
          required: false,
        },
      },
      required: true,
    },
    contractInfo: {
      type: {
        signature: { type: String, required: true },
        agreedToTerms: { type: Boolean, required: true },
      },
      required: true,
    },
    // --- NEW: Added to schema ---
    locationImages: {
      type: [String],
      required: false,
    },
    totalAmount: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "In Production",
        "Shipped",
        "Delivered",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Partially Paid", "Refunded"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
