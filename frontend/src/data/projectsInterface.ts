
export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  status: string;
  progress: number;
  modules: number;
  completionDate: string;
  location: string;
  category: "Residential" | "Commercial" | "Industrial";
  // Additional project detail fields
  clientName?: string;
  projectValue?: number;
  architect?: string;
  contractor?: string;
  startDate?: string;
  projectArea?: number;
  sustainability?: string;
  challenges?: string;
  features?: string;
  materials?: string;
  teamSize?: number;
  budget?: number;
}
