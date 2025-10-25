// src/services/orderService.ts

import mongoose from "mongoose";
import Order, { IOrder } from "../models/orderModel";
import User from "../models/userModel";
import Product from "../models/productModel";
import Notification from "../models/notificationModel";
import ActivityLog from "../models/activityLogModel";

type AuthenticatedUser = {
  _id: string;
  role: "client" | "admin" | "personnel";
  firstName?: string;
  lastName?: string;
};

// --- Create Order Logic ---
export const createOrderLogic = async (
  orderData: any,
  userId: string,
  customerName: string // Assuming you still pass this, though customerInfo might be better
) => {
  const {
    products,
    customerInfo,
    paymentInfo,
    contractInfo,
    totalAmount,
    locationImages,
  } = orderData;

  // Validation
  if (
    !products ||
    !Array.isArray(products) ||
    products.length === 0 ||
    !customerInfo ||
    !paymentInfo ||
    !contractInfo ||
    !totalAmount
  ) {
    throw new Error("Please provide all required order fields.");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Stock Check & Update
    const productSavePromises = [];
    for (const item of products) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found.`);
      }
      if (product.stock < item.quantity) {
        throw new Error(
          `Not enough stock for ${product.productName}. Only ${product.stock} available.`
        );
      }
      product.stock -= item.quantity;
      productSavePromises.push(product.save({ session }));
    }
    await Promise.all(productSavePromises);

    // 2. Create Order
    const [newOrder] = await Order.create(
      [
        {
          userId,
          products,
          customerInfo, // Make sure this matches your orderModel
          paymentInfo,
          contractInfo,
          totalAmount,
          locationImages,
          source: "live",
        },
      ],
      { session }
    );
    if (!newOrder) {
      throw new Error("Order creation failed.");
    }

    // 3. Create Activity Log
    await ActivityLog.create(
      [
        {
          userId: userId,
          userName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          action: `Order Created`,
          details: `Order #${newOrder._id
            .toString()
            .slice(-6)} placed. Total: ₱${totalAmount.toLocaleString()}`,
          category: "orders",
        },
      ],
      // --- ADDED FIX ---
      { session, ordered: true } // Add ordered: true
    );

    // 4. Create Notifications
    await _createOrderNotifications(newOrder, customerInfo, session);

    // 5. Commit
    await session.commitTransaction();
    return newOrder;
  } catch (error: any) {
    await session.abortTransaction();
    throw error; // Re-throw for the controller
  } finally {
    session.endSession();
  }
};

// --- Update Order Logic ---
export const updateOrderLogic = async (
  orderId: string,
  updateBody: any,
  user: AuthenticatedUser,
  userName: string
) => {
  const { orderStatus, paymentStatus, paymentReceiptUrl, paymentStage } =
    updateBody;

  const orderBeforeUpdate = await Order.findById(orderId).lean();
  if (!orderBeforeUpdate) {
    throw new Error("Order not found.");
  }

  // Authorization Logic
  if (user.role === "client") {
    if (orderBeforeUpdate.userId.toString() !== user._id) {
      throw new Error("Forbidden: You can only update your own orders.");
    }
    if (orderStatus || paymentStatus) {
      throw new Error("Clients cannot update order or payment status.");
    }
  }

  const updateData: {
    $set?: { [key: string]: any };
    $push?: { [key: string]: any };
  } = {};
  const fieldsToSet: { [key: string]: any } = {}; // Use 'any' for flexibility with nested paths
  let logDetails = "";

  // Admin-only fields
  if (user.role !== "client") {
    if (orderStatus && orderStatus !== orderBeforeUpdate.orderStatus) {
      fieldsToSet.orderStatus = orderStatus;
      logDetails += `Status changed from '${orderBeforeUpdate.orderStatus}' to '${orderStatus}'. `;
    }
    // Correctly check nested paymentStatus
    if (
      paymentStatus &&
      paymentStatus !== orderBeforeUpdate.paymentInfo.paymentStatus
    ) {
      fieldsToSet["paymentInfo.paymentStatus"] = paymentStatus;
      logDetails += `Payment status changed from '${orderBeforeUpdate.paymentInfo.paymentStatus}' to '${paymentStatus}'. `;
    }
    if (Object.keys(fieldsToSet).length > 0) {
      updateData.$set = fieldsToSet;
    }
  }

  // Client (and Admin) receipt upload
  if (paymentReceiptUrl && paymentStage) {
    if (!["initial", "pre_delivery", "final"].includes(paymentStage)) {
      throw new Error("Invalid payment stage provided.");
    }
    const updatePath = `paymentInfo.paymentReceipts.${paymentStage}`;
    const pushUpdate = { [updatePath]: paymentReceiptUrl };

    // Initialize paymentReceipts if it doesn't exist
    if (!updateData.$set) updateData.$set = {};
    if (!orderBeforeUpdate.paymentInfo.paymentReceipts) {
      updateData.$set["paymentInfo.paymentReceipts"] = {};
    }

    // Use $push correctly
    if (!updateData.$push) updateData.$push = {};
    updateData.$push[updatePath] = { $each: [paymentReceiptUrl] }; // Use $each for pushing

    logDetails += `Receipt uploaded for ${paymentStage} stage. `;
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields provided for update.");
  }

  // Perform the Update
  const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedOrder) {
    throw new Error("Order not found after update attempt.");
  }

  // Side Effects (Non-transactional)
  if (logDetails.trim()) {
    _createUpdateActivityLog(user._id, userName, orderId, logDetails);
  }

  if (paymentReceiptUrl && paymentStage) {
    _createReceiptUploadNotification(updatedOrder, paymentStage);
  }

  // Use the updated fieldsToSet for notification logic
  if (fieldsToSet.orderStatus || fieldsToSet["paymentInfo.paymentStatus"]) {
    _createStatusUpdateNotification(updatedOrder, fieldsToSet);
  }

  return updatedOrder;
};

// --- Get Orders Logic ---
export const getUserOrdersLogic = async (userId: string) => {
  return await Order.find({ userId })
    .populate(
      "products.productId",
      "productName image productPrice productShortDescription"
    )
    .sort({ createdAt: -1 });
};

export const getAllOrdersLogic = async () => {
  return await Order.find({})
    .populate("userId", "firstName lastName email")
    .populate(
      "products.productId",
      "productName productPrice image squareFeet productShortDescription category"
    )
    .sort({ createdAt: -1 });
};

export const getOrderByIdLogic = async (
  orderId: string,
  user: AuthenticatedUser
) => {
  const order = await Order.findById(orderId)
    .populate("userId", "firstName lastName email")
    .populate("products.productId");

  if (!order) {
    throw new Error("Order not found.");
  }
  // Check if userId exists and is populated before accessing _id
  if (
    !order.userId ||
    typeof order.userId !== "object" ||
    !("_id" in order.userId)
  ) {
    // Handle cases where userId might be just an ObjectId or not populated
    // If it's just an ID, you might need another query or adjust authorization
    // For now, let's assume it should be populated for this check:
    console.warn(`Order ${orderId} has missing or unpopulated userId.`);
    // If you MUST proceed, you might check order.userId.toString() if it's an ObjectId
    // but the authorization check below will likely fail safely.
  }

  // Authorization - Safely access _id only if userId is populated
  if (
    order.userId &&
    typeof order.userId === "object" &&
    "_id" in order.userId
  ) {
    const orderOwnerId = (order.userId as any)._id.toString();
    if (user.role === "client" && orderOwnerId !== user._id) {
      throw new Error("Forbidden: You are not authorized to view this order.");
    }
  } else if (user.role === "client") {
    // If userId isn't populated and the user is a client, deny access
    throw new Error("Forbidden: Cannot verify ownership for this order.");
  }

  return order;
};

// --- Get All Uploads Logic ---
export const getAllUploadsLogic = async () => {
  interface Upload {
    id: string;
    orderId: string;
    customerName: string;
    type: "payment_receipt" | "location_image";
    fileUrl: string;
    fileName: string;
    uploadDate: Date;
    status: string;
  }

  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .select("customerInfo paymentInfo locationImages createdAt _id");

  return orders.flatMap((order) => {
    const allUploads: Upload[] = [];
    // Ensure customerInfo exists before accessing properties
    const customerName = order.customerInfo
      ? `${order.customerInfo.firstName} ${order.customerInfo.lastName}`
      : "Unknown Customer";

    if (order.paymentInfo?.paymentReceipts) {
      const receipts = order.paymentInfo.paymentReceipts;
      const allReceiptUrls = [
        ...(receipts.initial || []),
        ...(receipts.pre_delivery || []),
        ...(receipts.final || []),
      ];
      allReceiptUrls.forEach((url) => {
        if (url) {
          // Ensure URL is not null/undefined
          allUploads.push({
            id: `${order._id}-${url}`,
            orderId: order._id.toString(),
            customerName,
            type: "payment_receipt",
            fileUrl: url,
            fileName: url.split("/").pop()?.split("?")[0] || "receipt.jpg",
            uploadDate: order.createdAt,
            status: order.orderStatus || "pending", // Use actual order status
          });
        }
      });
    }

    if (order.locationImages && order.locationImages.length > 0) {
      order.locationImages.forEach((url) => {
        if (url) {
          // Ensure URL is not null/undefined
          allUploads.push({
            id: `${order._id}-${url}`,
            orderId: order._id.toString(),
            customerName,
            type: "location_image",
            fileUrl: url,
            fileName: url.split("/").pop()?.split("?")[0] || "location.jpg",
            uploadDate: order.createdAt,
            status: order.orderStatus || "pending", // Use actual order status
          });
        }
      });
    }
    return allUploads;
  });
};

// ====================================================================
// INTERNAL HELPER FUNCTIONS (not exported)
// ====================================================================

// --- Helpers for `createOrderLogic` ---
const _createOrderNotifications = async (
  newOrder: IOrder, // Use the actual type
  customerInfo: IOrder["customerInfo"], // Use the actual type
  session: mongoose.ClientSession
) => {
  // Notify staff
  const staffUsers = await User.find({
    role: { $in: ["admin", "personnel"] },
  })
    .select("_id")
    .session(session);

  if (staffUsers.length > 0) {
    const staffMessage = `New order #${newOrder._id
      .toString()
      .slice(-6)} placed by ${customerInfo.firstName} ${
      customerInfo.lastName
    }.`;
    const staffNotifications = staffUsers.map((staff) => ({
      userId: staff._id,
      orderId: newOrder._id,
      message: staffMessage,
      type: "new_order_admin",
    }));
    // --- ADDED FIX ---
    await Notification.create(staffNotifications, { session, ordered: true });
  }

  // Notify client
  const clientMessage = `Your order #${newOrder._id
    .toString()
    .slice(-6)} has been successfully placed.`;
  await Notification.create(
    [
      {
        userId: newOrder.userId,
        orderId: newOrder._id,
        message: clientMessage,
        type: "order_placed_confirmation",
      },
    ],
    // --- ADDED FIX ---
    { session, ordered: true }
  );
};

// --- Helpers for `updateOrderLogic` ---
const _createUpdateActivityLog = async (
  userId: string,
  userName: string,
  orderId: string,
  logDetails: string
) => {
  try {
    await ActivityLog.create({
      userId: userId || null,
      userName: userName,
      action: `Order Updated`,
      details: `Order #${orderId.slice(-6)}: ${logDetails.trim()}`,
      category: "orders",
    });
  } catch (logError) {
    console.error("Failed to create activity log for order update:", logError);
  }
};

