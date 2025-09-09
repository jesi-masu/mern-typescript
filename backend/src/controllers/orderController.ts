// backend/src/controllers/orderController.ts
import { RequestHandler } from "express";
import mongoose from "mongoose";
import Order, { IOrder } from "../models/orderModel";
import User from "../models/userModel";
import Product from "../models/productModel";

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private (Client)
 */
export const createOrder: RequestHandler = async (req, res) => {
  try {
    const { productId, customerInfo, paymentInfo, contractInfo, totalAmount } =
      req.body;

    // Basic validation
    if (
      !productId ||
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

    // Check if the user ID from the token exists
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated." });
      return;
    }

    // Verify that the user and product exist in the database
    const userExists = await User.findById(userId);
    const productExists = await Product.findById(productId);

    if (!userExists || !productExists) {
      res.status(404).json({ message: "User or Product not found." });
      return;
    }

    const newOrder: IOrder = await Order.create({
      userId,
      productId,
      customerInfo,
      paymentInfo,
      contractInfo,
      totalAmount,
      // Default statuses are set in the model
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
      .populate("userId", "firstName lastName email") // Populate with user details
      .populate("productId", "productName productPrice") // Populate with product details
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
      .populate("productId"); // Populate with full product details

    if (!order) {
      res.status(404).json({ message: "Order not found." });
      return;
    }

    // Security Check: Ensure the requester is either an admin/personnel or the user who owns the order
    if (
      req.user?.role === "client" &&
      order.userId.toString() !== req.user?._id
    ) {
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
 * @desc    Update an order's status
 * @route   PATCH /api/orders/:id
 * @access  Private (Admin/Personnel)
 */
export const updateOrder: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { orderStatus, paymentStatus } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid Order ID format." });
    return;
  }

  // Build an object with the fields to update
  const updateData: { orderStatus?: string; paymentStatus?: string } = {};
  if (orderStatus) updateData.orderStatus = orderStatus;
  if (paymentStatus) updateData.paymentStatus = paymentStatus;

  // Check if there is anything to update
  if (Object.keys(updateData).length === 0) {
    res.status(400).json({
      message: "Please provide at least one field to update.",
    });
    return;
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
    });

    if (!updatedOrder) {
      res.status(404).json({ message: "Order not found." });
      return;
    }

    res.status(200).json(updatedOrder);
  } catch (error: any) {
    console.error("Error updating order:", error.message);
    // Handle potential validation errors from the schema
    const status = error?.name === "ValidationError" ? 400 : 500;
    res
      .status(status)
      .json({
        message: error?.message || "Server error while updating order.",
      });
  }
};
