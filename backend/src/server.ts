// backend/src/server.ts
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Import your new authentication routes
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/products";

dotenv.config();

// express app
const app = express();

// middleware
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/auth", authRoutes);

// existing product routes
app.use("/api/products", productRoutes);

// Error handling for unhandled routes (404)
app.use((req, res, next) => {
  res.status(404).json({ message: "API route not found" });
});

// Global error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || "An unexpected server error occurred",
      error: process.env.NODE_ENV === "development" ? err : {},
    });
  }
);

// connection to db
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Connected to DB & Listening on port", process.env.PORT);
    });
  })
  .catch((error: any) => {
    console.error("Database connection error:", error);
  });
