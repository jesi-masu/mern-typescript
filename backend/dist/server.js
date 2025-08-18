"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/server.ts
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
// Import your new authentication routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const products_1 = __importDefault(require("./routes/products"));
dotenv_1.default.config();
// express app
const app = (0, express_1.default)();
// middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});
// ===================================
// ADD THE AUTHENTICATION ROUTES HERE
// ===================================
app.use("/api/auth", authRoutes_1.default);
// existing product routes
app.use("/api/products", products_1.default);
// Error handling for unhandled routes (404)
app.use((req, res, next) => {
    res.status(404).json({ message: "API route not found" });
});
// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || "An unexpected server error occurred",
        error: process.env.NODE_ENV === "development" ? err : {},
    });
});
// connection to db
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Connected to DB & Listening on port", process.env.PORT);
    });
})
    .catch((error) => {
    console.error("Database connection error:", error);
});
