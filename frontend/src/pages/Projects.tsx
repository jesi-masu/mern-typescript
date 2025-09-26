import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Home, Factory, MapPin, Calendar, Layers, CheckCircle2 } from "lucide-react"; // Added CheckCircle2 for status

// Import the projects data (assuming its structure is correct)
import { projectsData } from "@/data/projectsData";

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getFilteredProjects = () => {
    let filtered = projectsData;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(project => project.category === selectedCategory);
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
        return <Building2 className="h-4 w-4" />; // Fallback
    }
  };

  // Adjusted color palette for badges for a more refined look
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
    const completedProjects = projectsData.filter(p => p.status === "Completed").length;
    const totalModules = projectsData.reduce((sum, p) => sum + p.modules, 0);

    return { totalProjects, completedProjects, totalModules };
  };

  const stats = getProjectStats();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 to-white dark:from-gray-950 dark:to-gray-900 py-16 md:py-24 relative overflow-hidden">
        {/* Subtle background pattern/texture for premium feel */}
        <div className="absolute inset-0 z-0 opacity-5 dark:opacity-10 pointer-events-none">
          <svg className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#9CA3AF" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
          </svg>
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-gray-900 dark:text-gray-50 leading-tight animate-fade-in-down">
              Our <span className="text-indigo-600 dark:text-indigo-400">Distinguished</span> Projects
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              Dive into our extensive portfolio of successfully delivered prefabricated construction solutions.
              Each project showcases our dedication to innovation, quality, and client success across diverse sectors.
            </p>
          </div>

          {/* Statistics Overview - Enhanced Design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2 transition-all duration-300 ease-in-out group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-indigo-700 dark:text-indigo-400 group-hover:text-indigo-800 dark:group-hover:text-indigo-300 transition-colors duration-300">
                    {stats.totalProjects}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">Total Projects</p>
                </div>
                <Building2 className="h-12 w-12 text-indigo-500 dark:text-indigo-300 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2 transition-all duration-300 ease-in-out group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors duration-300">
                    {stats.completedProjects}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">Completed Projects</p>
                </div>
                <CheckCircle2 className="h-12 w-12 text-emerald-500 dark:text-emerald-300 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2 transition-all duration-300 ease-in-out group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-sky-700 dark:text-sky-400 group-hover:text-sky-800 dark:group-hover:text-sky-300 transition-colors duration-300">
                    {stats.totalModules}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">Modules Deployed</p>
                </div>
                <Layers className="h-12 w-12 text-sky-500 dark:text-sky-300 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          {/* Category Filter Buttons - Enhanced with better hover/active states */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12 animate-fade-in-up">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-medium transition-all duration-300
                         ${selectedCategory === null
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                  : "border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-600 dark:hover:text-indigo-400 dark:hover:bg-gray-700/20"
                }`}
            >
              <Building2 className="h-4 w-4" />
              All Projects
            </Button>
            <Button
              variant={selectedCategory === "Residential" ? "default" : "outline"}
              onClick={() => setSelectedCategory("Residential")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-medium transition-all duration-300
                         ${selectedCategory === "Residential"
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                  : "border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-600 dark:hover:text-indigo-400 dark:hover:bg-gray-700/20"
                }`}
            >
              <Home className="h-4 w-4" />
              Residential
            </Button>
            <Button
              variant={selectedCategory === "Commercial" ? "default" : "outline"}
              onClick={() => setSelectedCategory("Commercial")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-medium transition-all duration-300
                         ${selectedCategory === "Commercial"
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                  : "border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-600 dark:hover:text-indigo-400 dark:hover:bg-gray-700/20"
                }`}
            >
              <Building2 className="h-4 w-4" />
              Commercial
            </Button>
            <Button
              variant={selectedCategory === "Industrial" ? "default" : "outline"}
              onClick={() => setSelectedCategory("Industrial")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-medium transition-all duration-300
                         ${selectedCategory === "Industrial"
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                  : "border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-600 dark:hover:text-indigo-400 dark:hover:bg-gray-700/20"
                }`}
            >
              <Factory className="h-4 w-4" />
              Industrial
            </Button>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(project => (
              <Card key={project.id} className="overflow-hidden rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-850 transform hover:-translate-y-2 transition-all duration-500 ease-in-out group">
                {/* Image Section with Overlay */}
                <div className="h-60 overflow-hidden relative">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700 ease-in-out"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className={`${getCategoryColor(project.category)} flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-full shadow-sm`}>
                      {getCategoryIcon(project.category)}
                      {project.category}
                    </Badge>
                  </div>
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-green-600 text-white flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-full shadow-sm">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                    </Badge>
                  </div>
                  {/* Subtle gradient overlay for image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent"></div>
                </div>

                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50 line-clamp-2 leading-tight">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-3 text-base">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <MapPin className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                      <span className="font-medium">{project.location}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                        <Layers className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">Modules</p>
                          <p className="font-semibold text-gray-900 dark:text-gray-50">{project.modules}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                        <Calendar className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">Completed</p>
                          <p className="font-semibold text-gray-900 dark:text-gray-50">
                            {new Date(project.completionDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Link to={`/project/${project.id}`} className="w-full">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                      View Project Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16 px-6 bg-white dark:bg-gray-850 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-in">
              <Building2 className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-50">No Projects Found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
                Oops! No projects match your current filter. Please try adjusting your selection to discover more.
              </p>
            </div>
          )}

          {/* Call to Action Section - Enhanced Design */}
          <div className="text-center mt-20 bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-indigo-800 dark:to-purple-900 rounded-3xl p-10 md:p-16 shadow-2xl overflow-hidden relative">
            {/* Abstract shapes for visual interest */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <circle cx="20" cy="80" r="15" fill="white" opacity="0.1" />
                <circle cx="80" cy="20" r="20" fill="white" opacity="0.1" />
                <rect x="10" y="10" width="30" height="30" fill="white" opacity="0.05" transform="rotate(45 25 25)" />
              </svg>
            </div>
            <div className="max-w-4xl mx-auto relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-white leading-tight animate-fade-in-down">
                Ready to Bring Your Vision to Life?
              </h2>
              <p className="text-lg md:text-xl text-indigo-100 mb-10 leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                Our portfolio showcases our expertise. Let our dedicated team turn your ideas into
                reality with innovative, high-quality prefabricated construction solutions that meet your
                exact specifications and budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 px-10 py-3.5 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  Request Consultation
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 hover:border-white/80 px-10 py-3.5 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  Download Brochure
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;