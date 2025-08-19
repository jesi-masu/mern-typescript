import { RequestHandler } from "express";
import mongoose from "mongoose";
import User from "../models/userModel";
import { AuthRegisterBody } from "../types/express";

/**
 * GET /api/users
 * Protected: admin or personnel (enforced on the route)
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
 * Controller enforces that a user may fetch:
 *  - their own record OR
 *  - any record if they are admin or personnel
 */
export const getUserById: RequestHandler<{ id: string }> = async (req, res) => {
  const { id } = req.params;

  // Basic validation of id
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
 * Create a new user. Route should be protected (admin/personnel) via middleware.
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

    // Use User.create so pre-save hook hashes password
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
 * Update a user. Allowed when:
 *  - requester is admin or personnel OR
 *  - requester is the same user (self update)
 *
 * If password is provided, this code assigns it to the document and calls save()
 * so the model pre('save') hook runs and hashes the password.
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

    // Permission check: admin/personnel OR owner
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

    const { firstName, lastName, email, phoneNumber, address, role, password } =
      req.body;

    // If email is changed, ensure uniqueness
    if (email && email !== user.email) {
      const other = await User.findOne({ email });
      if (other && other.id !== user.id) {
        res
          .status(400)
          .json({ error: "Email already in use by another user." });
        return;
      }
      user.email = email;
    }

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (address !== undefined) user.address = address;
    if (role !== undefined && req.user.role === "admin") {
      // Only allow admin to change role (simple safeguard)
      user.role = role;
    }

    if (password !== undefined) {
      // Assign password and call save() so pre('save') hook hashes it
      user.password = password;
    }

    const saved = await user.save();

    const savedObj = saved.toObject();
    delete (savedObj as any).password;

    res.status(200).json(savedObj);
  } catch (error: any) {
    console.error("Error updating user:", error?.message || error);
    res.status(400).json({ error: error?.message || "Invalid request." });
  }
};

/**
 * DELETE /api/users/:id
 * Delete a user. Route should be protected (admin only) via middleware.
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

    // Route-level middleware should restrict to admin, but double-check:
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
