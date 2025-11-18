import mongoose from "mongoose";
import Order from "../models/orderModel";
import Product from "../models/productModel";
import ActivityLog from "../models/activityLogModel"; // Needed for initial log
import * as OrderHelpers from "./orderServiceHelpers"; // Import everything from helpers

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

    // 2. Prepare Tracking Update
    const initialTrackingUpdate = {
      status: "Pending",
      message:
        "Your reservation has been submitted and is awaiting verification.",
      timestamp: new Date(),
    };

    // 3. Create Order
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
          trackingUpdates: [initialTrackingUpdate],
        },
      ],
      { session }
    );
    if (!newOrder) {
      throw new Error("Order creation failed.");
    }

    // 4. Create Activity Log (Directly here for transactional integrity)
    await ActivityLog.create(
      [
        {
          userId: userId,
          userName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          action: `Reservation Placed`,
          details: `Reservation #${newOrder._id
            .toString()
            .slice(
              -6
            )} submitted by customer. Total: ₱${totalAmount.toLocaleString()}`,
          category: "orders",
        },
      ],
      { session, ordered: true }
    );

    // 5. Create Notifications (Side effect helper)
    await OrderHelpers.createOrderNotifications(
      newOrder,
      customerInfo,
      session
    );

    // 6. Commit
    await session.commitTransaction();
    return newOrder;
  } catch (error: any) {
    await session.abortTransaction();
    throw error;
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
  const fieldsToSet: { [key: string]: any } = {};
  let logDetails = "";
  let newTrackingUpdate: any = null;

  // Admin-only fields
  if (user.role !== "client") {
    if (orderStatus && orderStatus !== orderBeforeUpdate.orderStatus) {
      fieldsToSet.orderStatus = orderStatus;
      logDetails += `Status changed from '${orderBeforeUpdate.orderStatus}' to '${orderStatus}'. `;

      newTrackingUpdate = {
        status: orderStatus,
        message: `Your order status has been updated to "${orderStatus}".`,
        timestamp: new Date(),
      };
    }

    if (
      paymentStatus &&
      paymentStatus !== orderBeforeUpdate.paymentInfo.paymentStatus
    ) {
      fieldsToSet["paymentInfo.paymentStatus"] = paymentStatus;
      logDetails += `Payment status changed from '${orderBeforeUpdate.paymentInfo.paymentStatus}' to '${paymentStatus}'. `;

      // Auto-update Installment Stage Logic
      if (orderBeforeUpdate.paymentInfo.paymentMethod === "installment") {
        if (paymentStatus === "90% Complete Paid") {
          fieldsToSet["paymentInfo.installmentStage"] = "pre_delivery";
          logDetails += `Installment stage auto-updated to 'pre_delivery'. `;
        } else if (paymentStatus === "100% Complete Paid") {
          fieldsToSet["paymentInfo.installmentStage"] = "final";
          logDetails += `Installment stage auto-updated to 'final'. `;
        } else if (paymentStatus === "50% Complete Paid") {
          fieldsToSet["paymentInfo.installmentStage"] = "initial";
          logDetails += `Installment stage auto-updated to 'initial'. `;
        } else if (paymentStatus === "Pending") {
          fieldsToSet["paymentInfo.installmentStage"] = "initial";
          logDetails += `Installment stage auto-updated to 'initial'. `;
        }
      }

      // Now, when payment status changes, a log is added to the timeline.
      newTrackingUpdate = {
        status: paymentStatus, // e.g., "50% Complete Paid"
        message: `Payment update: ${paymentStatus}`,
        timestamp: new Date(),
      };
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
    // Initialize paymentReceipts if it doesn't exist
    if (!updateData.$set) updateData.$set = {};
    if (!orderBeforeUpdate.paymentInfo.paymentReceipts) {
      updateData.$set["paymentInfo.paymentReceipts"] = {};
    }

    // Use $push to add the new receipt to the array
    if (!updateData.$push) updateData.$push = {};
    updateData.$push[updatePath] = { $each: [paymentReceiptUrl] };

    logDetails += `Receipt uploaded for ${paymentStage} stage. `;

    newTrackingUpdate = {
      status: "Payment",
      message: `A new receipt was uploaded for the ${paymentStage} stage.`,
      timestamp: new Date(),
    };
  }

  // Add tracking update if one was created
  if (newTrackingUpdate) {
    if (!updateData.$push) updateData.$push = {};
    updateData.$push.trackingUpdates = newTrackingUpdate;
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

  // --- SIDE EFFECTS (Using Helpers) ---

  if (logDetails.trim()) {
    OrderHelpers.createUpdateActivityLog(
      user._id,
      userName,
      orderId,
      logDetails,
      updatedOrder.orderStatus
    );
  }

  if (paymentReceiptUrl && paymentStage) {
    OrderHelpers.createReceiptUploadNotification(updatedOrder, paymentStage);
  }

  if (fieldsToSet.orderStatus || fieldsToSet["paymentInfo.paymentStatus"]) {
    OrderHelpers.createStatusUpdateNotification(
      updatedOrder,
      fieldsToSet,
      orderBeforeUpdate
    );
  }

  return updatedOrder;
};

// --- Cancel Order Logic ---
export const cancelOrderLogic = async (
  orderId: string,
  userId: string,
  userName: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(orderId).session(session);

    if (!order) throw new Error("Order not found.");

    if (order.userId.toString() !== userId) {
      throw new Error(
        "Forbidden: You are not authorized to cancel this order."
      );
    }

    if (order.orderStatus !== "Pending") {
      throw new Error(
        "This reservation can no longer be cancelled as it is already being processed."
      );
    }

    const orderBeforeCancel = order.toObject();

    const cancelUpdate = {
      status: "Cancelled",
      message: "Your reservation has been successfully cancelled.",
      timestamp: new Date(),
    };

    // Update Status & Tracking
    order.orderStatus = "Cancelled";
    order.trackingUpdates.push(cancelUpdate);
    await order.save({ session });

    // Restore Stock
    const stockUpdatePromises = order.products.map((item) => {
      return Product.updateOne(
        { _id: item.productId },
        { $inc: { stock: item.quantity } }
      ).session(session);
    });
    await Promise.all(stockUpdatePromises);

    await session.commitTransaction();

    // --- SIDE EFFECTS (Using Helpers) ---
    const logDetails = `Reservation status changed from 'Pending' to 'Cancelled' by user.`;
    OrderHelpers.createUpdateActivityLog(
      userId,
      userName,
      orderId,
      logDetails,
      "Cancelled"
    );
    OrderHelpers.createStatusUpdateNotification(
      order,
      { orderStatus: "Cancelled" },
      orderBeforeCancel
    );

    return order;
  } catch (error: any) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// --- Read Logic (Getters) ---
export const getUserOrdersLogic = async (userId: string) => {
  return await Order.find({ userId })
    .populate(
      "products.productId",
      "productName image productPrice productShortDescription category productParts"
    )
    .sort({ createdAt: -1 });
};

export const getAllOrdersLogic = async () => {
  return await Order.find({})
    .populate("userId", "firstName lastName email")
    .populate(
      "products.productId",
      "productName productPrice image squareFeet productShortDescription category productParts"
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

  if (!order) throw new Error("Order not found.");

  // Auth check logic
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
    throw new Error("Forbidden: Cannot verify ownership for this order.");
  }

  return order;
};

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
    .select(
      "customerInfo paymentInfo locationImages createdAt _id orderStatus"
    );

  return orders.flatMap((order) => {
    const allUploads: Upload[] = [];
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
          allUploads.push({
            id: `${order._id}-${url}`,
            orderId: order._id.toString(),
            customerName,
            type: "payment_receipt",
            fileUrl: url,
            fileName: url.split("/").pop()?.split("?")[0] || "receipt.jpg",
            uploadDate: order.createdAt,
            status: order.orderStatus || "pending",
          });
        }
      });
    }

    if (order.locationImages && order.locationImages.length > 0) {
      order.locationImages.forEach((url) => {
        if (url) {
          allUploads.push({
            id: `${order._id}-${url}`,
            orderId: order._id.toString(),
            customerName,
            type: "location_image",
            fileUrl: url,
            fileName: url.split("/").pop()?.split("?")[0] || "location.jpg",
            uploadDate: order.createdAt,
            status: order.orderStatus || "pending",
          });
        }
      });
    }
    return allUploads;
  });
};
