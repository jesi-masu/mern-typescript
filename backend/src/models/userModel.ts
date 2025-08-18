// backend/ src/models/userModel.ts
import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Define an interface for the User document
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: "client" | "personnel" | "admin";
  address: {
    street: string;
    barangay: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date; // Add the custom method to the interface
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["client", "personnel", "admin"],
      default: "client",
      required: true,
    },
    address: {
      type: {
        street: { type: String, required: true, trim: true },
        barangay: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        province: { type: String, required: true, trim: true },
        postalCode: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
      },
      required: true,
      _id: false,
    },
  },
  { timestamps: true }
);

// Mongoose Pre-save hook for password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// A method to compare a provided password with the stored hashed password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Use IUser as the generic type for mongoose.model
const User = mongoose.model<IUser>("User", userSchema);

export default User;
