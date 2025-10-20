import { RequestHandler } from "express";
import mongoose from "mongoose";
import User, { IUser } from "../models/userModel";
import { AuthRegisterBody } from "../types/express";
import bcrypt from "bcryptjs";

export const getAllClients: RequestHandler = async (req, res) => {
  try {
    const clients = await User.aggregate([
      { $match: { role: "client" } },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "orders",
        },
      },
      {
        $addFields: {
          totalOrders: { $size: "$orders" },
          totalSpent: { $sum: "$orders.totalAmount" },
        },
      },
      { $project: { password: 0, orders: 0 } },
      { $sort: { totalSpent: -1 } },
    ]);
    res.status(200).json(clients);
  } catch (error: any) {
    console.error("Error fetching client data:", error?.message || error);
    res.status(500).json({ error: "Server error fetching client data." });
  }
};

export const getAllPersonnel: RequestHandler = async (req, res) => {
  try {
    const personnel = await User.find({ role: { $in: ["admin", "personnel"] } })
      .select(
        "_id firstName lastName email phoneNumber role position department status createdAt"
      )
      .sort({ createdAt: -1 });
    res.status(200).json(personnel);
  } catch (error: any) {
    console.error("Error fetching personnel:", error?.message || error);
    res.status(500).json({ error: "Server error fetching personnel data." });
  }
};

export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error?.message || error);
    res.status(500).json({ error: error?.message || "Server error" });
  }
};

export const getUserById: RequestHandler<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    // This is likely where the "Invalid user id" error originates
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

export const createUser: RequestHandler<
  {},
  any,
  Partial<AuthRegisterBody>
> = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    address,
    role = "client",
    position,
    department,
    status,
  } = req.body;

  if (!firstName || !lastName || !email || !phoneNumber || !password) {
    res
      .status(400)
      .json({
        error:
          "Please include all required fields (name, email, phone, password).",
      });
    return;
  }
  if (role === "client" && !address) {
    res.status(400).json({ error: "Address is required for client users." });
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
      address: role === "client" ? address : undefined,
      role,
      position,
      department,
      status:
        role === "admin" || role === "personnel"
          ? status || "active"
          : undefined,
    });

    const userObj = newUser.toObject();
    delete (userObj as any).password;
    res.status(201).json(userObj);
  } catch (error: any) {
    console.error("Error creating user:", error?.message || error);
    res.status(500).json({ error: error?.message || "Server error" });
  }
};

export const updateUser: RequestHandler<
  { id: string },
  any,
  Partial<
    AuthRegisterBody & {
      role?: "client" | "personnel" | "admin";
      position?: string;
      department?: string;
      status?: "active" | "on_leave" | "inactive";
    }
  >
> = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    // This could also be the source of the "Invalid user id" error
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

    if (req.user._id === user.id && (req.body.role || req.body.status)) {
      if (req.user.role !== "admin" && req.user.role !== "personnel") {
        res
          .status(403)
          .json({
            error: "Forbidden: You cannot change your own role or status.",
          });
        return;
      }
    }

    if (req.body.role && req.user?.role !== "admin") {
      res
        .status(403)
        .json({ error: "Forbidden: Only admins can change user roles." });
      return;
    }

    const { password, ...otherUpdates } = req.body;
    Object.assign(user, otherUpdates);

    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();
    const userObj = updatedUser.toObject();
    delete (userObj as any).password;
    res.status(200).json(userObj);
  } catch (error: any) {
    console.error("Error updating user:", error?.message || error);
    if (error.code === 11000) {
      res.status(400).json({ error: "Email already in use." });
      return;
    }
    res.status(400).json({ error: error?.message || "Invalid request." });
  }
};

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

export const changePassword: RequestHandler = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?._id;

  console.log("--- Change Password Attempt ---");
  console.log("Received User ID:", userId);
  console.log("Received Current Password:", currentPassword);
  console.log(
    "Received New Password:",
    newPassword ? "(present)" : "(missing)"
  );

  if (!userId) {
    console.log("Authentication error: No user ID found in req.user");
    res.status(401).json({ error: "User not authenticated." });
    return;
  }
  // Check if userId is a valid ObjectId format BEFORE trying to use it
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.log(
      "Authentication error: req.user._id is not a valid ObjectId format:",
      userId
    );
    res.status(401).json({ error: "Invalid authentication token data." });
    return;
  }

  if (!currentPassword || !newPassword) {
    res
      .status(400)
      .json({ error: "Current password and new password are required." });
    return;
  }
  if (newPassword.length < 8) {
    res
      .status(400)
      .json({ error: "New password must be at least 8 characters long." });
    return;
  }

  try {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      console.log("User not found in DB for ID:", userId);
      res.status(404).json({ error: "User not found." });
      return;
    }
    console.log("User found:", user.email);
    console.log(
      "Stored Hashed Password:",
      user.password ? "(present)" : "(missing!)"
    );

    const isMatch = await user.comparePassword(currentPassword);
    console.log("Password comparison result (isMatch):", isMatch);

    if (!isMatch) {
      res.status(400).json({ error: "Incorrect current password." });
      return;
    }

    console.log("Password matches, attempting to save new password...");
    user.password = newPassword;
    await user.save();
    console.log("New password saved successfully.");

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error: any) {
    console.error("Error changing password:", error?.message || error);
    res
      .status(500)
      .json({ error: error?.message || "Server error changing password." });
  }
};
