// backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// We'll define this interface here for use in this file.
// The Express interface is in express.d.ts.
interface TokenPayload {
  id: string;
  role: "client" | "personnel" | "admin";
}

// FIX: This function now only returns void or calls next().
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ error: "Authorization token not provided." });
    return;
  }

  const token = authorization.split(" ")[1];

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined.");
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;

    // Use '_id' to match the express.d.ts type definition
    req.user = { _id: payload.id, role: payload.role };

    next();
  } catch (error: any) {
    console.error("JWT verification failed:", error.message);
    res.status(401).json({ error: "Request is not authorized." });
    return;
  }
};
