// backend/src/lib/validators.ts
import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    address: z.object({
      street: z.string().min(1, "Street is required"),
      barangaySubdivision: z
        .string()
        .min(1, "Barangay/Subdivision is required"),
      city: z.string().min(1, "City is required"),
      province: z.string().min(1, "Province is required"),
      postalCode: z.string().min(1, "Postal code is required"),
      country: z.string().min(1, "Country is required"),
    }),
    role: z.enum(["client", "personnel", "admin"]).optional(),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email("A valid email is required"),
    password: z.string().min(1, "Password is required"),
  }),
});
