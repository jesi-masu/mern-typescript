// backend/src/routes/userRoutes.ts
import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkRole } from "../middleware/checkRole";

const router = express.Router();

// GET all users (admin/personnel only)
router.get("/", authMiddleware, checkRole(["admin", "personnel"]), getAllUsers);

// GET single user by id (authenticated users; controller enforces access)
router.get("/:id", authMiddleware, getUserById);

// POST create user (admin/personnel only)
router.post("/", authMiddleware, checkRole(["admin", "personnel"]), createUser);

// PATCH update user (self, admin, or personnel)
router.patch("/:id", authMiddleware, updateUser);

// DELETE remove user (admin only)
router.delete("/:id", authMiddleware, checkRole(["admin"]), deleteUser);

export default router;
