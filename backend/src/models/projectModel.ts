// backend/src/models/projectModel.ts

import { Schema, model, Document } from "mongoose";

export interface IProject extends Document {
  projectTitle: string;
  shortDescription: string;
  image: string;
  projectCategory: "Residential" | "Commercial" | "Industrial";
  projectStatus: "In Progress" | "Completed";
  modules: number;
  completionDate: Date;
  cityMunicipality: string;
  province: string;
  country: string;
  longDescription?: string;
  images?: string[];
  features?: string[];
  highlights?: string[];
  layoutImages?: string[];
  threeDLink?: string;
  layoutDesc?: string;
  projectVideoLink?: string;
  videoDesc?: string;
  imagesDesc?: string[];
}

const projectSchema = new Schema<IProject>(
  {
    projectTitle: { type: String, required: true },
    shortDescription: { type: String, required: true },
    image: { type: String, required: true },
    projectCategory: {
      type: String,
      required: true,
      enum: ["Residential", "Commercial", "Industrial"],
    },
    projectStatus: {
      type: String,
      required: true,
      enum: ["In Progress", "Completed"],
      default: "In Progress",
    },
    modules: { type: Number, required: true },
    completionDate: { type: Date, required: true },
    cityMunicipality: { type: String, required: true },
    province: { type: String, required: true },
    country: { type: String, required: true },
    longDescription: { type: String, required: false },
    images: { type: [String], required: false },
    features: { type: [String], required: false },
    highlights: { type: [String], required: false },
    layoutImages: { type: [String], required: false },
    threeDLink: { type: String, required: false },
    layoutDesc: { type: String, required: false },
    projectVideoLink: { type: String, required: false },
    videoDesc: { type: String, required: false },
    imagesDesc: { type: [String], required: false },
  },
  { timestamps: true }
);

const Project = model<IProject>("Project", projectSchema);

export default Project;
