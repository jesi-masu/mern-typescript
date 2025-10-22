// backend/src/controllers/messageController.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import Message from "../models/messageModel";

// (createMessage function is already fixed and correct)
export const createMessage = async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    res.status(400).json({ mssg: "Please fill in all required fields." });
    return;
  }
  try {
    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
    });
    res.status(201).json(newMessage);
  } catch (error: any) {
    res
      .status(500)
      .json({ mssg: "Failed to send message", error: error.message });
  }
};

// (getMessages function is already correct)
export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error: any) {
    res
      .status(500)
      .json({ mssg: "Failed to fetch messages", error: error.message });
  }
};

// --- ✏️ APPLY FIX HERE ---
export const updateMessageStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    // 1. Remove 'return'
    res.status(404).json({ mssg: "No such message" });
    // 2. Add 'return;'
    return;
  }

  if (!["read", "archived"].includes(status)) {
    // 1. Remove 'return'
    res.status(400).json({ mssg: "Invalid status" });
    // 2. Add 'return;'
    return;
  }

  try {
    const message = await Message.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    if (!message) {
      // 1. Remove 'return'
      res.status(404).json({ mssg: "No such message" });
      // 2. Add 'return;'
      return;
    }
    res.status(200).json(message);
  } catch (error: any) {
    res.status(500).json({ mssg: error.message });
  }
};

// --- ✏️ AND APPLY FIX HERE ---
export const deleteMessage = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    // 1. Remove 'return'
    res.status(404).json({ mssg: "No such message" });
    // 2. Add 'return;'
    return;
  }

  try {
    const message = await Message.findByIdAndDelete(id);
    if (!message) {
      // 1. Remove 'return'
      res.status(404).json({ mssg: "No such message" });
      // 2. Add 'return;'
      return;
    }
    res.status(200).json(message);
  } catch (error: any) {
    res.status(500).json({ mssg: error.message });
  }
};
