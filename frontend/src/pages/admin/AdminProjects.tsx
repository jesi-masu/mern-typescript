// src/pages/admin/AdminProjects.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Project } from "@/types";
import ProjectFilters from "@/components/admin/ProjectFilters";
import ProjectTable from "@/components/admin/ProjectTable";

const AdminProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:4000/api/projects");
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        toast.error("Could not fetch projects.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    let result = projects;
    const lowercasedQuery = searchQuery.toLowerCase();
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.projectTitle?.toLowerCase().includes(lowercasedQuery) ||
          p.cityMunicipality?.toLowerCase().includes(lowercasedQuery) ||
          p.province?.toLowerCase().includes(lowercasedQuery)
      );
    }
    if (statusFilter !== "all")
      result = result.filter((p) => p.projectStatus === statusFilter);
    if (categoryFilter !== "all")
      result = result.filter((p) => p.projectCategory === categoryFilter);
    setFilteredProjects(result);
  }, [searchQuery, statusFilter, categoryFilter, projects]);

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/projects/${projectId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete project");
      setProjects(projects.filter((p) => p._id !== projectId));
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Could not delete project.");
    }
  };

  const handleAddProject = () => {
    navigate("/admin/projects/new");
  };

  if (loading) {
    return <div className="p-6">Loading projects...</div>;
  }

  const isInitialEmptyState =
    !searchQuery &&
    statusFilter === "all" &&
    categoryFilter === "all" &&
    projects.length === 0;

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Projects Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage all your prefab construction projects
          </p>
        </div>
        <Button
          onClick={handleAddProject}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Project
        </Button>
      </div>
      <Card>
        <ProjectFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          totalCount={projects.length}
          filteredCount={filteredProjects.length}
        />
        <ProjectTable
          projects={filteredProjects}
          onDelete={handleDeleteProject}
          onAdd={handleAddProject}
          showEmptyState={isInitialEmptyState}
        />
      </Card>
    </div>
  );
};

export default AdminProjects;
