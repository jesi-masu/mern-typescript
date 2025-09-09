// backend/src/routes/orderRoutes.ts
import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder, // <-- ADDED: Import the new update controller
} from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkRole } from "../middleware/checkRole";

const router = express.Router();

// POST /api/orders - Create a new order (for logged-in clients)
router.post("/", authMiddleware, checkRole(["client"]), createOrder);

// GET /api/orders - Get all orders (for admins and personnel)
router.get("/", authMiddleware, checkRole(["admin", "personnel"]), getOrders);

// GET /api/orders/:id - Get a single order by ID (for admins, personnel, or the order owner)
router.get("/:id", authMiddleware, getOrderById);

// PATCH /api/orders/:id - Update an order (for admins and personnel)
router.patch(
  "/:id",
  authMiddleware,
  checkRole(["admin", "personnel"]),
  updateOrder
);

export default router;
