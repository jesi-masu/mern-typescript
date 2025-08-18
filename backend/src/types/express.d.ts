// backend/src/types/express.d.ts
import { Request } from "express";
import { IUser } from "../models/userModel";

// ===================================
// Product Types
// ===================================
export interface ProductSpecifications {
  dimensions: string;
  height: string;
  foundation: string;
  structure: string;
  roof: string;
  windows: string;
  electrical: string;
  plumbing: string;
}

export interface ProductRequestBody {
  productName: string;
  productPrice: number;
  category: string;
  squareFeet: number;
  image?: string;
  images?: string[];
  productLongDescription?: string;
  productShortDescription?: string;
  threeDModelUrl?: string;
  features?: string[];
  specifications?: ProductSpecifications;
  inclusion?: string[];
  leadTime?: string;
}

// ===================================
// Auth Types
// ===================================
// Use the IUser interface for the body type to ensure consistency
export type AuthRequestBody = Omit<IUser, "createdAt" | "updatedAt">;

// ===================================
// Extend Express Request for custom properties
// ===================================
// This is used by our authentication middleware
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        role: "client" | "personnel" | "admin";
      };
    }
  }
}
