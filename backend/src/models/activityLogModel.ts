// backend/src/models/activityLogModel.ts

import mongoose, { Document, Schema } from "mongoose";

// This type is based on your frontend's `admin.ts` file
export type ActivityLogCategory =
  | "orders"
  | "products"
  | "projects"
  | "contracts"
  | "users"
  | "system";

export interface IActivityLog extends Document {
  userId: mongoose.Schema.Types.ObjectId | null; // Link to the User model
  userName: string; // Store the name for history, even if user is deleted
  action: string;
  details: string;
  category: ActivityLogCategory;
  createdAt: Date;
  updatedAt: Date;
}

const activityLogSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // false because some actions might be "System"
      index: true,
    },
    userName: {
      type: String,
      required: true,
      default: "System", // Default for system actions
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["orders", "products", "projects", "contracts", "users", "system"],
    },
  },
  { timestamps: true } // Mongoose handles `createdAt` and `updatedAt`
);

const ActivityLog = mongoose.model<IActivityLog>(
  "ActivityLog",
  activityLogSchema
);

export default ActivityLog;
