import { Request, Response, RequestHandler } from "express";
import mongoose from "mongoose";
import Order, { IOrder } from "../models/orderModel";
import User from "../models/userModel";
import Product from "../models/productModel";
import Notification from "../models/notificationModel";
import ActivityLog from "../models/activityLogModel"; // Ensure this model is imported

// Helper function to safely get user name from authenticated request
const getUserName = (req: Request): string => {
  // Access firstName and lastName directly if they exist on req.user
  const firstName = (req.user as any)?.firstName || "";
  const lastName = (req.user as any)?.lastName || "";
  return `${firstName} ${lastName}`.trim() || "System";
};

export const getUserOrders: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated." });
      return;
    }
    const orders = await Order.find({ userId })
      .populate("products.productId", "productName image productPrice")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error: any) {
    console.error("Error fetching user orders:", error.message);
    res
      .status(500)
      .json({ message: "Server error while fetching user orders." });
  }
};

export const createOrder: RequestHandler = async (req, res) => {
  try {
    const {
      products,
      customerInfo,
      paymentInfo,
      contractInfo,
      totalAmount,
      locationImages,
    } = req.body;
    if (
      !products ||
      !Array.isArray(products) ||
      products.length === 0 ||
      !customerInfo ||
      !paymentInfo ||
      !contractInfo ||
      !totalAmount
    ) {
      res
        .status(400)
        .json({ message: "Please provide all required order fields." });
      return;
    }
    const userId = req.user?._id; // Customer ID
    if (!userId) {
      res.status(401).json({ message: "User not authenticated." });
      return;
    }
    const productIds = products.map((p: any) => p.productId);
    const foundProducts = await Product.find({ _id: { $in: productIds } });
    if (foundProducts.length !== productIds.length) {
      res.status(404).json({ message: "One or more products not found." });
      return;
    }
    const newOrder: IOrder = await Order.create({
      userId,
      products,
      customerInfo,
      paymentInfo,
      contractInfo,
      totalAmount,
      locationImages,
      source: "live",
    });
    // --- Create Activity Log for Order Creation ---
    try {
      await ActivityLog.create({
        userId: userId, // ID of the customer who placed the order
        userName: `${customerInfo.firstName} ${customerInfo.lastName}`, // Customer's name
        action: `Order Created`,
        details: `Order #${newOrder._id
          .toString()
          .slice(-6)} placed. Total: ₱${totalAmount.toLocaleString()}`,
        category: "orders",
      });
      console.log(`Activity log created for new order ${newOrder._id}`);
    } catch (logError) {
      console.error(
        "Failed to create activity log for order creation:",
        logError
      );
    }
    // --- End Activity Log ---
    // --- Notification Logic ---
    try {
      const staffUsers = await User.find({
        role: { $in: ["admin", "personnel"] },
      }).select("_id");
      if (staffUsers.length > 0) {
        const staffNotificationMessage = `New order #${newOrder._id
          .toString()
          .slice(-6)} placed by ${customerInfo.firstName} ${
          customerInfo.lastName
        }.`;
        const staffNotificationType = "new_order_admin";
        const staffNotificationPromises = staffUsers.map((staff) =>
          Notification.create({
            userId: staff._id,
            orderId: newOrder._id,
            message: staffNotificationMessage,
            type: staffNotificationType,
          })
        );
        await Promise.all(staffNotificationPromises);
      }
      const clientNotificationMessage = `Your order #${newOrder._id
        .toString()
        .slice(-6)} has been successfully placed.`;
      const clientNotificationType = "order_placed_confirmation";
      await Notification.create({
        userId: userId,
        orderId: newOrder._id,
        message: clientNotificationMessage,
        type: clientNotificationType,
      });
    } catch (notificationError) {
      console.error("Failed to create notifications:", notificationError);
    }
    // --- End Notification Logic ---
    res.status(201).json(newOrder);
  } catch (error: any) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ message: "Server error while creating order." });
  }
};

export const getOrders: RequestHandler = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "firstName lastName email")
      .populate(
        "products.productId",
        "productName productPrice image squareFeet productShortDescription category"
      )
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error: any) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Server error while fetching orders." });
  }
};

export const getOrderById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid Order ID format." });
    return;
  }
  try {
    const order = await Order.findById(id)
      .populate("userId", "firstName lastName email")
      .populate("products.productId");
    if (!order) {
      res.status(404).json({ message: "Order not found." });
      return;
    }
    if (!order.userId || !(order.userId as any)._id) {
      res.status(500).json({
        message: "Order data is incomplete (missing user reference).",
      });
      return;
    }
    const orderOwnerId = (order.userId as any)._id.toString();
    if (req.user?.role === "client" && orderOwnerId !== req.user?._id) {
      res.status(403).json({
        message: "Forbidden: You are not authorized to view this order.",
      });
      return;
    }
    res.status(200).json(order);
  } catch (error: any) {
    console.error("Error fetching order by ID:", error.message);
    res.status(500).json({ message: "Server error while fetching the order." });
  }
};

