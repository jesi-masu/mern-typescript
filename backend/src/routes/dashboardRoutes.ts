// backend/src/routes/dashboardRoutes.ts

import express from "express";
import { getDashboardStats } from "../controllers/dashboardController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkRole } from "../middleware/checkRole";

const router = express.Router();

// This route is protected and only accessible by admin and personnel roles
router.get(
  "/stats",
  authMiddleware,
  checkRole(["admin", "personnel"]),
  getDashboardStats
);

export default router;