const _createReceiptUploadNotification = async (
  updatedOrder: IOrder, // Use the actual type
  paymentStage: string
) => {
  try {
    const staffUsers = await User.find({
      role: { $in: ["admin", "personnel"] },
    }).select("_id");

    if (staffUsers.length === 0) return;

    let stageLabel = "Payment";
    if (paymentStage === "initial") stageLabel = "Initial Payment (50%)";
    else if (paymentStage === "pre_delivery")
      stageLabel = "Pre-Delivery Payment (40%)";
    else if (paymentStage === "final") stageLabel = "Final Payment (10%)";

    // Ensure customerInfo exists
    const customerName = updatedOrder.customerInfo
      ? `${updatedOrder.customerInfo.firstName} ${updatedOrder.customerInfo.lastName}`
      : "Customer";

    const adminMessage = `Receipt for [${stageLabel}] uploaded for order #${updatedOrder._id
      .toString()
      .slice(-6)} by ${customerName}.`;

    const notificationPromises = staffUsers.map((staff) =>
      Notification.create({
        userId: staff._id,
        orderId: updatedOrder._id,
        message: adminMessage,
        type: "payment_uploaded",
      })
    );
    await Promise.all(notificationPromises);
  } catch (notificationError) {
    console.error(
      "Failed to create admin notification for receipt upload:",
      notificationError
    );
  }
};

