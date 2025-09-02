import { RequestHandler } from "express";
import mongoose from "mongoose";
import User from "../models/userModel";
import { AuthRegisterBody } from "../types/express";

/**
 * GET /api/users
 */
export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error?.message || error);
    res.status(500).json({ error: error?.message || "Server error" });
  }
};

/**
 * GET /api/users/:id
 */
export const getUserById: RequestHandler<{ id: string }> = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid user id." });
    return;
  }

  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    if (
      req.user &&
      (req.user.role === "admin" ||
        req.user.role === "personnel" ||
        req.user._id === user.id)
    ) {
      res.status(200).json(user);
      return;
    }

    res.status(403).json({ error: "Forbidden: insufficient permissions." });
  } catch (error: any) {
    console.error("Error fetching user:", error?.message || error);
    res.status(400).json({ error: error?.message || "Invalid request." });
  }
};

/**
 * POST /api/users
 */
export const createUser: RequestHandler<{}, any, AuthRegisterBody> = async (
  req,
  res
) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    address,
    role = "client",
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phoneNumber ||
    !password ||
    !address
  ) {
    res.status(400).json({ error: "Please include all required fields." });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already in use." });
      return;
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      address,
      role,
    });

    const userObj = newUser.toObject();
    delete (userObj as any).password;

    res.status(201).json(userObj);
  } catch (error: any) {
    console.error("Error creating user:", error?.message || error);
    res.status(500).json({ error: error?.message || "Server error" });
  }
};

/**
 * PATCH /api/users/:id
 */
export const updateUser: RequestHandler<
  { id: string },
  any,
  Partial<AuthRegisterBody & { role?: "client" | "personnel" | "admin" }>
> = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid user id." });
    return;
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    if (
      !req.user ||
      !(
        req.user.role === "admin" ||
        req.user.role === "personnel" ||
        req.user._id === user.id
      )
    ) {
      res.status(403).json({ error: "Forbidden: insufficient permissions." });
      return;
    }

    const { email, password, role, ...otherUpdates } = req.body;

    Object.assign(user, otherUpdates);

    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing && existing.id !== user.id) {
        res.status(400).json({ error: "Email already in use." });
        return;
      }
      user.email = email;
    }

    if (role && req.user?.role === "admin") {
      user.role = role;
    }

    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();
    const userObj = updatedUser.toObject();
    delete (userObj as any).password;

    res.status(200).json(userObj);
  } catch (error: any) {
    console.error("Error updating user:", error?.message || error);
    res.status(400).json({ error: error?.message || "Invalid request." });
  }
};

/**
 * DELETE /api/users/:id
 */
export const deleteUser: RequestHandler<{ id: string }> = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid user id." });
    return;
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    if (!req.user || req.user.role !== "admin") {
      res.status(403).json({ error: "Forbidden: admin only." });
      return;
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error: any) {
    console.error("Error deleting user:", error?.message || error);
    res.status(500).json({ error: error?.message || "Server error" });
  }
};
