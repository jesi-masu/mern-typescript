// backend/src/services/logService.ts

import User from "../models/userModel";
import ActivityLog, { ActivityLogCategory } from "../models/activityLogModel";

/**
 * Creates and saves an activity log entry.
 * This is designed to be "fire and forget" - it won't throw an error
 * that stops the parent function (e.g., createOrder) from completing.
 *
 * @param userId - The ID of the user performing the action (or null for system).
 * @param action - A short title for the action (e.g., "Order Updated").
 * @param details - A descriptive string of what happened.
 * @param category - The category of the action.
 */
export const logActivity = async (
  userId: string | null | undefined,
  action: string,
  details: string,
  category: ActivityLogCategory
): Promise<void> => {
  try {
    let userName = "System";

    if (userId) {
      // Find the user to get their name
      const user = await User.findById(userId)
        .select("firstName lastName")
        .lean();
      if (user) {
        userName = `${user.firstName} ${user.lastName}`;
      } else {
        userName = "Unknown User"; // User might have been deleted
      }
    }

    // Create the log entry
    await ActivityLog.create({
      userId: userId || null,
      userName,
      action,
      details,
      category,
    });
  } catch (error: any) {
    // Log the error, but don't stop the main application flow
    console.error("Failed to write activity log:", error.message);
  }
};
