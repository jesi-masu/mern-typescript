import { RequestHandler } from "express";
import mongoose from "mongoose";
import Notification from "../models/notificationModel";

/**
 * GET /api/notifications
 * Fetches notifications for the logged-in user.
 */
export const getUserNotifications: RequestHandler = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    res.status(401).json({ message: "User not authenticated." });
    return;
  }

  try {
    // Fetch unread notifications + maybe recent read ones, sorted newest first
    const notifications = await Notification.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(20); // Limit the number returned

    res.status(200).json(notifications);
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error fetching notifications." });
  }
};

/**
 * PATCH /api/notifications/:id/read
 * Marks a specific notification as read.
 */
export const markNotificationAsRead: RequestHandler = async (req, res) => {
  const userId = req.user?._id;
  const notificationId = req.params.id;

  if (!userId) {
    res.status(401).json({ message: "User not authenticated." });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    res.status(400).json({ message: "Invalid notification ID." });
    return;
  }

  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: userId }, // Ensure user owns the notification
      { readStatus: true },
      { new: true } // Return the updated document
    );

    if (!notification) {
      res
        .status(404)
        .json({
          message: "Notification not found or you don't have permission.",
        });
      return;
    }

    res.status(200).json(notification);
  } catch (error: any) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Server error updating notification." });
  }
};

/**
 * PATCH /api/notifications/read-all
 * Marks all unread notifications for the user as read.
 */
export const markAllNotificationsAsRead: RequestHandler = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    res.status(401).json({ message: "User not authenticated." });
    return;
  }

  try {
    const updateResult = await Notification.updateMany(
      { userId: userId, readStatus: false },
      { $set: { readStatus: true } }
    );

    res
      .status(200)
      .json({
        message: `Marked ${updateResult.modifiedCount} notifications as read.`,
      });
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Server error updating notifications." });
  }
};
