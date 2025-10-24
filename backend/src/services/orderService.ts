// src/services/orderService.ts

import mongoose from "mongoose";
import Order, { IOrder } from "../models/orderModel";
import User from "../models/userModel";
import Product from "../models/productModel";
import Notification from "../models/notificationModel";
import ActivityLog from "../models/activityLogModel";

// Define a type for your authenticated user (you might already have this)
// This makes the code much cleaner and safer
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
  customerName: string
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
    // Throw an error that the controller will catch
    throw new Error("Please provide all required order fields.");
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // 1. Check stock and prepare product updates
    const productSavePromises = [];
    for (const item of products) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found.`);
      }
      if (product.stock < item.quantity) {
        throw new Error(
          `Not enough stock for ${product.productName}. Only ${product.stock} available, but ${item.quantity} were requested.`
        );
      }
      product.stock -= item.quantity;
      productSavePromises.push(product.save({ session }));
    }
    // 2. Execute all product stock updates
    await Promise.all(productSavePromises);
    // 3. Create the new order
    const [newOrder] = await Order.create(
      [
        {
          userId,
          products,
          customerInfo,
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

    // 4. Create Activity Log (still inside transaction)
    //
    //  --- CHANGE ---
    //  REMOVED the try...catch block here.
    //  If logging fails, the main catch block will abort the transaction.
    //
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
      { session }
    );

    // 5. Create Notifications (still inside transaction)
    //
    //  --- CHANGE ---
    //  REMOVED the try...catch block here.
    //  If notification creation fails, the main catch block will abort the transaction.
    //
    await _createOrderNotifications(newOrder, customerInfo, session);

    // 6. Commit
    await session.commitTransaction();
    return newOrder;
  } catch (error: any) {
    // 7. Abort
    await session.abortTransaction();
    throw error; // Re-throw the error for the controller to handle
  } finally {
    // 8. End session
    session.endSession();
  }
};

// --- Update Order Logic ---
export const updateOrderLogic = async (
  orderId: string,
  updateBody: any,
  user: AuthenticatedUser,
  userName: string // Pass the name from the helper
) => {
  const { orderStatus, paymentStatus, paymentReceiptUrl, paymentStage } =
    updateBody;

  const orderBeforeUpdate = await Order.findById(orderId).lean(); // Use .lean() for a plain object
  if (!orderBeforeUpdate) {
    throw new Error("Order not found.");
  }

  // --- Authorization Logic ---
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
  const fieldsToSet: { [key: string]: string } = {};
  let logDetails = "";

  // Admin-only fields
  if (user.role !== "client") {
    if (orderStatus && orderStatus !== orderBeforeUpdate.orderStatus) {
      fieldsToSet.orderStatus = orderStatus;
      logDetails += `Status changed from '${orderBeforeUpdate.orderStatus}' to '${orderStatus}'. `;
    }
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
    updateData.$push = { ...updateData.$push, ...pushUpdate };

    if (!orderBeforeUpdate.paymentInfo.paymentReceipts) {
      updateData.$set = {
        ...updateData.$set,
        "paymentInfo.paymentReceipts": {},
      };
    }
    logDetails += `Receipt uploaded for ${paymentStage} stage. `;
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields provided for update.");
  }

  // --- Perform the Update ---
  const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedOrder) {
    throw new Error("Order not found after update attempt.");
  }

  // --- Side Effects (Non-transactional) ---
  // We run these *after* the update is successful
  if (logDetails.trim()) {
    _createUpdateActivityLog(user._id, userName, orderId, logDetails);
  }

  if (paymentReceiptUrl && paymentStage) {
    _createReceiptUploadNotification(updatedOrder, paymentStage);
  }

  if (fieldsToSet.orderStatus || fieldsToSet["paymentInfo.paymentStatus"]) {
    _createStatusUpdateNotification(updatedOrder, fieldsToSet);
  }

  return updatedOrder;
};

// --- Get Orders Logic ---
export const getUserOrdersLogic = async (userId: string) => {
  return await Order.find({ userId })
    .populate("products.productId", "productName image productPrice")
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
  if (!order.userId || !(order.userId as any)._id) {
    throw new Error("Order data is incomplete (missing user reference).");
  }

  // Authorization
  const orderOwnerId = (order.userId as any)._id.toString();
  if (user.role === "client" && orderOwnerId !== user._id) {
    throw new Error("Forbidden: You are not authorized to view this order.");
  }

  return order;
};

// --- Get All Uploads Logic ---
export const getAllUploadsLogic = async () => {
  // Define the interface here as it's only used by this service
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

  // Your existing logic is perfect, just return the result
  return orders.flatMap((order) => {
    const allUploads: Upload[] = [];
    const customerName = `${order.customerInfo.firstName} ${order.customerInfo.lastName}`;

    if (order.paymentInfo?.paymentReceipts) {
      const receipts = order.paymentInfo.paymentReceipts;
      const allReceiptUrls = [
        ...(receipts.initial || []),
        ...(receipts.pre_delivery || []),
        ...(receipts.final || []),
      ];
      allReceiptUrls.forEach((url) => {
        allUploads.push({
          id: `${order._id}-${url}`,
          orderId: order._id.toString(),
          customerName,
          type: "payment_receipt",
          fileUrl: url,
          fileName: url.split("/").pop()?.split("?")[0] || "receipt.jpg",
          uploadDate: order.createdAt,
          status: "pending", // You might want to get this from the order status
        });
      });
    }

    if (order.locationImages && order.locationImages.length > 0) {
      order.locationImages.forEach((url) => {
        allUploads.push({
          id: `${order._id}-${url}`,
          orderId: order._id.toString(),
          customerName,
          type: "location_image",
          fileUrl: url,
          fileName: url.split("/").pop()?.split("?")[0] || "location.jpg",
          uploadDate: order.createdAt,
          status: "pending",
        });
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
  newOrder: any,
  customerInfo: any,
  session: mongoose.ClientSession
) => {
  // Notify staff
  const staffUsers = await User.find({
    role: { $in: ["admin", "personnel"] },
  })
    .select("_id")
    .session(session); // Pass session to reads

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
    await Notification.create(staffNotifications, { session }); // Pass session to bulk create
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
    { session }
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
  updatedOrder: any,
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

    const customerName = `${updatedOrder.customerInfo.firstName} ${updatedOrder.customerInfo.lastName}`;
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
  updatedOrder: any,
  fieldsToSet: any
) => {
  let notificationMessage = "";
  let notificationType = "general";

  if (fieldsToSet.orderStatus) {
    notificationMessage = `Your order #${updatedOrder._id
      .toString()
      .slice(-6)} status has been updated to '${fieldsToSet.orderStatus}'.`;
    notificationType = "order_update";
  } else if (fieldsToSet["paymentInfo.paymentStatus"]) {
    notificationMessage = `Payment status for order #${updatedOrder._id
      .toString()
      .slice(-6)} updated to '${fieldsToSet["paymentInfo.paymentStatus"]}'.`;
    notificationType = "payment_confirmed";
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
