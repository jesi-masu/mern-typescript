// frontend/src/types/product.ts

// Define the interface for the 'specifications' object
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

// --- 1. ADD THIS NEW INTERFACE FOR A SINGLE PART ---
export interface IProductPart {
  name: string;
  quantity: number;
  price?: number;
  image: string;
  description?: string;
  // Note: No _id here if it's a sub-document
}

// Define the main Product interface for the frontend
export interface Product {
  _id: string; // MongoDB's default ID, usually a string
  productName: string;
  productPrice: number;
  category: string;
  squareFeet: number;
  stock: number;
  image?: string;
  images?: string[]; // Matches backend (array of strings)
  productLongDescription?: string;
  productShortDescription?: string; // Matches backend
  threeDModelUrl?: string;
  features?: string[]; // Matches backend
  specifications?: ProductSpecifications; // Matches backend, using the nested interface
  inclusion?: string[]; // Matches backend
  exclusion?: string[];
  productParts?: IProductPart[]; // <-- 2. ADD THIS LINE
  leadTime?: string; // Matches backend
  createdAt: string; // Dates often come as strings from API
  updatedAt: string; // Dates often come as strings from API
}
