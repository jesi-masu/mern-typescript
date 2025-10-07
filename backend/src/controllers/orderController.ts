// backend/src/controllers/orderController.ts
import { Request, Response, RequestHandler } from "express";
import mongoose from "mongoose";
import Order, { IOrder } from "../models/orderModel";
import User from "../models/userModel";
import Product from "../models/productModel";

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

    const productIds = products.map((p) => p.productId);
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
      // --- START: MODIFICATION ---
      // Added all necessary fields to the populate string for the admin modal
      .populate(
        "products.productId",
        "productName productPrice image squareFeet productShortDescription category"
      )
      // --- END: MODIFICATION ---
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
  const { orderStatus, paymentStatus, paymentReceiptUrl } = req.body;

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
      $set?: { [key: string]: string };
      $push?: { "paymentInfo.paymentReceipts": string };
    } = {};

    const fieldsToSet: { [key: string]: string } = {};

    if (orderStatus) {
      fieldsToSet.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      fieldsToSet["paymentInfo.paymentStatus"] = paymentStatus;
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

    if (paymentReceiptUrl) {
      updateData.$push = { "paymentInfo.paymentReceipts": paymentReceiptUrl };
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

    res.status(200).json(updatedOrder);
  } catch (error: any) {
    console.error("Error updating order:", error.message);
    const status = error?.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      message: error?.message || "Server error while updating order.",
    });
  }
};
