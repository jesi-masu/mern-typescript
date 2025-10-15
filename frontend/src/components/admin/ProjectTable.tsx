// src/components/admin/ProjectTable.tsx

import { useNavigate } from "react-router-dom";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Project } from "@/types";

interface ProjectTableProps {
  projects: Project[];
  onDelete: (projectId: string) => void;
  onAdd: () => void;
  showEmptyState: boolean;
}

const ProjectTable = ({
  projects,
  onDelete,
  onAdd,
  showEmptyState,
}: ProjectTableProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
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
    <CardContent>
      {projects.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-gray-700">
                  Project
                </th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">
                  Category
                </th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">
                  Location
                </th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">
                  Modules
                </th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">
                  Completion
                </th>
                <th className="text-center py-3 px-2 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-2">
                    <div>
                      <div className="font-medium text-gray-900">
                        {project.projectTitle}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {project.shortDescription}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <Badge
                      className={`${getCategoryColor(
                        project.projectCategory
                      )} border`}
                    >
                      {project.projectCategory}
                    </Badge>
                  </td>
                  <td className="py-4 px-2 text-gray-700">{`${project.cityMunicipality}, ${project.province}`}</td>
                  <td className="py-4 px-2">
                    <Badge
                      className={`${getStatusColor(
                        project.projectStatus
                      )} border`}
                    >
                      {project.projectStatus}
                    </Badge>
                  </td>
                  <td className="py-4 px-2 text-gray-700">{project.modules}</td>
                  <td className="py-4 px-2 text-gray-700">
                    {new Date(project.completionDate).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "short", day: "numeric" }
                    )}
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/admin/projects/edit/${project._id}`)
                        }
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
                              Are you sure you want to delete "
                              {project.projectTitle}"? This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(project._id)}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No projects found
          </h3>
          <p className="text-gray-600 mb-4">
            {showEmptyState
              ? "Get started by adding your first project."
              : "No projects match your current filters."}
          </p>
          {showEmptyState && (
            <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Project
            </Button>
          )}
        </div>
      )}
    </CardContent>
  );
};

export default ProjectTable;
