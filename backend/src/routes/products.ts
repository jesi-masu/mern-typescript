// backend/src/routes/products.ts
import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkRole } from "../middleware/checkRole";

const router = express.Router();

// Public Routes
router.get("/", getProducts);
router.get("/:id", getProduct);

// Protected Routes
router.post(
  "/",
  authMiddleware,
  checkRole(["admin", "personnel"]),
  createProduct
);

router.delete("/:id", authMiddleware, checkRole(["admin"]), deleteProduct);

// UPDATE a product using PATCH for partial updates
router.patch(
  // <-- Changed from PUT to PATCH
  "/:id",
  authMiddleware,
  checkRole(["admin", "personnel"]),
  updateProduct
);

export default router;
