import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs"; // Assuming this is used elsewhere, keeping it.

interface IOrderProduct {
  productId: Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  products: IOrderProduct[];
  source?: string;
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
    paymentStatus:
      | "Pending"
      | "50% Complete Paid"
      | "90% Complete Paid"
      | "100% Complete Paid";
    paymentReceipts?: {
      initial?: string[];
      pre_delivery?: string[];
      final?: string[];
    };
  };
  contractInfo: {
    signature: string;
    agreedToTerms: boolean;
  };
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
  createdAt: Date; // ✅ ADD THIS LINE
  updatedAt: Date; // ✅ ADD THIS LINE
}

const orderProductSchema: Schema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: { type: [orderProductSchema], required: true },
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
        paymentTiming: { type: String, enum: ["now", "later"], required: true },
        paymentStatus: {
          type: String,
          enum: [
            "Pending",
            "50% Complete Paid",
            "90% Complete Paid",
            "100% Complete Paid",
          ],
          default: "Pending",
        },
        paymentReceipts: {
          type: {
            initial: { type: [String], required: false },
            pre_delivery: { type: [String], required: false },
            final: { type: [String], required: false },
          },
          required: false,
          _id: false,
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
    locationImages: { type: [String], required: false },
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
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
