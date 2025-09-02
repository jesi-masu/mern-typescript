// backend/src/server.ts
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/products";
import userRoutes from "./routes/userRoutes"; // <- new

import dashboardRoutes from "./routes/dashboardRoutes"; // <-- add

dotenv.config();

const app = express();

app.use(express.json());
// Consider limiting origins in production
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes); // <- new
app.use("/api/dashboard", dashboardRoutes);

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
