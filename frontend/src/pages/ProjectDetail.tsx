import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  ExternalLink,
  CheckCircle,
  Calendar,
  MapPin,
  Layers,
  Award,
  Ruler,
} from "lucide-react"; // Added Ruler icon
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { projectsData } from "@/data/projectsData";

// NOTE: In a real TypeScript project, you would define and import the Project interface here.
// For this example, we'll keep the types inferred or use `any` for simplicity within the provided snippet.

const ProjectDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentLayoutIndex, setCurrentLayoutIndex] = useState(0); // New state for Layout carousel

  // NOTE: For a proper TS environment, cast projectsData array and define Project type.
  const project = projectsData.find((p) => p.id.toString() === id);

  // Existing sample gallery images (photos)
  const galleryImages = [
    project?.imageUrl || "",
    `https://images.unsplash.com/photo-1600585152220-90363fe7e115`,
    `https://images.unsplash.com/photo-1600607687939-ce8a6c25118c`,
    `https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea`,
    `https://images.unsplash.com/photo-1600607688969-a5bfcd646154`,
  ].filter(Boolean);

  // NEW: Sample layout images (blueprints, floor plans)
  const layoutImages = [
    `https://camcoprefabricatedstructures.com/wp-content/uploads/2025/03/duplex4.png`,
    `https://camcoprefabricatedstructures.com/wp-content/uploads/2025/02/Mask-group-21.png`,
    `https://camcoprefabricatedstructures.com/wp-content/uploads/2025/02/Mask-group-22.png`,
    `https://camcoprefabricatedstructures.com/wp-content/uploads/2025/02/Mask-group-23.png`,
  ];

  if (!project) {
    // Project Not Found Alert... (Keep existing logic)
    return (
      <Layout>
        <div className="container py-20">
          <Alert className="max-w-2xl mx-auto border-red-200 bg-red-50">
            <AlertTitle className="text-red-800">Project Not Found</AlertTitle>
            <AlertDescription className="text-red-700">
              The project you're looking for doesn't exist or has been removed.
              <div className="mt-4">
                <Link to="/projects">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Return to Projects
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  const statusConfig = {
    Planning: {
      color: "bg-amber-500/10 text-amber-700 border-amber-200",
      icon: Calendar,
    },
    "In Progress": {
      color: "bg-blue-500/10 text-blue-700 border-blue-200",
      icon: Layers,
    },
    Completed: {
      color: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
      icon: CheckCircle,
    },
  };

  // Gallery Carousel Functions (Kept existing)
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };
  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  // NEW: Layout Carousel Functions
  const nextLayout = () => {
    setCurrentLayoutIndex((prev) => (prev + 1) % layoutImages.length);
  };
  const prevLayout = () => {
    setCurrentLayoutIndex(
      (prev) => (prev - 1 + layoutImages.length) % layoutImages.length
    );
  };

  return (
    <Layout>
      {/* Premium Hero Section (No change) */}
      <section className="relative h-[70vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${project.imageUrl})` }}
        />
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
            <div className="flex items-center gap-4 mb-6">
              <Badge
                className={`${
                  statusConfig[project.status as keyof typeof statusConfig]
                    ?.color
                } border backdrop-blur-sm font-medium px-4 py-2`}
              >
                {project.status}
              </Badge>
              <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm font-medium px-4 py-2">
                {project.category}
              </Badge>
            </div>

            <h1 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
              {project.title}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl leading-relaxed font-light">
              {project.description}
            </p>

            <div className="flex items-center gap-8 mt-8 text-white/80">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                <span>{project.modules} Modules</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {new Date(project.completionDate).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "short" }
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50/50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              <Tabs
                defaultValue={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                {/* RENAMED 'timeline' to 'layout' in TabsList */}
                <TabsList className="grid w-full grid-cols-4 mb-12 bg-slate-100 p-1 rounded-xl">
                  <TabsTrigger
                    value="overview"
                    className="rounded-lg font-medium"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="gallery"
                    className="rounded-lg font-medium"
                  >
                    Gallery
                  </TabsTrigger>
                  <TabsTrigger
                    value="layout"
                    className="rounded-lg font-medium"
                  >
                    Layout
                  </TabsTrigger>
                  <TabsTrigger value="video" className="rounded-lg font-medium">
                    Video
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab (No Change) */}
                <TabsContent value="overview" className="space-y-10">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50">
                    <h2 className="text-3xl font-semibold mb-6 text-slate-900">
                      Project Overview
                    </h2>
                    <div className="prose prose-slate max-w-none">
                      <p className="text-lg text-slate-600 leading-relaxed mb-6">
                        {project.description} This innovative building showcases
                        our prefab module technology, demonstrating the
                        efficiency and versatility of our construction methods.
                        The project consists of {project.modules} modules that
                        were fabricated off-site and assembled with precision on
                        location.
                      </p>

                      <p className="text-lg text-slate-600 leading-relaxed mb-8">
                        The design emphasizes sustainability, incorporating
                        energy-efficient features and eco-friendly materials
                        throughout. Our team collaborated closely with the
                        client to ensure all requirements were met while
                        maintaining the highest quality standards.
                      </p>

                      <h3 className="text-2xl font-semibold mt-10 mb-6 text-slate-900">
                        Key Features
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          `Modular construction with ${project.modules} prefabricated units`,
                          "Energy-efficient design with solar integration options",
                          "Customizable interior layouts to meet specific needs",
                          "Rapid on-site assembly reducing construction time by 60%",
                          "Eco-friendly materials with minimal environmental impact",
                          "Smart home technology integration",
                        ].map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl"
                          >
                            <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">{feature}</span>
                          </div>
                        ))}
                      </div>
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
                          value: project.status,
                          icon:
                            statusConfig[
                              project.status as keyof typeof statusConfig
                            ]?.icon || CheckCircle,
                        },
                        {
                          label: "Completion Date",
                          value: new Date(
                            project.completionDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }),
                          icon: Calendar,
                        },
                        {
                          label: "Location",
                          value:
                            project.location || "Metro Manila, Philippines",
                          icon: MapPin,
                        },
                      ].map((spec, index) => {
                        const Icon = spec.icon;
                        return (
                          <div
                            key={index}
                            className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 rounded-xl border border-slate-200/50"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-slate-200 rounded-lg">
                                <Icon className="h-5 w-5 text-slate-600" />
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

                {/* Premium Gallery Tab with Carousel (Existing logic, no major changes) */}
                <TabsContent value="gallery">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50">
                    <h2 className="text-3xl font-semibold mb-8 text-slate-900">
                      Project Gallery
                    </h2>

                    {/* Main Carousel */}
                    <div className="relative mb-8">
                      <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden relative group">
                        <img
                          src={galleryImages[currentImageIndex]}
                          alt={`${project.title} - Image ${
                            currentImageIndex + 1
                          }`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Navigation Buttons */}
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

                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                          {currentImageIndex + 1} / {galleryImages.length}
                        </div>
                      </div>
                    </div>

                    {/* Thumbnail Navigation */}
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
                  </div>
                </TabsContent>

                {/* NEW: Layout Tab (Replaced Timeline with Blueprint Carousel) */}
                <TabsContent value="layout">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50">
                    <h2 className="text-3xl font-semibold mb-8 text-slate-900 flex items-center gap-3">
                      <Ruler className="h-7 w-7 text-slate-600" />
                      Modular Layout & Blueprints
                    </h2>

                    <p className="text-slate-600 mb-6 leading-relaxed">
                      Explore the technical specifications and modular design of
                      this project, including floor plans and container
                      arrangements.
                    </p>

                    {/* Layout Carousel */}
                    <div className="relative mb-8">
                      <div className="aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden relative group">
                        <img
                          src={layoutImages[currentLayoutIndex]}
                          alt={`${project.title} - Layout ${
                            currentLayoutIndex + 1
                          }`}
                          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02]"
                        />

                        {/* Navigation Buttons */}
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

                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                          Plan {currentLayoutIndex + 1} / {layoutImages.length}
                        </div>
                      </div>
                    </div>

                    {/* Thumbnail Navigation (Simplified for layout) */}
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

                    <div className="mt-8 pt-6 border-t border-slate-100">
                      <Button variant="outline" className="w-full">
                        <Ruler className="mr-2 h-4 w-4" />
                        Download Floor Plans (PDF)
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Video Tab (No Change) */}
                <TabsContent value="video">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50">
                    <h2 className="text-3xl font-semibold mb-8 text-slate-900">
                      Project Showcase
                    </h2>
                    <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden mb-6 relative group">
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/-sug6F-Qxu4?si=WmPkjAI_yfN4WMG3"
                        title="Project Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 mb-2">
                          Experience the complete transformation from design to
                          finished project.
                        </p>
                        <p className="text-sm text-slate-500">
                          Duration: 3:45 • Quality: 1080p HD
                        </p>
                      </div>
                      <a
                        href="https://www.youtube.com/watch?v=C_3Xe33PB7E"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-slate-900 hover:text-slate-700 font-medium transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View on YouTube
                      </a>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Premium Sidebar (No Change) */}
            <div className="space-y-8">
              {/* Progress Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50">
                <h3 className="text-xl font-semibold mb-6 text-slate-900">
                  Project Progress
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Completion</span>
                    <span className="text-2xl font-bold text-slate-900">
                      {project.progress || 100}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${project.progress || 100}%` }}
                    />
                  </div>
                  <div className="pt-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Completed:{" "}
                        {new Date(project.completionDate).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlights Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50">
                <h3 className="text-xl font-semibold mb-6 text-slate-900">
                  Project Highlights
                </h3>
                <div className="space-y-4">
                  {[
                    "Energy-efficient design",
                    "Prefabricated modular construction",
                    "60% faster construction time",
                    "Smart home technology ready",
                  ].map((highlight, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50">
                <h3 className="text-xl font-semibold mb-6 text-slate-900">
                  Frequently Asked Questions
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-slate-200">
                    <AccordionTrigger className="text-left hover:no-underline">
                      What are the benefits of modular construction?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600">
                      Modular construction offers faster build times, reduced
                      waste, consistent quality control, and lower overall costs
                      compared to traditional construction methods.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border-slate-200">
                    <AccordionTrigger className="text-left hover:no-underline">
                      How long does assembly take?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600">
                      On-site assembly typically takes 2-4 weeks depending on
                      the project size, which is significantly faster than
                      conventional construction.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border-slate-200">
                    <AccordionTrigger className="text-left hover:no-underline">
                      Are modules customizable?
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600">
                      Yes, all our prefabricated modules can be customized to
                      meet specific requirements for layout, finishes, and
                      features while maintaining the efficiency of modular
                      construction.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* CTA Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-semibold mb-4">
                  Interested in Similar Project?
                </h3>
                <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                  Contact our team to discuss your project requirements and
                  learn how our prefab solutions can work for you.
                </p>
                <div className="space-y-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-medium">
                        Request Consultation
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Project Consultation</DialogTitle>
                      </DialogHeader>
                      <p className="py-4 text-slate-600">
                        Our experts will help you explore how our prefab
                        solutions can bring your vision to life.
                      </p>
                      <div className="space-y-3">
                        <Button className="w-full bg-slate-900 hover:bg-slate-800">
                          Contact Sales Team
                        </Button>
                        <Button variant="outline" className="w-full">
                          Download Project Brief
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Link to="/contact">
                    <Button
                      variant="outline"
                      className="w-full border-slate-400 text-slate-300 hover:bg-white/10"
                    >
                      Get In Touch
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectDetail;
