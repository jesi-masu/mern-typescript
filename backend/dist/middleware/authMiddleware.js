"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "Authorization token not provided." });
    }
    const token = authorization.split(" ")[1];
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not defined.");
        }
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // === FIX HERE: Assign 'payload.id' to '_id' for consistency with Mongoose and express.d.ts ===
        // Use the non-null assertion '!' on payload.id and payload.role
        req.user = { _id: payload.id, role: payload.role };
        next();
    }
    catch (error) {
        console.error("JWT verification failed:", error.message);
        res.status(401).json({ error: "Request is not authorized." });
    }
};
exports.authMiddleware = authMiddleware;
