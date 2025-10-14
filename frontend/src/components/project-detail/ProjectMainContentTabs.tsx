// src/components/project-detail/ProjectMainContentTabs.tsx

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  Calendar,
  MapPin,
  Layers,
  Award,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project } from "@/types";

interface ProjectMainContentTabsProps {
  project: Project;
}

// NEW: Helper function to convert any YouTube URL to an embeddable URL
const getYouTubeEmbedUrl = (url?: string): string | null => {
  if (!url) return null;

  let videoId = null;
  try {
    const urlObj = new URL(url);
    if (
      urlObj.hostname === "www.youtube.com" ||
      urlObj.hostname === "youtube.com"
    ) {
      videoId = urlObj.searchParams.get("v");
    } else if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.substring(1);
    }
  } catch (error) {
    console.error("Invalid URL for YouTube video:", url);
    return null;
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

const ProjectMainContentTabs = ({ project }: ProjectMainContentTabsProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentLayoutIndex, setCurrentLayoutIndex] = useState(0);

  // Dynamic image arrays
  const galleryImages =
    project.images && project.images.length > 0
      ? project.images
      : [project.image || "/placeholder-project-main.jpg"];
  const layoutImages =
    project.layoutImages && project.layoutImages.length > 0
      ? project.layoutImages
      : [];

  // Status config for Overview tab specifications
  const statusConfig = {
    "In Progress": { icon: Zap },
    Completed: { icon: CheckCircle },
  };

  // Carousel functions
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };
  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };
  const nextLayout = () => {
    setCurrentLayoutIndex((prev) => (prev + 1) % layoutImages.length);
  };
  const prevLayout = () => {
    setCurrentLayoutIndex(
      (prev) => (prev - 1 + layoutImages.length) % layoutImages.length
    );
  };

  // Combine location details for specifications
  const fullLocation = `${project.cityMunicipality}, ${project.province}, ${project.country}`;

  // CHANGED: Use the helper function to get a safe embed URL
  const videoEmbedUrl = getYouTubeEmbedUrl(project.projectVideoLink);

  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-4 mb-12 bg-slate-100 p-1 rounded-xl">
        <TabsTrigger value="overview" className="rounded-lg font-medium">
          Overview
        </TabsTrigger>
        <TabsTrigger value="gallery" className="rounded-lg font-medium">
          Gallery
        </TabsTrigger>
        <TabsTrigger value="layout" className="rounded-lg font-medium">
          Layout
        </TabsTrigger>
        <TabsTrigger value="video" className="rounded-lg font-medium">
          Video
        </TabsTrigger>
      </TabsList>

      {/* ... (Overview and Gallery tabs are unchanged) ... */}
      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-10">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50">
          <h2 className="text-3xl font-semibold mb-6 text-slate-900">
            Project Overview
          </h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              {project.longDescription || project.shortDescription}
            </p>
            {project.features && project.features.length > 0 && (
              <>
                <h3 className="text-2xl font-semibold mt-10 mb-6 text-slate-900">
                  Key Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50">
          <h3 className="text-2xl font-semibold mb-6 text-slate-900">
            Project Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                label: "Total Modules",
                value: `${project.modules} Units`,
                icon: Layers,
              },
              {
                label: "Project Status",
                value: project.projectStatus,
                icon:
                  statusConfig[
                    project.projectStatus as keyof typeof statusConfig
                  ]?.icon || CheckCircle,
              },
              {
                label: "Completion Date",
                value: new Date(project.completionDate).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                ),
                icon: Calendar,
              },
              {
                label: "Location",
                value: fullLocation,
                icon: MapPin,
              },
              {
                label: "Category",
                value: project.projectCategory,
                icon: Award,
              },
            ].map((spec, index) => {
              const Icon = spec.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 rounded-xl border border-slate-200/50"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-sm font-medium text-slate-500">
                      {spec.label}
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-slate-900 ml-11">
                    {spec.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </TabsContent>

      {/* Gallery Tab */}
      <TabsContent value="gallery">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50">
          <h2 className="text-3xl font-semibold mb-6 text-slate-900">
            Project Gallery
          </h2>
          <div>
            {project.imagesDesc && project.imagesDesc[currentImageIndex] && (
              <p className="mt-4 text-slate-700 text-sm mb-2 italic">
                {project.imagesDesc[currentImageIndex]}
              </p>
            )}
          </div>
          {galleryImages.length > 0 ? (
            <>
              <div className="relative mb-8">
                <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden relative group">
                  <img
                    src={galleryImages[currentImageIndex]}
                    alt={`${project.projectTitle} - Image ${
                      currentImageIndex + 1
                    }`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    {currentImageIndex + 1} / {galleryImages.length}
                  </div>
                </div>
              </div>
              {galleryImages.length > 1 && (
                <div className="grid grid-cols-6 gap-3">
                  {galleryImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        currentImageIndex === index
                          ? "border-slate-900 ring-2 ring-slate-900/20"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-slate-600 py-8">
              No additional gallery images available.
            </div>
          )}
        </div>
      </TabsContent>

      {/* Layout Tab */}
      <TabsContent value="layout">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50">
          <h2 className="text-3xl font-semibold mb-8 text-slate-900 flex items-center gap-3">
            Modular Layout & Blueprints
          </h2>
          {project.layoutDesc && (
            <p className="text-slate-600 mb-6 leading-relaxed">
              {project.layoutDesc}
            </p>
          )}

          {layoutImages.length > 0 ? (
            <>
              <div className="relative mb-8">
                <div className="aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden relative group">
                  <img
                    src={layoutImages[currentLayoutIndex]}
                    alt={`${project.projectTitle} - Layout ${
                      currentLayoutIndex + 1
                    }`}
                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {layoutImages.length > 1 && (
                    <>
                      <button
                        onClick={prevLayout}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextLayout}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    Plan {currentLayoutIndex + 1} / {layoutImages.length}
                  </div>
                </div>
              </div>
              {layoutImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {layoutImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentLayoutIndex(index)}
                      className={`aspect-[4/3] rounded-xl overflow-hidden border-2 bg-slate-50 transition-all duration-300 ${
                        currentLayoutIndex === index
                          ? "border-slate-900 ring-2 ring-slate-900/20"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Layout Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity duration-300"
                      />
                    </button>
                  ))}
                </div>
              )}
              {project.threeDLink && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <a
                    href={project.threeDLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full">
                      View 3D Model
                    </Button>
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-slate-600 py-8">
              No layout plans available for this project.
            </div>
          )}
        </div>
      </TabsContent>

      {/* Video Tab */}
      <TabsContent value="video">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50">
          <h2 className="text-3xl font-semibold mb-8 text-slate-900">
            Project Showcase
          </h2>
          {/* CHANGED: Check for the valid embed URL before rendering */}
          {videoEmbedUrl ? (
            <>
              <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden mb-6 relative group">
                <iframe
                  width="100%"
                  height="100%"
                  src={videoEmbedUrl} // CHANGED: Use the converted embed URL
                  title={`${project.projectTitle} Video Showcase`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 mb-2">
                    {project.videoDesc ||
                      `Experience the complete transformation from design to finished project.`}
                  </p>
                </div>
                {/* Link to the original, non-embeddable URL for "View on YouTube" */}
                <a
                  href={project.projectVideoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-900 hover:text-slate-700 font-medium transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  View on YouTube
                </a>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-600 py-8">
              No video showcase available for this project.
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProjectMainContentTabs;
