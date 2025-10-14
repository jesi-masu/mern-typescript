// src/types/project.ts

export interface Project {
  _id: string;
  projectTitle: string;
  shortDescription: string;
  image: string;
  projectCategory: "Residential" | "Commercial" | "Industrial";
  projectStatus: "In Progress" | "Completed";
  modules: number;
  completionDate: string;
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
  createdAt: string;
  updatedAt: string;
}
