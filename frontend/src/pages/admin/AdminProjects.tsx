
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Project } from "@/data/projectsInterface";
import { projectsData } from "@/data/projectsData";
import ProjectForm, { ProjectFormData } from "@/components/admin/ProjectForm";

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>(projectsData);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projectsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Filter projects based on search query, status, and category
  useEffect(() => {
    let result = projects;
    
    if (searchQuery) {
      result = result.filter(project => 
        project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      result = result.filter(project => project.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter(project => project.category === categoryFilter);
    }
    
    setFilteredProjects(result);
  }, [searchQuery, statusFilter, categoryFilter, projects]);

  const handleAddProject = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDeleteProject = (projectId: number) => {
    const updatedProjects = projects.filter(project => project.id !== projectId);
    setProjects(updatedProjects);
    toast.success("Project deleted successfully");
  };

  const handleFormSubmit = (data: ProjectFormData) => {
    if (editingProject) {
      // Update existing project - ensure all required fields are present
      const updatedProject: Project = {
        id: editingProject.id,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        status: data.status,
        progress: data.progress,
        modules: data.modules,
        completionDate: data.completionDate,
        location: data.location,
        category: data.category
      };
      
      const updatedProjects = projects.map(project => 
        project.id === editingProject.id ? updatedProject : project
      );
      setProjects(updatedProjects);
      toast.success(`Project "${data.title}" updated successfully`);
    } else {
      // Add new project - ensure all required fields are present
      const newProject: Project = {
        id: projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        status: data.status,
        progress: data.progress,
        modules: data.modules,
        completionDate: data.completionDate,
        location: data.location,
        category: data.category
      };
      setProjects([...projects, newProject]);
      toast.success(`Project "${data.title}" added successfully`);
    }
    
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planning":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Residential":
        return "bg-green-100 text-green-800";
      case "Commercial":
        return "bg-blue-100 text-blue-800";
      case "Industrial":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects Management</h1>
          <p className="text-gray-600 mt-1">Manage all your prefab construction projects</p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddProject} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </DialogTitle>
            </DialogHeader>
            <ProjectForm
              project={editingProject}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>All Projects</CardTitle>
              <CardDescription>
                Total: {projects.length} projects • Filtered: {filteredProjects.length}
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:w-64"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="sm:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredProjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Project</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Location</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Progress</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Modules</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Completion</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-2">
                        <div>
                          <div className="font-medium text-gray-900">{project.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {project.description}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <Badge className={`${getCategoryColor(project.category)} border`}>
                          {project.category}
                        </Badge>
                      </td>
                      <td className="py-4 px-2 text-gray-700">{project.location}</td>
                      <td className="py-4 px-2">
                        <Badge className={`${getStatusColor(project.status)} border`}>
                          {project.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
                            {project.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-gray-700">{project.modules}</td>
                      <td className="py-4 px-2 text-gray-700">
                        {new Date(project.completionDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex justify-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditProject(project)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{project.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteProject(project.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                  ? "No projects match your current filters." 
                  : "Get started by adding your first project."}
              </p>
              {(!searchQuery && statusFilter === "all" && categoryFilter === "all") && (
                <Button onClick={handleAddProject} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Project
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProjects;
