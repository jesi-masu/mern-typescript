import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Home,
  Factory,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
  TrendingUp,
  Award,
  Target,
} from "lucide-react";

// Import the projects data
import { projectsData } from "@/data/projectsData";

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getFilteredProjects = () => {
    let filtered = projectsData;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (project) => project.category === selectedCategory
      );
    }

    return filtered;
  };

  const filteredProjects = getFilteredProjects();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Residential":
        return <Home className="h-4 w-4" />;
      case "Commercial":
        return <Building2 className="h-4 w-4" />;
      case "Industrial":
        return <Factory className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Residential":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "Commercial":
        return "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300";
      case "Industrial":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300";
    }
  };

  const getProjectStats = () => {
    const totalProjects = projectsData.length;
    const completedProjects = projectsData.filter(
      (p) => p.status === "Completed"
    ).length;
    const totalModules = projectsData.reduce((sum, p) => sum + p.modules, 0);

    return { totalProjects, completedProjects, totalModules };
  };

  const stats = getProjectStats();

  return (
    <Layout>
      {/* Animated Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 text-white py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Geometric Shapes */}
          <div
            className="absolute w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.4}px)` }}
          ></div>
          <div
            className="absolute w-96 h-96 bg-purple-400/10 rounded-full blur-3xl top-1/2 right-0 animate-pulse"
            style={{
              transform: `translateY(${scrollY * -0.3}px)`,
              animationDelay: "1s",
            }}
          ></div>
          <div
            className="absolute w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -bottom-48 left-1/4 animate-pulse"
            style={{
              transform: `translateY(${scrollY * 0.2}px)`,
              animationDelay: "0.5s",
            }}
          ></div>

          {/* Animated Grid */}
          <div
            className="absolute inset-0 opacity-10"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            <svg className="w-full h-full">
              <defs>
                <pattern
                  id="grid-pattern"
                  x="0"
                  y="0"
                  width="50"
                  height="50"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 50 0 L 0 0 0 50"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>
          </div>

          {/* Floating Building Icons */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white/5 animate-float-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
              }}
            >
              <Building2 className="w-12 h-12" />
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Main Heading */}
            <h1
              className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight animate-fade-in-up leading-tight"
              style={{ animationDelay: "0.3s" }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200 animate-gradient">
                Our Distinguished
              </span>
              <br />
              <span className="text-indigo-300">Projects</span>
            </h1>
            <br />

            {/* Animated Stats Cards */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in-up"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-5xl font-black text-white group-hover:scale-110 transition-transform">
                    {stats.totalProjects}+
                  </div>
                  <Building2 className="w-10 h-10 text-indigo-300 group-hover:rotate-12 transition-transform" />
                </div>
                <div className="text-indigo-200 font-semibold uppercase tracking-wide text-sm">
                  Total Projects
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-5xl font-black text-white group-hover:scale-110 transition-transform">
                    {stats.completedProjects}
                  </div>
                  <CheckCircle2 className="w-10 h-10 text-green-300 group-hover:rotate-12 transition-transform" />
                </div>
                <div className="text-indigo-200 font-semibold uppercase tracking-wide text-sm">
                  Completed
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-5xl font-black text-white group-hover:scale-110 transition-transform">
                    {stats.totalModules}
                  </div>
                  <Layers className="w-10 h-10 text-purple-300 group-hover:rotate-12 transition-transform" />
                </div>
                <div className="text-indigo-200 font-semibold uppercase tracking-wide text-sm">
                  Modules Deployed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-16 md:h-24 text-gray-50 dark:text-gray-900"
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12 animate-fade-in-up">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-medium transition-all duration-300
                         ${
                           selectedCategory === null
                             ? "bg-prefab-600 hover:bg-prefab-700 text-white shadow-lg scale-105"
                             : "border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-prefab-700 hover:scale-105 dark:border-gray-600 dark:text-gray-300 dark:hover:border-prefab-600 dark:hover:text-prefab-400 dark:hover:bg-gray-700/20"
                         }`}
            >
              <Target className="h-4 w-4" />
              All Projects
            </Button>
            <Button
              variant={
                selectedCategory === "Residential" ? "default" : "outline"
              }
              onClick={() => setSelectedCategory("Residential")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-medium transition-all duration-300
                         ${
                           selectedCategory === "Residential"
                             ? "bg-prefab-600 hover:bg-prefab-700 text-white shadow-lg scale-105"
                             : "border-gray-300 text-gray-700 hover:border-prefab-400 hover:text-prefab-700 hover:scale-105 dark:border-gray-600 dark:text-gray-300 dark:hover:border-prefab-600 dark:hover:text-prefab-400 dark:hover:bg-gray-700/20"
                         }`}
            >
              <Home className="h-4 w-4" />
              Residential
            </Button>
            <Button
              variant={
                selectedCategory === "Commercial" ? "default" : "outline"
              }
              onClick={() => setSelectedCategory("Commercial")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-medium transition-all duration-300
                         ${
                           selectedCategory === "Commercial"
                             ? "bg-prefab-600 hover:bg-prefab-700 text-white shadow-lg scale-105"
                             : "border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-prefab-700 hover:scale-105 dark:border-gray-600 dark:text-gray-300 dark:hover:border-prefab-600 dark:hover:text-prefab-400 dark:hover:bg-gray-700/20"
                         }`}
            >
              <Building2 className="h-4 w-4" />
              Commercial
            </Button>
            <Button
              variant={
                selectedCategory === "Industrial" ? "default" : "outline"
              }
              onClick={() => setSelectedCategory("Industrial")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-medium transition-all duration-300
                         ${
                           selectedCategory === "Industrial"
                             ? "bg-prefab-600 hover:bg-prefab-700 text-white shadow-lg scale-105"
                             : "border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-prefab-700 hover:scale-105 dark:border-gray-600 dark:text-gray-300 dark:hover:border-prefab-600 dark:hover:text-prefab-400 dark:hover:bg-gray-700/20"
                         }`}
            >
              <Factory className="h-4 w-4" />
              Industrial
            </Button>
          </div>

          {/* Project Grid with Enhanced Animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <Card
                key={project.id}
                className="overflow-hidden rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-850 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 ease-in-out group animate-scale-in"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Image Section with Overlay */}
                <div className="h-60 overflow-hidden relative">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700 ease-in-out"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge
                      className={`${getCategoryColor(
                        project.category
                      )} flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm transition-transform duration-300 hover:scale-110`}
                    >
                      {getCategoryIcon(project.category)}
                      {project.category}
                    </Badge>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-green-500/90 backdrop-blur-sm text-white flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-full shadow-lg transition-transform duration-300 hover:scale-110">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                    </Badge>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-3 text-base">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors duration-300">
                      <MapPin className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                      <span className="font-medium">{project.location}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-indigo-300 transition-all duration-300 hover:scale-105 group/stat">
                        <Layers className="h-4 w-4 mr-2 text-blue-500 dark:text-indigo-400 group-hover/stat:rotate-12 transition-transform" />
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            Modules
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-gray-50">
                            {project.modules}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-indigo-300 transition-all duration-300 hover:scale-105 group/stat">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500 dark:text-indigo-400 group-hover/stat:rotate-12 transition-transform" />
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            Completed
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-gray-50">
                            {new Date(
                              project.completionDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Link to={`/project/${project.id}`} className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 text-base rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn">
                      <span className="group-hover/btn:mr-2 transition-all">
                        View Project Details
                      </span>
                      <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity">
                        →
                      </span>
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16 px-6 bg-white dark:bg-gray-850 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-in">
              <Building2 className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-50">
                No Projects Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
                Oops! No projects match your current filter. Please try
                adjusting your selection to discover more.
              </p>
            </div>
          )}

          {/* Call to Action Section */}
          <div className="text-center mt-20 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-indigo-800 dark:to-purple-900 rounded-3xl p-10 md:p-16 shadow-2xl overflow-hidden relative animate-fade-in-up">
            <div className="absolute inset-0 opacity-20">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <circle cx="20" cy="80" r="15" fill="white" opacity="0.1" />
                <circle cx="80" cy="20" r="20" fill="white" opacity="0.1" />
                <rect
                  x="10"
                  y="10"
                  width="30"
                  height="30"
                  fill="white"
                  opacity="0.05"
                  transform="rotate(45 25 25)"
                />
              </svg>
            </div>
            <div className="max-w-4xl mx-auto relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-white leading-tight">
                Ready to Bring Your Vision to Life?
              </h2>
              <p className="text-lg md:text-xl text-indigo-100 mb-10 leading-relaxed">
                Our portfolio showcases our expertise. Let our dedicated team
                turn your ideas into reality with innovative, high-quality
                prefabricated construction solutions that meet your exact
                specifications and budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-indigo-50 px-10 py-3.5 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  Request Consultation
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 hover:border-white/80 px-10 py-3.5 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  Download Brochure
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.05;
          }
          50% {
            transform: translateY(-30px) translateX(20px) rotate(180deg);
            opacity: 0.1;
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-float-slow {
          animation: float-slow linear infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scale-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </Layout>
  );
};

export default Projects;
