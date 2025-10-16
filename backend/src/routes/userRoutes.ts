import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllClients, // Import the new controller
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkRole } from "../middleware/checkRole";

const router = express.Router();

// GET all users (admin/personnel only)
router.get("/", authMiddleware, checkRole(["admin", "personnel"]), getAllUsers);

// GET all users with role 'client' (for customer management page)
router.get(
  "/clients",
  authMiddleware,
  checkRole(["admin", "personnel"]),
  getAllClients
);

// GET single user by id (authenticated users; controller enforces access)
router.get("/:id", authMiddleware, getUserById);

// POST create user (admin/personnel only)
router.post("/", authMiddleware, checkRole(["admin", "personnel"]), createUser);

// PATCH update user (self, admin, or personnel)
router.patch("/:id", authMiddleware, updateUser);

// DELETE remove user (admin only)
router.delete("/:id", authMiddleware, checkRole(["admin"]), deleteUser);

export default router;
