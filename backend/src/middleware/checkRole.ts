// backend/src/middleware/checkRole.ts
import { Request, Response, NextFunction } from "express";

// Define the role type for consistency across the application
type UserRole = "client" | "personnel" | "admin";

export const checkRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Check if the user object was attached by the authMiddleware.
    // If not, it means the auth token was missing or invalid.
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated." });
      return;
    }

    // Check if the user's role is included in the list of allowed roles.
    // req.user.role comes from the JWT payload verified in authMiddleware.
    if (!allowedRoles.includes(req.user.role)) {
      // If the role is not allowed, return a 403 Forbidden error.
      res.status(403).json({
        error: "Forbidden: You do not have the required permissions.",
      });
      return;
    }

    // If the user has a valid role, continue to the next middleware or controller.
    next();
  };
};
