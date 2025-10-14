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
  leadTime?: string;
}

// ===================================
//            AUTH TYPES
// ===================================
export interface AuthRegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: {
    street: string;
    barangaySubdivision: string;
    additionalAddressLine?: string;
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

export type AuthRequestBody = AuthRegisterBody;

// ===================================
//      EXPRESS REQUEST EXTENSION
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
