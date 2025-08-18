// backend/src/routes/authRoutes.ts
import express from "express";
import { registerUser, loginUser } from "../controllers/authController";

const router = express.Router();

// POST a new user to register
router.post("/register", registerUser);

// POST a user to log in
router.post("/login", loginUser);

export default router;
