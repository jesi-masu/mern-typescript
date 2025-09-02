// backend/src/controllers/authController.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel";
import { AuthRequestBody } from "../types/express";

const createToken = (
  id: string,
  role: "client" | "personnel" | "admin"
): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be defined in the environment variables");
  }
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

export const registerUser = async (
  req: Request<any, any, AuthRequestBody>,
  res: Response
): Promise<void> => {
  // No need for manual validation here anymore
  const { firstName, lastName, email, phoneNumber, password, address, role } =
    req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already in use." });
      return;
    }

    const newUser: IUser = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      address,
      role,
    });

    const token = createToken(newUser._id!.toString(), newUser.role);

    res.status(201).json({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
      token,
    });
  } catch (error: any) {
    console.error("Error during user registration:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (
  req: Request<any, any, Pick<IUser, "email" | "password">>,
  res: Response
): Promise<void> => {
  // No need for manual validation here anymore
  const { email, password } = req.body;

  try {
    const user: IUser | null = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      res.status(400).json({ error: "Invalid credentials." });
      return;
    }

    const token = createToken(user._id!.toString(), user.role);

    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error: any) {
    console.error("Error during user login:", error.message);
    res.status(400).json({ error: error.message });
  }
};
