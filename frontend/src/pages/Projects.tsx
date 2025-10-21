// src/pages/Projects.tsx

import { useState, useMemo, useEffect } from "react";
import Layout from "@/components/Layout";
import ProjectsHero from "@/components/projects/ProjectsHero";
import CategoryFilters from "@/components/projects/CategoryFilters";
import ProjectCard from "@/components/projects/ProjectCard";
import CallToAction from "@/components/projects/CallToAction";
import { useParallaxScroll } from "@/hooks/useParallaxScroll";
import { Building2 } from "lucide-react";
import { Project } from "@/types"; // <-- CLEAN IMPORT!

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { scrollY } = useParallaxScroll();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:4000/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects. Please try again later.");
        }
        const data = await response.json();
        setProjects(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!selectedCategory) return projects;
    return projects.filter(
      (project) => project.projectCategory === selectedCategory
    );
  }, [selectedCategory, projects]);

  const stats = useMemo(
    () => ({
      totalProjects: projects.length,
      completedProjects: projects.filter((p) => p.projectStatus === "Completed")
        .length,
      totalModules: projects.reduce((sum, p) => sum + p.modules, 0),
    }),
    [projects]
  );

  return (
    <Layout>
      <ProjectsHero stats={stats} scrollY={scrollY} />

      <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-900 -mt-5">
        <div className="container">
          <CategoryFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {loading && (
            <p className="text-center text-lg mt-8">Loading projects...</p>
          )}
          {error && (
            <p className="text-center text-lg text-red-500 mt-8">
              Error: {error}
            </p>
          )}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    index={index}
                  />
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-in mt-12">
                  <Building2 className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-50">
                    No Projects Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
                    Oops! No projects match your current filter. Please try
                    adjusting your selection.
                  </p>
                </div>
              )}
            </>
          )}

          <CallToAction />
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
