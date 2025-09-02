// backend/src/routes/dashboardRoutes.ts
import express from "express";
import { getDashboardStats } from "../controllers/dashboardController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkRole } from "../middleware/checkRole";

const router = express.Router();

// GET /api/dashboard/stats - admin & personnel only
router.get(
  "/stats",
  authMiddleware,
  checkRole(["admin", "personnel"]),
  getDashboardStats
);

export default router;
