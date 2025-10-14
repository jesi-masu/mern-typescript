// src/components/project-detail/ProjectHeroSection.tsx

import { Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Layers,
  Calendar,
  CheckCircle,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types";

interface ProjectHeroSectionProps {
  project: Project;
}

const ProjectHeroSection = ({ project }: ProjectHeroSectionProps) => {
  // Combine location fields for a cleaner display
  const fullLocation = `${project.cityMunicipality}, ${project.province}`;

  // Configuration for status badges
  const statusConfig = {
    "In Progress": {
      color: "bg-blue-500/10 text-blue-700 border-blue-200",
    },
    Completed: {
      color: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
    },
  };

  return (
    <section className="relative h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${project.image})` }}
      />
      {/* Overlays for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.1),transparent_70%)]" />

      <div className="container relative z-10 h-full flex flex-col justify-end pb-16">
        <Link
          to="/projects"
          className="flex items-center text-white/90 hover:text-white mb-8 transition-colors duration-300 group w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Projects
        </Link>

        <div className="max-w-4xl">
          {/* Status and Category Badges */}
          <div className="flex items-center gap-4 mb-6">
            <Badge
              className={`${
                statusConfig[project.projectStatus as keyof typeof statusConfig]
                  ?.color
              } border backdrop-blur-sm font-medium px-4 py-2`}
            >
              {project.projectStatus}
            </Badge>
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm font-medium px-4 py-2">
              {project.projectCategory}
            </Badge>
          </div>

          {/* Project Title and Description */}
          <h1 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
            {project.projectTitle}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl leading-relaxed font-light">
            {project.shortDescription}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-8 text-white/80">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{fullLocation}</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              <span>{project.modules} Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>
                {new Date(project.completionDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectHeroSection;
