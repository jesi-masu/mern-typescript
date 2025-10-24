// src/utils/userHelpers.ts

import { Request } from "express";

/**
 * Helper function to safely get user name from an authenticated request.
 * Used for creating activity logs.
 */
export const getUserName = (req: Request): string => {
  // Access firstName and lastName directly if they exist on req.user
  const firstName = (req.user as any)?.firstName || "";
  const lastName = (req.user as any)?.lastName || "";
  return `${firstName} ${lastName}`.trim() || "System";
};
