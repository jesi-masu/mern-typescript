import mongoose, { Document, Schema, Types } from "mongoose";

export interface INotification extends Document {
  userId: Types.ObjectId; // The user (customer) receiving the notification
  orderId?: Types.ObjectId; // Optional: Link to a specific order
  message: string;
  type: "order_update" | "payment_confirmed" | "general" | string; // Allow specific types + general string
  readStatus: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: false },
    message: { type: String, required: true },
    type: { type: String, required: true },
    readStatus: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export default Notification;
