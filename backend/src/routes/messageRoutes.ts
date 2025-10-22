// backend/src/routes/messageRoutes.ts
import express from "express";
import {
  createMessage,
  getMessages,
  updateMessageStatus, // ✏️ Add this
  deleteMessage, // ✏️ Add this
} from "../controllers/messageController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Public route for anyone to send a message
// POST /api/messages
router.post("/", createMessage);

// Protected route for an admin to view messages
// GET /api/messages
router.get("/", authMiddleware, getMessages);

// ✏️ --- NEW ROUTE ---
// Route to update a message (e.g., mark as read, archive)
// PATCH /api/messages/:id
router.patch("/:id", authMiddleware, updateMessageStatus);

// ✏️ --- NEW ROUTE ---
// Route to delete a message
// DELETE /api/messages/:id
router.delete("/:id", authMiddleware, deleteMessage);

export default router;
