// backend/src/routes/products.ts
import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productController";
// === FIX: Import the necessary middleware ===
import { authMiddleware } from "../middleware/authMiddleware";
import { checkRole } from "../middleware/checkRole";

const router = express.Router();

// ==========================================
// Public Routes (No Authentication Required)
// ===========================================

// GET ALL products
router.get("/", getProducts);

// GET a single product
router.get("/:id", getProduct);

// ===========================================
// Protected Routes (Authentication Required)
// ===========================================

// POST a new product
// Requires a valid JWT and a role of either 'admin' or 'personnel'
router.post(
  "/",
  authMiddleware,
  checkRole(["admin", "personnel"]),
  createProduct
);

// DELETE a product
// Requires a valid JWT and a role of 'admin'
router.delete("/:id", authMiddleware, checkRole(["admin"]), deleteProduct);

// UPDATE a product
// Requires a valid JWT and a role of either 'admin' or 'personnel'
router.put(
  "/:id",
  authMiddleware,
  checkRole(["admin", "personnel"]),
  updateProduct
);

export default router;
