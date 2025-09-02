// backend/src/middleware/validate.ts
import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export const validate =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Explicitly set return type
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next(); // Don't return next()
    } catch (error) {
      if (error instanceof ZodError) {
        // REMOVED 'return' from the line below
        res.status(400).json({
          message: "Input validation failed",
          errors: error.flatten().fieldErrors,
        });
        return; // Add a return here to exit the function
      }
      // REMOVED 'return' from the line below
      res.status(500).json({ message: "Internal server error" });
    }
  };
