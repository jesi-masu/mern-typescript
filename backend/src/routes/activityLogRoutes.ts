// backend/src/routes/activityLogRoutes.ts

import express from "express";
import { getActivityLogs } from "../controllers/activityLogController";

// ====================================================================
// IMPORTANT: Adjust this import path to match your auth middleware file
// This is the middleware that attaches `req.user` to the request
// ====================================================================
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// @route   GET /api/activity-logs
// 'protect' ensures user is logged in.
// 'getActivityLogs' controller will then check if the user is an 'admin'.
router.route("/").get(authMiddleware, getActivityLogs);

export default router;
