import { Request, Response, RequestHandler } from "express";
import ActivityLog from "../models/activityLogModel";

/**
 * @desc    Get all activity logs (with pagination, search, and filtering)
 * @route   GET /api/activity-logs
 * @access  Private (Admin & Personnel)
 */
export const getActivityLogs: RequestHandler = async (req, res) => {
  // --- MODIFICATION: Allow 'admin' and 'personnel' roles ---
  const allowedRoles = ["admin", "personnel"];
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    res.status(403).json({
      message: "Forbidden: You do not have permission to view logs.",
    });
    return;
  }
  // --- END MODIFICATION ---

  try {
    // --- Pagination ---
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // --- Filter & Search ---
    const { category, search } = req.query;

    // Build the query object for Mongoose
    const query: { [key: string]: any } = {};
    if (category && typeof category === "string" && category !== "all") {
      query.category = category;
    }
    if (search && typeof search === "string") {
      const searchRegex = { $regex: search, $options: "i" }; // 'i' for case-insensitive
      query.$or = [
        { action: searchRegex },
        { details: searchRegex },
        { userName: searchRegex },
      ];
    }

    // Get total count based on the *filters*
    const totalLogs = await ActivityLog.countDocuments(query);

    // Get the paginated logs based on the *filters*
    const logs = await ActivityLog.find(query)
      .sort({ createdAt: -1 }) // Show newest first
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      logs,
      page,
      limit,
      totalPages: Math.ceil(totalLogs / limit),
      totalLogs,
    });
  } catch (error: any) {
    console.error("Error fetching activity logs:", error.message);
    res
      .status(500)
      .json({ message: "Server error while fetching activity logs." });
  }
};
