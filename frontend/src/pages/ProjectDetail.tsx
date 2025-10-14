// src/pages/ProjectDetail.tsx

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Project } from "@/types";

// ✅ UPDATED: The import paths now point to your new 'project-detail' folder
import ProjectHeroSection from "@/components/project-detail/ProjectHeroSection";
import ProjectMainContentTabs from "@/components/project-detail/ProjectMainContentTabs";
import ProjectSidebar from "@/components/project-detail/ProjectSidebar";

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `http://localhost:4000/api/projects/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch project details.");
        }
        const data = await response.json();
        setProject(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">
            Loading Project Details...
          </h1>
          <p>Please wait while we fetch the project information.</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-20">
          <Alert className="max-w-2xl mx-auto border-red-200 bg-red-50">
            <AlertTitle className="text-red-800">
              Error Loading Project
            </AlertTitle>
            <AlertDescription className="text-red-700">
              {error}
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

  if (!project) {
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

  return (
    <Layout>
      <ProjectHeroSection project={project} />

      <section className="py-16 bg-gradient-to-b from-white to-slate-50/50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ProjectMainContentTabs project={project} />
            </div>
            <div>
              <ProjectSidebar project={project} />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectDetail;
