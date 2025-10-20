import express from "express";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notificationController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Apply auth middleware to all notification routes
router.use(authMiddleware);

router.get("/", getUserNotifications);
router.patch("/:id/read", markNotificationAsRead);
router.patch("/read-all", markAllNotificationsAsRead); // Route to mark all as read

export default router;
