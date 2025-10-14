import { Link } from "react-router-dom";
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
import { MapPin, Calendar, Layers, CheckCircle2, Zap } from "lucide-react"; // Added Zap for "In Progress"
import { getCategoryColor, getCategoryIcon } from "@/utils/projectUtils";
import { Project } from "@/types"; // Make sure this imports from the new index.ts

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  // Combine location fields for a cleaner display
  const displayLocation = `${project.cityMunicipality}, ${project.province}`;

  return (
    <Card
      className="overflow-hidden rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 ease-in-out group animate-scale-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="h-60 overflow-hidden relative">
        <img
          src={project.image} // CHANGED
          alt={project.projectTitle} // CHANGED
          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-4 left-4 z-10">
          <Badge
            className={`${getCategoryColor(
              project.projectCategory // CHANGED
            )} flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm transition-transform duration-300 hover:scale-110`}
          >
            {getCategoryIcon(project.projectCategory)} {/* CHANGED */}
            {project.projectCategory} {/* CHANGED */}
          </Badge>
        </div>

        {/* DYNAMIC STATUS BADGE */}
        <div className="absolute top-4 right-4 z-10">
          {project.projectStatus === "Completed" ? (
            <Badge className="bg-green-500/90 backdrop-blur-sm text-white flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-full shadow-lg transition-transform duration-300 hover:scale-110">
              <CheckCircle2 className="h-3.5 w-3.5" /> Completed
            </Badge>
          ) : (
            <Badge className="bg-yellow-500/90 backdrop-blur-sm text-white flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-full shadow-lg transition-transform duration-300 hover:scale-110">
              <Zap className="h-3.5 w-3.5" /> In Progress
            </Badge>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-300">
          {project.projectTitle} {/* CHANGED */}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-3 text-base">
          {project.shortDescription} {/* CHANGED */}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-4">
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors duration-300">
            <MapPin className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
            <span className="font-medium">{displayLocation}</span>{" "}
            {/* CHANGED */}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-indigo-300 transition-all duration-300 hover:scale-105 group/stat">
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
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-indigo-300 transition-all duration-300 hover:scale-105 group/stat">
              <Calendar className="h-4 w-4 mr-2 text-blue-500 dark:text-indigo-400 group-hover/stat:rotate-12 transition-transform" />
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  Completed
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-50">
                  {new Date(project.completionDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link to={`/project/${project._id}`} className="w-full">
          {" "}
          {/* CHANGED */}
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
  );
};

export default ProjectCard;
