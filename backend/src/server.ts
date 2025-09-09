import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/products";
import userRoutes from "./routes/userRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import orderRoutes from "./routes/orderRoutes";
import uploadRoutes from "./routes/uploadRoutes"; // <-- ADDED: Import for the upload routes

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes); // <-- ADDED: Use the new upload routes

app.use((req, res, next) => {
  res.status(404).json({ message: "API route not found" });
});

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

const PORT = parseInt(process.env.PORT || "4000", 10);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Connected to DB & Listening on port", PORT);
    });
  })
  .catch((error: any) => {
    console.error("Database connection error:", error);
  });
