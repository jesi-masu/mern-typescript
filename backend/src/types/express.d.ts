import { Request } from "express";

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

// Auth DTOs (explicit separate types instead of using IUser)
export interface AuthRegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: {
    street: string;
    barangaySubdivision: string;
    additionalAddressLine?: string; // <-- ADDED: New optional field
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  role?: "client" | "personnel" | "admin";
}

export interface AuthLoginBody {
  email: string;
  password: string;
}

// Use the register DTO as the request body type for register handlers
export type AuthRequestBody = AuthRegisterBody;

// Extend Express Request for custom properties (module augmentation)
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
