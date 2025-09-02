// backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  role: "client" | "personnel" | "admin";
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader =
    req.headers.authorization || (req.headers as any).Authorization;

  if (!authHeader || typeof authHeader !== "string") {
    res.status(401).json({ error: "Authorization header not provided." });
    return;
  }

  // Expect header in format "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res
      .status(401)
      .json({ error: "Authorization header format must be 'Bearer <token>'." });
    return;
  }

  const token = parts[1];

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined.");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;

    // Attach user info to request (matches types in express.d.ts augmentation)
    req.user = { _id: payload.id, role: payload.role };

    next();
  } catch (error: any) {
    console.error("JWT verification failed:", error?.message || error);
    res.status(401).json({ error: "Request is not authorized." });
  }
};
