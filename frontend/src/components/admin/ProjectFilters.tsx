// src/components/admin/ProjectFilters.tsx

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";

interface ProjectFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  totalCount: number;
  filteredCount: number;
}

const ProjectFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  totalCount,
  filteredCount,
}: ProjectFiltersProps) => {
  return (
    <CardHeader>
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
            <Filter className="h-6 w-6 text-blue-600" />
            Project Filters
          </CardTitle>
          <CardDescription className="mt-2 ml-9">
            Total: {totalCount} projects • Filtered: {filteredCount}
          </CardDescription>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-2 rounded-lg border-gray-300 w-full sm:w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 rounded-lg border-gray-300">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48 rounded-lg border-gray-300">
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
  );
};

export default ProjectFilters;
