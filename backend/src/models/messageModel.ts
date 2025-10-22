// backend/src/models/messageModel.ts
import mongoose, { Document, Schema } from "mongoose";

// This interface defines what a message document looks like
export interface IMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

// This is the Mongoose schema that enforces the structure
const messageSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Good practice to remove whitespace
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["unread", "read", "archived"], // Only allows these values
      default: "unread", // New messages are always 'unread'
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const Message = mongoose.model<IMessage>("Message", messageSchema);
export default Message;
