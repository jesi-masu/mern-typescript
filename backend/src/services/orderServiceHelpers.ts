import mongoose from "mongoose";
import { IOrder } from "../models/orderModel";
import User from "../models/userModel";
import Notification from "../models/notificationModel";
import ActivityLog from "../models/activityLogModel";

// --- Helpers for `createOrderLogic` ---
export const createOrderNotifications = async (
  newOrder: IOrder,
  customerInfo: IOrder["customerInfo"],
  session: mongoose.ClientSession
) => {
  // Notify staff
  const staffUsers = await User.find({
    role: { $in: ["admin", "personnel"] },
  })
    .select("_id")
    .session(session);

  if (staffUsers.length > 0) {
    const staffMessage = `New reservation #${newOrder._id
      .toString()
      .slice(-6)} placed by ${customerInfo.firstName} ${
      customerInfo.lastName
    }.`;
    const staffNotifications = staffUsers.map((staff) => ({
      userId: staff._id,
      orderId: newOrder._id,
      message: staffMessage,
      type: "reservation_new",
    }));
    await Notification.create(staffNotifications, { session, ordered: true });
  }

  // Notify client
  const clientMessage = `Your reservation #${newOrder._id
    .toString()
    .slice(-6)} has been submitted. We will call you soon for verification.`;
  await Notification.create(
    [
      {
        userId: newOrder.userId,
        orderId: newOrder._id,
        message: clientMessage,
        type: "reservation_placed",
      },
    ],
    { session, ordered: true }
  );
};

// --- Helpers for `updateOrderLogic` ---
export const createUpdateActivityLog = async (
  userId: string,
  userName: string,
  orderId: string,
  logDetails: string,
  newStatus: IOrder["orderStatus"]
) => {
  try {
    const subject = ["Pending", "Cancelled"].includes(newStatus)
      ? "Reservation"
      : "Order";

    await ActivityLog.create({
      userId: userId || null,
      userName: userName,
      action: `${subject} Updated`,
      details: `${subject} #${orderId.slice(-6)}: ${logDetails.trim()}`,
      category: "orders",
    });
  } catch (logError) {
    console.error("Failed to create activity log for order update:", logError);
  }
};

export const createReceiptUploadNotification = async (
  updatedOrder: IOrder,
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

export const createStatusUpdateNotification = async (
  updatedOrder: IOrder,
  fieldsToSet: any,
  orderBeforeUpdate: IOrder
) => {
  let notificationMessage = "";
  let notificationType = "general";
  const orderIdShort = updatedOrder._id.toString().slice(-6);
  const isInstallment =
    updatedOrder.paymentInfo.paymentMethod === "installment";

  // Check if the order is NOW fully complete (Status is Completed AND Paid 100%)
  const isFullyComplete =
    updatedOrder.orderStatus === "Completed" &&
    updatedOrder.paymentInfo.paymentStatus === "100% Complete Paid";

  // Check if we JUST arrived at this state (to avoid spamming)
  const wasNotCompleteBefore =
    orderBeforeUpdate.orderStatus !== "Completed" ||
    orderBeforeUpdate.paymentInfo.paymentStatus !== "100% Complete Paid";

  if (isFullyComplete && wasNotCompleteBefore) {
    notificationMessage = `🎉 Congratulations! Your order #${orderIdShort} is fully paid and completed. Thank you for choosing us!`;
    notificationType = "order_completed";
  } else if (fieldsToSet.orderStatus) {
    const newStatus = fieldsToSet.orderStatus;

    // --- SCENARIO 1: Production Started -> Ask for 90% (Pre-Delivery) ---
    if (newStatus === "In Production" && isInstallment) {
      notificationMessage = `Action Required: Your order #${orderIdShort} is now in production. Please settle your Pre-Delivery Payment (40%) to proceed.`;
      notificationType = "payment_request"; // 💡 New Type
    }
    // --- SCENARIO 2: Shipped -> Ask for 100% (Final) ---
    else if (newStatus === "Shipped" && isInstallment) {
      notificationMessage = `Your order #${orderIdShort} has been shipped! Please settle your Final Payment (10%) to complete the turnover.`;
      notificationType = "payment_request"; // 💡 New Type
    }
    // --- SCENARIO 3: Verified (Existing Logic) ---
    else if (
      newStatus === "Processing" &&
      orderBeforeUpdate.orderStatus === "Pending"
    ) {
      notificationMessage = `Great news! Your reservation #${orderIdShort} has been verified. The next step is to complete your initial payment.`;
      notificationType = "reservation_confirmed";
    }
    // --- SCENARIO 4: Cancelled (Existing Logic) ---
    else if (newStatus === "Cancelled") {
      notificationMessage = `Your reservation #${orderIdShort} has been cancelled.`;
      notificationType = "order_update";
    }
    // --- SCENARIO 5: Generic Update ---
    else {
      notificationMessage = `Your order #${orderIdShort} status has been updated to '${newStatus}'.`;
      notificationType = "order_update";
    }
  } else if (fieldsToSet["paymentInfo.paymentStatus"]) {
    // ... (Payment status update logic - NO CHANGE) ...
    notificationMessage = `Payment status for order #${orderIdShort} updated to '${fieldsToSet["paymentInfo.paymentStatus"]}'.`;
    notificationType = "payment_update";
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
