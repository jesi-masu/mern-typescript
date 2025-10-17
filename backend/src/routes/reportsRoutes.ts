// backend/src/routes/reportsRoutes.ts

import express from "express";
import { getReportSummary } from "../controllers/reportsController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkRole } from "../middleware/checkRole";

const router = express.Router();

// This route will be protected, only for admin/personnel
router.get(
  "/summary",
  authMiddleware,
  checkRole(["admin", "personnel"]),
  getReportSummary
);

export default router;
