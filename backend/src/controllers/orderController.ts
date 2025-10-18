// backend/src/controllers/orderController.ts

import { Request, Response, RequestHandler } from "express";
import mongoose from "mongoose";
import Order, { IOrder } from "../models/orderModel";
import User from "../models/userModel";
import Product from "../models/productModel";
import { logActivity } from "../services/logService";

/**
 * @desc    Get orders for the logged-in user
 * @route   GET /api/orders/my-orders
 * @access  Private (Client)
 */
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

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private (Client)
 */
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

    const userId = req.user?._id;
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
    });

    await logActivity(
      userId,
      "Order Created",
      `New order ${newOrder._id} was placed.`,
      "orders"
    );

    res.status(201).json(newOrder);
  } catch (error: any) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ message: "Server error while creating order." });
  }
};

/**
 * @desc    Get all orders
 * @route   GET /api/orders
 * @access  Private (Admin/Personnel)
 */
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

/**
 * @desc    Get a single order by ID
 * @route   GET /api/orders/:id
 * @access  Private (Admin/Personnel or Order Owner)
 */
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

/**
 * @desc    Update an order (status or add payment receipt)
 * @route   PATCH /api/orders/:id
 * @access  Private (Admin/Personnel for status, Client for uploads)
 */
export const updateOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { orderStatus, paymentStatus, paymentReceiptUrl, paymentStage } =
    req.body;
  const currentUserId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid Order ID format." });
    return;
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ message: "Order not found." });
      return;
    }

    if (
      req.user?.role === "client" &&
      order.userId.toString() !== req.user?._id
    ) {
      res
        .status(403)
        .json({ message: "Forbidden: You can only update your own orders." });
      return;
    }

    const updateData: {
      $set?: { [key: string]: any };
      $push?: { [key: string]: any };
    } = {};

    const fieldsToSet: { [key: string]: string } = {};
    let logDetails = "";

    if (orderStatus) {
      fieldsToSet.orderStatus = orderStatus;
      logDetails += `Order status changed to ${orderStatus}. `;
    }

    if (paymentStatus) {
      fieldsToSet["paymentInfo.paymentStatus"] = paymentStatus;
      logDetails += `Payment status changed to ${paymentStatus}. `;

      if (order.paymentInfo.paymentMethod === "installment") {
        switch (paymentStatus) {
          case "50% Complete Paid":
            fieldsToSet["paymentInfo.installmentStage"] = "initial";
            break;
          case "90% Complete Paid":
            fieldsToSet["paymentInfo.installmentStage"] = "pre_delivery";
            break;
          case "100% Complete Paid":
            fieldsToSet["paymentInfo.installmentStage"] = "final";
            break;
          default:
            break;
        }
      }
    }

    if (Object.keys(fieldsToSet).length > 0) {
      if (req.user?.role === "client") {
        res
          .status(403)
          .json({ message: "Clients cannot update order status." });
        return;
      }
      updateData.$set = fieldsToSet;
    }

    if (paymentReceiptUrl && paymentStage) {
      if (!["initial", "pre_delivery", "final"].includes(paymentStage)) {
        res.status(400).json({ message: "Invalid payment stage provided." });
        return;
      }
      const updatePath = `paymentInfo.paymentReceipts.${paymentStage}`;
      updateData.$push = { [updatePath]: paymentReceiptUrl };
      logDetails += `Payment receipt for ${paymentStage} stage uploaded. `;
    }

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({
        message: "Please provide at least one field to update.",
      });
      return;
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (logDetails) {
      await logActivity(
        currentUserId,
        "Order Updated",
        `Order ${id} was updated: ${logDetails.trim()}`,
        "orders"
      );
    }

    res.status(200).json(updatedOrder);
  } catch (error: any) {
    console.error("Error updating order:", error.message);
    const status = error?.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      message: error?.message || "Server error while updating order.",
    });
  }
};
/**
 * @desc    Get all customer uploads (receipts and location images)
 * @route   GET /api/orders/uploads
 * @access  Private (Admin/Personnel)
 */
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
      // The redundant 'typedOrder' variable is removed. 'order' is now correctly typed.
      const allUploads: Upload[] = [];
      const customerName = `${order.customerInfo.firstName} ${order.customerInfo.lastName}`;

      // Process payment receipts
      if (order.paymentInfo?.paymentReceipts) {
        const receipts = order.paymentInfo.paymentReceipts;
        const allReceiptUrls = [
          ...(receipts.initial || []),
          ...(receipts.pre_delivery || []),
          ...(receipts.final || []),
        ];

        allReceiptUrls.forEach((url) => {
          allUploads.push({
            id: `${order._id}-${url}`, // No more error here
            orderId: order._id.toString(), // No more error here
            customerName,
            type: "payment_receipt",
            fileUrl: url,
            fileName: url.split("/").pop()?.split("?")[0] || "receipt.jpg",
            uploadDate: order.createdAt,
            status: "pending",
          });
        });
      }

      // Process location images
      if (order.locationImages && order.locationImages.length > 0) {
        order.locationImages.forEach((url) => {
          allUploads.push({
            id: `${order._id}-${url}`, // No more error here
            orderId: order._id.toString(), // No more error here
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
