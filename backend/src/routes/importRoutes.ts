import express from "express";
import multer from "multer";
import {
  importHistoricalOrders,
  createManualHistoricalOrder,
} from "../controllers/importController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkRole } from "../middleware/checkRole";

const router = express.Router();

// Configure multer to store uploaded files temporarily in an 'uploads/' directory
const upload = multer({ dest: "uploads/" });

/**
 * @route   POST /api/import/historical-orders
 * @desc    Upload a CSV file for bulk historical order import
 * @access  Private (Admin, Personnel)
 */
router.post(
  "/historical-orders",
  authMiddleware,
  checkRole(["admin", "personnel"]),
  upload.single("file"), // 'file' must match the key in the frontend FormData
  importHistoricalOrders
);

/**
 * @route   POST /api/import/historical-order-manual
 * @desc    Create a single historical order via form submission
 * @access  Private (Admin, Personnel)
 */
router.post(
  "/historical-order-manual",
  authMiddleware,
  checkRole(["admin", "personnel"]),
  createManualHistoricalOrder
);

export default router;