const _createStatusUpdateNotification = async (
  updatedOrder: IOrder, // Use the actual type
  fieldsToSet: any // Can refine this type if needed
) => {
  let notificationMessage = "";
  let notificationType = "general"; // Default type

  if (fieldsToSet.orderStatus) {
    notificationMessage = `Your order #${updatedOrder._id
      .toString()
      .slice(-6)} status has been updated to '${fieldsToSet.orderStatus}'.`;
    notificationType = "order_update";
  } else if (fieldsToSet["paymentInfo.paymentStatus"]) {
    notificationMessage = `Payment status for order #${updatedOrder._id
      .toString()
      .slice(-6)} updated to '${fieldsToSet["paymentInfo.paymentStatus"]}'.`;
    // Assign specific type based on payment status if needed, e.g., 'payment_confirmed'
    notificationType = "payment_update"; // Example, adjust as needed
    if (fieldsToSet["paymentInfo.paymentStatus"].includes("Paid")) {
      notificationType = "payment_confirmed";
    }
  }

  if (notificationMessage && updatedOrder.userId) {
    try {
      await Notification.create({
        userId: updatedOrder.userId,
        orderId: updatedOrder._id,
        message: notificationMessage,
        type: notificationType,
      });
    } catch (notificationError) {
      console.error("Failed to create client notification:", notificationError);
    }
  }
};
