// backend/src/models/productModel.ts
import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Product document
// This interface will represent the structure of a product in MongoDB
export interface IProduct extends Document {
  productName: string;
  productPrice: number;
  category: string;
  squareFeet: number;
  image?: string;
  productLongDescription?: string;
  productShortDescription?: string; // Newly added
  threeDModelUrl?: string;
  images?: string[]; // Newly added: Array of strings
  features?: string[]; // Newly added: Array of strings

  specifications?: {
    // Newly added: Nested object
    dimensions: string;
    height: string;
    foundation: string;
    structure: string;
    roof: string;
    windows: string;
    electrical: string;
    plumbing: string;
  };
  inclusion?: string[]; // Newly added: Array of strings
  leadTime?: string; // Newly added
  createdAt: Date;
  updatedAt: Date;
}

const productSchema: Schema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    squareFeet: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    productLongDescription: {
      type: String,
      required: false,
    },
    productShortDescription: {
      // Newly added
      type: String,
      required: false,
    },
    threeDModelUrl: {
      type: String,
      required: false,
    },
    images: {
      // Newly added
      type: [String], // Array of strings
      required: false,
    },
    features: {
      // Newly added
      type: [String], // Array of strings
      required: false,
    },
    specifications: {
      // Newly added
      type: {
        // Nested Object
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
    inclusion: {
      // Newly added
      type: [String], // Array of strings
      required: false,
    },
    leadTime: {
      // Newly added
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Use IProduct as the generic type for mongoose.model
const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
