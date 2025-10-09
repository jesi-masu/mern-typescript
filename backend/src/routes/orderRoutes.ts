// backend/src/routes/orderRoutes.ts
import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  getUserOrders,
} from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkRole } from "../middleware/checkRole";

const router = express.Router();

// --- NEW ROUTE for logged-in users to get their own orders ---
router.get("/my-orders", authMiddleware, checkRole(["client"]), getUserOrders);

// POST /api/orders - Create a new order (for logged-in clients)
router.post("/", authMiddleware, checkRole(["client"]), createOrder);

// GET /api/orders - Get all orders (for admins and personnel)
router.get("/", authMiddleware, checkRole(["admin", "personnel"]), getOrders);

// GET /api/orders/:id - Get a single order by ID (for admins, personnel, or the order owner)
router.get("/:id", authMiddleware, getOrderById);

// --- FIX: REMOVED the restrictive checkRole middleware ---
// PATCH /api/orders/:id - Update an order.
// The controller itself now handles the specific permissions.
router.patch(
  "/:id",
  authMiddleware,
  // checkRole(["admin", "personnel"]), // <-- This line was removed
  updateOrder
);

export default router;
