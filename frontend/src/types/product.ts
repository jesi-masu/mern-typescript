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

// Define the main Product interface for the frontend
// This should mirror the IProduct interface from your backend's productModel.ts
export interface Product {
  _id: string; // MongoDB's default ID, usually a string
  productName: string;
  productPrice: number;
  category: string;
  squareFeet: number;
  image?: string;
  images?: string[]; // Matches backend (array of strings)
  productLongDescription?: string;
  productShortDescription?: string; // Matches backend
  threeDModelUrl?: string;
  features?: string[]; // Matches backend
  specifications?: ProductSpecifications; // Matches backend, using the nested interface
  inclusion?: string[]; // Matches backend
  leadTime?: string; // Matches backend
  createdAt: string; // Dates often come as strings from API
  updatedAt: string; // Dates often come as strings from API
}
