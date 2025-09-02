// backend/src/routes/authRoutes.ts
import express from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { validate } from "../middleware/validate";
import { registerUserSchema, loginUserSchema } from "../lib/validators";

const router = express.Router();

// POST a new user to register
router.post("/register", validate(registerUserSchema), registerUser);

// POST a user to log in
router.post("/login", validate(loginUserSchema), loginUser);

export default router;
