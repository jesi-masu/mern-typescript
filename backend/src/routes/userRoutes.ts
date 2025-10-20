import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllClients,
  getAllPersonnel,
  changePassword, // Make sure this is imported
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkRole } from "../middleware/checkRole";

const router = express.Router();

// --- Define Specific Routes BEFORE routes with parameters ---

// PATCH change password (for the logged-in user)
// ✅ MOVED THIS ROUTE UP
router.patch("/change-password", authMiddleware, changePassword);

// GET all users with role 'client'
router.get(
  "/clients",
  authMiddleware,
  checkRole(["admin", "personnel"]),
  getAllClients
);

// GET all users with role 'admin' or 'personnel'
router.get("/personnel", authMiddleware, checkRole(["admin"]), getAllPersonnel);

// --- General Routes ---

// GET all users (consider restricting further if needed)
router.get("/", authMiddleware, checkRole(["admin"]), getAllUsers);

// --- Routes with :id Parameter ---

// GET single user by id
router.get("/:id", authMiddleware, getUserById);

// POST create user (can be used by admin to add personnel)
router.post("/", authMiddleware, checkRole(["admin"]), createUser); // Note: POST usually doesn't conflict like PATCH/GET

// PATCH update user (self, admin)
// ✅ KEPT THIS ROUTE AFTER the specific /change-password route
router.patch("/:id", authMiddleware, updateUser);

// DELETE remove user (admin only)
router.delete("/:id", authMiddleware, checkRole(["admin"]), deleteUser);

export default router;
