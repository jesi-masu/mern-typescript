import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

type UserStatus = "active" | "on_leave" | "inactive";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: "client" | "personnel" | "admin";
  address?: {
    // Make address optional if not required for admin/personnel
    street: string;
    barangaySubdivision: string;
    additionalAddressLine?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  position?: string;
  department?: string;
  status?: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["client", "personnel", "admin"],
      default: "client",
      required: true,
    },
    address: {
      type: {
        street: { type: String, required: true, trim: true },
        barangaySubdivision: { type: String, required: true, trim: true },
        additionalAddressLine: { type: String, required: false, trim: true },
        city: { type: String, required: true, trim: true },
        province: { type: String, required: true, trim: true },
        postalCode: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
      },
      // Make address required only for clients
      required: function (this: IUser) {
        return this.role === "client";
      },
      _id: false,
    },
    position: { type: String, required: false, trim: true },
    department: { type: String, required: false, trim: true },
    status: {
      type: String,
      enum: ["active", "on_leave", "inactive"],
      default: "active",
      // ✅ FIX: Explicitly type 'this' as IUser
      required: function (this: IUser) {
        return this.role === "personnel" || this.role === "admin";
      },
    },
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next: (err?: any) => void) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
