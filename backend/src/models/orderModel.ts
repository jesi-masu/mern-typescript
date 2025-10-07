// backend/src/models/orderModel.ts
import mongoose, { Document, Schema, Types } from "mongoose";

interface IOrderProduct {
  productId: Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  userId: Types.ObjectId;
  products: IOrderProduct[];
  customerInfo: {
    /* ... */
  };
  paymentInfo: {
    paymentMethod: "installment" | "full";
    installmentStage?: "initial" | "pre_delivery" | "final";
    paymentMode: "cash" | "bank" | "cheque" | "gcash";
    paymentTiming: "now" | "later";
    paymentReceipts?: string[];
    // --- MODIFICATION: paymentStatus is now defined here ---
    paymentStatus:
      | "Pending"
      | "50% Complete Paid"
      | "90% Complete Paid"
      | "100% Complete Paid";
  };
  contractInfo: {
    /* ... */
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
  // The top-level paymentStatus is removed from here
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
    products: {
      type: [orderProductSchema],
      required: true,
      validate: [
        (val: IOrderProduct[]) => val.length > 0,
        "Order must have at least one product.",
      ],
    },
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
        paymentReceipts: {
          type: [String],
          required: false,
        },
        // --- START: MODIFICATION ---
        // Move the paymentStatus schema definition inside paymentInfo
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
        // --- END: MODIFICATION ---
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
    // --- MODIFICATION: The top-level paymentStatus is removed from here ---
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
