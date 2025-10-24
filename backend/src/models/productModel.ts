// backend/src/models/productModel.ts
import mongoose, { Document, Schema } from "mongoose";

// --- 1. DEFINE THE INTERFACE AND SCHEMA FOR A SINGLE PART ---
export interface IProductPart {
  name: string;
  quantity: number;
  price?: number;
  image: string;
  description?: string;
}

const productPartSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    price: { type: Number, required: false },
    image: { type: String, required: true },
    description: { type: String, required: false },
  },
  { _id: false }
);

// --- 2. DEFINE THE MAIN PRODUCT INTERFACE ---
export interface IProduct extends Document {
  productName: string;
  productPrice: number;
  category: string;
  squareFeet: number;
  stock: number;
  image?: string;
  productLongDescription?: string;
  productShortDescription?: string;
  threeDModelUrl?: string;
  images?: string[];
  features?: string[];
  specifications?: {
    dimensions: string;
    height: string;
    foundation: string;
    structure: string;
    roof: string;
    windows: string;
    electrical: string;
    plumbing: string;
  };
  inclusion?: string[];
  exclusion?: string[];
  productParts?: IProductPart[]; // <-- ADDED THIS FIELD
  leadTime?: string;
  createdAt: Date;
  updatedAt: Date;
  // Note: The 'description' field you had directly in the schema might have been a mistake?
  // If you intended a main description, it should be here too.
  // description?: string; // <-- Uncomment if you need a top-level description
}

// --- 3. DEFINE THE MAIN PRODUCT SCHEMA ---
const productSchema: Schema = new Schema(
  {
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    category: { type: String, required: true },
    squareFeet: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    image: { type: String, required: false },
    productLongDescription: { type: String, required: false },
    productShortDescription: { type: String, required: false },
    threeDModelUrl: { type: String, required: false },
    images: { type: [String], required: false },
    // Removed the standalone 'description' field - Assuming it was meant for parts. Add back if needed.
    // description: { type: String, required: false },
    features: { type: [String], required: false },
    specifications: {
      type: {
        dimensions: String,
        height: String,
        foundation: String,
        structure: String,
        roof: String,
        windows: String,
        electrical: String,
        plumbing: String,
      },
      required: false,
      _id: false,
    },
    inclusion: { type: [String], required: false },
    exclusion: { type: [String], required: false },
    productParts: {
      // <-- ADDED THIS FIELD
      type: [productPartSchema],
      required: false,
    },
    leadTime: { type: String, required: false },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
