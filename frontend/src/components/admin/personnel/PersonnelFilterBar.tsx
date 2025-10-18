import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, UserPlus } from "lucide-react";
import { Personnel } from "@/pages/admin/ManagePersonnelPage";

interface PersonnelFilterBarProps {
  searchTerm: string;
  statusFilter: "all" | Personnel["status"];
  departmentFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: "all" | Personnel["status"]) => void;
  onDepartmentChange: (value: string) => void;
  departments: string[];
  onAddNew: () => void;
}

export const PersonnelFilterBar: React.FC<PersonnelFilterBarProps> = ({
  searchTerm,
  statusFilter,
  departmentFilter,
  onSearchChange,
  onStatusChange,
  onDepartmentChange,
  departments,
  onAddNew,
}) => {
  return (
    <Card className="shadow-lg rounded-2xl bg-white p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
          <Filter className="h-6 w-6 text-blue-600" />
          Browse & Filter
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search by name, email, position..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 pr-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
            />
          </div>
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full sm:w-[180px] rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on_leave">On Leave</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={onDepartmentChange}>
            <SelectTrigger className="w-full sm:w-[220px] rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <SelectValue placeholder="Filter by Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={onAddNew}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center gap-2"
          >
            <UserPlus className="h-5 w-5" /> Add New
          </Button>
        </div>
      </div>
    </Card>
  );
};
