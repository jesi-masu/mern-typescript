import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllClients,
  getAllPersonnel, // ✅ Import the new controller
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkRole } from "../middleware/checkRole";

const router = express.Router();

// GET all users (potentially keep for high-level admin, or remove if getAllPersonnel/getAllClients covers needs)
router.get("/", authMiddleware, checkRole(["admin"]), getAllUsers);

// GET all users with role 'client' (for customer management)
router.get(
  "/clients",
  authMiddleware,
  checkRole(["admin", "personnel"]),
  getAllClients
);

// ✅ NEW: GET all users with role 'admin' or 'personnel'
router.get(
  "/personnel",
  authMiddleware,
  checkRole(["admin"]), // Restrict this to admins only
  getAllPersonnel
);

// GET single user by id
router.get("/:id", authMiddleware, getUserById);

// POST create user (can be used by admin to add personnel)
// Note: Ensure createUser handles role, position, department, status
router.post("/", authMiddleware, checkRole(["admin"]), createUser);

// PATCH update user (self, admin)
router.patch("/:id", authMiddleware, updateUser);

// DELETE remove user (admin only)
router.delete("/:id", authMiddleware, checkRole(["admin"]), deleteUser);

export default router;
