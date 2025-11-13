// src/controllers/orderController.ts

import { Request, Response, RequestHandler } from "express";
import mongoose from "mongoose";
import * as OrderService from "../services/orderService"; // Import the new service
import { getUserName } from "../utils/userHelpers"; // Import the helper

// Define a type for your user object (you should share this across your app)
type AuthenticatedUser = {
  _id: string;
  role: "client" | "admin" | "personnel";
  firstName?: string;
  lastName?: string;
};

// A helper to safely get the authenticated user
const getAuthUser = (req: Request): AuthenticatedUser => {
  if (!req.user) {
    // This should ideally be caught by your auth middleware, but it's a good safeguard
    throw new Error("User not authenticated.");
  }
  return req.user as AuthenticatedUser;
};

// ✏️ 1. UPDATED THE ERROR HANDLER TO RETURN 'void'
// This fixes the 'catch' block return type for all controllers
const handleControllerError = (
  res: Response,
  error: any,
  context: string
): void => {
  console.error(`Error in ${context}:`, error.message);

  // Send specific status codes based on error messages
  if (error.message.includes("not found")) {
    res.status(404).json({ message: error.message });
    return;
  }
  if (
    error.message.includes("Forbidden") ||
    error.message.includes("not authenticated") ||
    error.message.includes("not authorized")
  ) {
    res.status(403).json({ message: error.message });
    return;
  }
  if (
    error.message.includes("Invalid") ||
    error.message.includes("required fields") ||
    error.message.includes("Not enough stock") ||
    error.message.includes("no longer be cancelled")
  ) {
    res.status(400).json({ message: error.message });
    return;
  }

  // Default server error
  res.status(500).json({ message: `Server error during ${context}.` });
};

// --- CONTROLLER FUNCTIONS ---

export const createOrder: RequestHandler = async (req, res) => {
  try {
    const user = getAuthUser(req);
    const customerName = `${user.firstName} ${user.lastName}`;

    // Call the service to do the work
    const newOrder = await OrderService.createOrderLogic(
      req.body,
      user._id,
      customerName
    );

    res.status(201).json(newOrder);
  } catch (error: any) {
    handleControllerError(res, error, "createOrder");
  }
};

export const updateOrder: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid Order ID format." });
    return;
  }

  try {
    const user = getAuthUser(req);
    const userName = getUserName(req);

    // Call the service
    const updatedOrder = await OrderService.updateOrderLogic(
      id,
      req.body,
      user,
      userName
    );

    res.status(200).json(updatedOrder);
  } catch (error: any) {
    handleControllerError(res, error, "updateOrder");
  }
};

export const cancelOrder: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    // FIXED: Send the response, then return.
    res.status(400).json({ message: "Invalid Order ID format." });
    return;
  }

  try {
    const user = getAuthUser(req);
    const userName = getUserName(req); // For logging

    // Call the service to do the work
    const cancelledOrder = await OrderService.cancelOrderLogic(
      id,
      user._id,
      userName
    );

    res.status(200).json(cancelledOrder);
  } catch (error: any) {
    handleControllerError(res, error, "cancelOrder"); // This now returns void
  }
};

export const getUserOrders: RequestHandler = async (req, res) => {
  try {
    const user = getAuthUser(req);
    const orders = await OrderService.getUserOrdersLogic(user._id);
    res.status(200).json(orders);
  } catch (error: any) {
    handleControllerError(res, error, "getUserOrders");
  }
};

export const getOrders: RequestHandler = async (req, res) => {
  try {
    const orders = await OrderService.getAllOrdersLogic();
    res.status(200).json(orders);
  } catch (error: any) {
    handleControllerError(res, error, "getOrders");
  }
};

export const getOrderById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    // ✏️ 4. FIXED THE PATTERN (send, then return)
    res.status(400).json({ message: "Invalid Order ID format." });
    return;
  }

  try {
    const user = getAuthUser(req);
    const order = await OrderService.getOrderByIdLogic(id, user);
    res.status(200).json(order);
  } catch (error: any) {
    handleControllerError(res, error, "getOrderById");
  }
};

export const getAllUploads: RequestHandler = async (req, res) => {
  try {
    const uploads = await OrderService.getAllUploadsLogic();
    res.status(200).json(uploads);
  } catch (error: any) {
    handleControllerError(res, error, "getAllUploads");
  }
};
