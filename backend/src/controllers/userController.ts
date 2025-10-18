import { RequestHandler } from "express";
import mongoose from "mongoose";
import User, { IUser } from "../models/userModel"; // Assuming IUser includes the new fields
import { AuthRegisterBody } from "../types/express"; // Assuming this includes the new optional fields

/**
 * GET /api/users/clients
 * Fetches only users with the 'client' role and aggregates their order data.
 */
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

/**
 * GET /api/users/personnel
 * Fetches users with 'admin' or 'personnel' roles.
 */
export const getAllPersonnel: RequestHandler = async (req, res) => {
  try {
    const personnel = await User.find({ role: { $in: ["admin", "personnel"] } })
      .select(
        "_id firstName lastName email phoneNumber role position department status createdAt"
      ) // Select only necessary fields
      .sort({ createdAt: -1 }); // Sort by join date, newest first

    res.status(200).json(personnel);
  } catch (error: any) {
    console.error("Error fetching personnel:", error?.message || error);
    res.status(500).json({ error: "Server error fetching personnel data." });
  }
};

/**
 * GET /api/users
 * Fetches all users (consider restricting further if needed).
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
    // Allow admin, personnel, or the user themselves to view the profile
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
 * Creates a new user (client, personnel, or admin). Accessible only by admin.
 */
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
    role = "client", // Default to client if role isn't specified
    position,
    department,
    status,
  } = req.body;

  // Basic validation for core fields
  if (!firstName || !lastName || !email || !phoneNumber || !password) {
    res
      .status(400)
      .json({
        error:
          "Please include all required fields (name, email, phone, password).",
      });
    return;
  }
  // Address is required only for clients based on the updated model logic
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
      address: role === "client" ? address : undefined, // Only add address if client
      role,
      position,
      department,
      status:
        role === "admin" || role === "personnel"
          ? status || "active"
          : undefined, // Set status only for admin/personnel
    });

    const userObj = newUser.toObject();
    delete (userObj as any).password; // Remove password before sending response
    res.status(201).json(userObj);
  } catch (error: any) {
    console.error("Error creating user:", error?.message || error);
    res.status(500).json({ error: error?.message || "Server error" });
  }
};

/**
 * PATCH /api/users/:id
 * Updates user information. Admin/personnel can update others, users can update themselves.
 */
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
    res.status(400).json({ error: "Invalid user id." });
    return;
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    // Check permissions: Admin/Personnel can edit others, users can only edit themselves
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

    // Users cannot change their own role or status (only admin/personnel)
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

    // Admin can change roles
    if (req.body.role && req.user?.role !== "admin") {
      res
        .status(403)
        .json({ error: "Forbidden: Only admins can change user roles." });
      return;
    }

    // Prepare updates, excluding password initially
    const { password, ...otherUpdates } = req.body;
    Object.assign(user, otherUpdates);

    // Handle password update separately if provided
    if (password) {
      user.password = password; // The pre-save hook will hash it
    }

    const updatedUser = await user.save();
    const userObj = updatedUser.toObject();
    delete (userObj as any).password;
    res.status(200).json(userObj);
  } catch (error: any) {
    console.error("Error updating user:", error?.message || error);
    // Handle potential duplicate email error from Mongoose unique index
    if (error.code === 11000) {
      res.status(400).json({ error: "Email already in use." });
      return;
    }
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
    // Only admins can delete users
    if (!req.user || req.user.role !== "admin") {
      res.status(403).json({ error: "Forbidden: admin only." });
      return;
    }
    // Prevent admin from deleting themselves? Optional check:
    // if (req.user._id === user.id) {
    //   res.status(400).json({ error: "Cannot delete your own admin account." });
    //   return;
    // }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error: any) {
    console.error("Error deleting user:", error?.message || error);
    res.status(500).json({ error: error?.message || "Server error" });
  }
};
