import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Project, ProjectStatus, ProjectCategory } from "@/types"; // Assuming types are defined
import ProjectTable from "@/components/admin/ProjectTable";
import { Plus, Filter, Search, Package, Briefcase } from "lucide-react";

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

  // For populating filter dropdowns
  const uniqueCategories = [
    ...new Set(projects.map((p) => p.projectCategory)),
  ] as ProjectCategory[];
  const uniqueStatuses = [
    ...new Set(projects.map((p) => p.projectStatus)),
  ] as ProjectStatus[];

  const totalModules = projects.reduce(
    (acc, project) => acc + (project.modules || 0),
    0
  );

  const isInitialEmptyState =
    !searchQuery &&
    statusFilter === "all" &&
    categoryFilter === "all" &&
    projects.length === 0;

  return (
    <div className="space-y-6 p-4 md:p-4 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Projects Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage all your prefab construction projects.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Total Modules Card */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <Package className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-semibold text-gray-800">
              {totalModules}
            </span>
            <span className="text-gray-500">Total Modules</span>
          </div>

          {/* Total Projects Card */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <Briefcase className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-semibold text-gray-800">
              {projects.length}
            </span>
            <span className="text-gray-500">Total Projects</span>
          </div>

          {/* Add Project Button (moved outside) */}
          <Button onClick={handleAddProject}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Project
          </Button>
        </div>
      </div>

      <hr className="border-t border-gray-200" />

      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
              <Filter className="h-6 w-6 text-blue-600" />
              Filter Projects
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  placeholder="Search by title or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-2 rounded-lg border border-gray-300 w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-52 rounded-lg border border-gray-300">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-52 rounded-lg border border-gray-300">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <div className="pb-4 px-5 text-sm text-muted-foreground">
          Showing <strong>{filteredProjects.length}</strong> of{" "}
          <strong>{projects.length}</strong> total projects.
        </div>
      </Card>

      <div>
        {filteredProjects.length > 0 || !isInitialEmptyState ? (
          <ProjectTable
            projects={filteredProjects}
            onDelete={handleDeleteProject}
            onAdd={handleAddProject}
            showEmptyState={
              isInitialEmptyState || filteredProjects.length === 0
            }
          />
        ) : (
          <Card className="text-center p-12 shadow-lg rounded-xl">
            <Package className="h-16 w-16 text-gray-400 mb-6 mx-auto" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              No Projects Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by adding your first construction project.
            </p>
            <Button onClick={handleAddProject}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Project
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminProjects;
