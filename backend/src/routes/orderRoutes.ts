// backend/src/routes/orderRoutes.ts

import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  getUserOrders,
  getAllUploads, // <-- IMPORT THE NEW CONTROLLER
} from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkRole } from "../middleware/checkRole";

const router = express.Router();

// --- Client facing routes ---
router.get("/my-orders", authMiddleware, checkRole(["client"]), getUserOrders);
router.post("/", authMiddleware, checkRole(["client"]), createOrder);

// --- Admin/Personnel facing routes ---
router.get("/", authMiddleware, checkRole(["admin", "personnel"]), getOrders);

// ✅ ADD THE NEW ROUTE FOR FETCHING ALL UPLOADS
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