export const updateOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { orderStatus, paymentStatus, paymentReceiptUrl, paymentStage } =
    req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid Order ID format." });
    return;
  }
  try {
    const orderBeforeUpdate = await Order.findById(id).lean();
    if (!orderBeforeUpdate) {
      res.status(404).json({ message: "Order not found." });
      return;
    }
    if (req.user?.role === "client") {
      if (orderBeforeUpdate.userId.toString() !== req.user?._id) {
        res
          .status(403)
          .json({ message: "Forbidden: You can only update your own orders." });
        return;
      }
      if (orderStatus || paymentStatus) {
        res
          .status(403)
          .json({ message: "Clients cannot update order or payment status." });
        return;
      }
    }
    const updateData: {
      $set?: { [key: string]: any };
      $push?: { [key: string]: any };
    } = {};
    const fieldsToSet: { [key: string]: string } = {};
    let logDetails = "";
    if (req.user?.role !== "client") {
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
    if (paymentReceiptUrl && paymentStage) {
      if (!["initial", "pre_delivery", "final"].includes(paymentStage)) {
        res.status(400).json({ message: "Invalid payment stage provided." });
        return;
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
      res.status(400).json({ message: "No valid fields provided for update." });
      return;
    }
    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrder) {
      res
        .status(404)
        .json({ message: "Order not found after update attempt." });
      return;
    }
    // --- Create Activity Log for Order Update ---
    if (logDetails.trim()) {
      try {
        await ActivityLog.create({
          userId: req.user?._id || null, // ID of user making the change
          userName: getUserName(req), // Name of user making the change
          action: `Order Updated`,
          details: `Order #${id.slice(-6)}: ${logDetails.trim()}`,
          category: "orders",
        });
        console.log(`Activity log created for order update ${id}`);
      } catch (logError) {
        console.error(
          "Failed to create activity log for order update:",
          logError
        );
      }
    }
    // --- End Activity Log ---

    // --- ADMIN NOTIFICATION LOGIC (for receipt upload) ---
    if (paymentReceiptUrl && paymentStage) {
      try {
        // Find all admin and personnel users
        const staffUsers = await User.find({
          role: { $in: ["admin", "personnel"] },
        }).select("_id");

        if (staffUsers.length > 0) {
          // --- MODIFICATION: Create a human-readable label ---
          let stageLabel = "Payment"; // Default
          if (paymentStage === "initial") {
            stageLabel = "Initial Payment (50%)";
          } else if (paymentStage === "pre_delivery") {
            stageLabel = "Pre-Delivery Payment (40%)";
          } else if (paymentStage === "final") {
            stageLabel = "Final Payment (10%)";
          }
          // --- END MODIFICATION ---

          // Get customer name from the order
          const customerName = `${updatedOrder.customerInfo.firstName} ${updatedOrder.customerInfo.lastName}`;

          // --- MODIFICATION: Update message to include the label ---
          const adminMessage = `Receipt for [${stageLabel}] uploaded for order #${updatedOrder._id
            .toString()
            .slice(-6)} by ${customerName}.`;

          // Create a notification for each staff member
          const notificationPromises = staffUsers.map((staff) =>
            Notification.create({
              userId: staff._id, // The admin/personnel user's ID
              orderId: updatedOrder._id,
              message: adminMessage, // Use the new, more specific message
              type: "payment_uploaded",
            })
          );
          await Promise.all(notificationPromises);
        }
      } catch (notificationError) {
        console.error(
          "Failed to create admin notification for receipt upload:",
          notificationError
        );
        // Do not fail the main request, just log this error
      }
    }
    // --- END OF ADMIN NOTIFICATION LOGIC ---

    // --- Create Notification Logic (For Client) ---
    let notificationMessage = "";
    let notificationType = "general";
    if (fieldsToSet.orderStatus) {
      notificationMessage = `Your order #${id.slice(
        -6
      )} status has been updated to '${fieldsToSet.orderStatus}'.`;
      notificationType = "order_update";
    } else if (fieldsToSet["paymentInfo.paymentStatus"]) {
      notificationMessage = `Payment status for order #${id.slice(
        -6
      )} updated to '${fieldsToSet["paymentInfo.paymentStatus"]}'.`;
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
        console.error("Failed to create notification:", notificationError);
      }
    }
    // --- End Notification Logic ---
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    console.error("Error updating order:", error.message);
    const status = error?.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      message: error?.message || "Server error while updating order.",
    });
  }
};

export const getAllUploads: RequestHandler = async (req, res) => {
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
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .select("customerInfo paymentInfo locationImages createdAt _id");
    const uploads = orders.flatMap((order) => {
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
            status: "pending",
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
    res.status(200).json(uploads);
  } catch (error: any) {
    console.error("Error fetching uploads:", error);
    res.status(500).json({ error: "Failed to fetch uploads." });
  }
};
