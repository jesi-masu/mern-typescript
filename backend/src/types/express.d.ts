import { Request } from "express";

// ===================================
//          PROJECT TYPES
// ===================================
export interface ProjectRequestBody {
  projectTitle: string;
  shortDescription: string;
  image: string;
  projectCategory: "Residential" | "Commercial" | "Industrial";
  projectStatus: "In Progress" | "Completed";
  modules: number;
  completionDate: string | Date;
  cityMunicipality: string;
  province: string;
  country: string;
  longDescription?: string;
  images?: string[];
  features?: string[];
  layoutImages?: string[];
  threeDLink?: string;
  layoutDesc?: string;
  projectVideoLink?: string;
  videoDesc?: string;
  imagesDesc?: string[];
}

// ===================================
//          PRODUCT TYPES
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
  exclusion?: string[];
  leadTime?: string;
}

// ===================================
//           AUTH TYPES
// ===================================
export interface AuthRegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  // Make address optional if it's not required for admin/personnel
  address?: {
    street: string;
    barangaySubdivision: string;
    additionalAddressLine?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  role?: "client" | "personnel" | "admin";
  // ✅ ADDED THESE OPTIONAL FIELDS
  position?: string;
  department?: string;
  status?: "active" | "on_leave" | "inactive";
}

export interface AuthLoginBody {
  email: string;
  password: string;
}

// Consider if AuthRequestBody should also include the new fields if it's used elsewhere
// If AuthRequestBody is purely for registration, this is fine.
export type AuthRequestBody = AuthRegisterBody;

// ===================================
//    EXPRESS REQUEST EXTENSION
// ===================================
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

// Make sure IUser is imported if you use it directly in Omit (or define types here)
// Example assuming IUser fields were used for Omit:
// export interface AuthRegisterBody extends Omit<IUser, 'password' | 'role' | 'createdAt' | 'updatedAt' | 'comparePassword' | '_id' | 'address'> {
//   password?: string;
//   role?: "client" | "personnel" | "admin";
//   address?: { /* ... address fields ... */ }; // Need to redefine address if IUser makes it required
//   position?: string;
//   department?: string;
//   status?: "active" | "on_leave" | "inactive";
// }
