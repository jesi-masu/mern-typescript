// backend/src/routes/orderRoutes.ts

import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  getUserOrders,
  getAllUploads,
  cancelOrder,
} from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkRole } from "../middleware/checkRole";

const router = express.Router();

// --- Client facing routes ---
router.get("/my-orders", authMiddleware, checkRole(["client"]), getUserOrders);
router.post("/", authMiddleware, checkRole(["client"]), createOrder);

// ✏️ 2. ADD THE NEW CANCELLATION ROUTE
// This allows a client to cancel their *own* order
router.patch("/:id/cancel", authMiddleware, checkRole(["client"]), cancelOrder);

// --- Admin/Personnel facing routes ---
router.get("/", authMiddleware, checkRole(["admin", "personnel"]), getOrders);

// route for fetching uploads
router.get(
  "/uploads",
  authMiddleware,
  checkRole(["admin", "personnel"]),
  getAllUploads
);

// This route can be accessed by clients to view their own order, or admin/personnel to view any
router.get("/:id", authMiddleware, getOrderById);

// This route allows clients to update their own orders (e.g., add receipts)
// and allows admin/personnel to update status
router.patch("/:id", authMiddleware, updateOrder);

export default router;
