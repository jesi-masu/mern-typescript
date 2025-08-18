
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface FilterSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: 'all' | 'active' | 'on_leave' | 'offline';
  setStatusFilter: (filter: 'all' | 'active' | 'on_leave' | 'offline') => void;
  departmentFilter: 'all' | 'Administration' | 'Operations' | 'Project Management' | 'Customer Service';
  setDepartmentFilter: (filter: 'all' | 'Administration' | 'Operations' | 'Project Management' | 'Customer Service') => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  departmentFilter,
  setDepartmentFilter
}) => {
  return (
    <Card className="bg-white shadow-sm border-gray-100">
      <CardHeader className="border-b border-gray-50 bg-gray-50/50 rounded-t-lg">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Search className="w-5 h-5" />
          Search & Filter Personnel
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, position, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-gray-200 focus:border-blue-500 rounded-lg"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1">
              {(['all', 'active', 'on_leave', 'offline'] as const).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  onClick={() => setStatusFilter(status)}
                  className="capitalize text-sm px-4 py-2 rounded-lg transition-all duration-200"
                >
                  {status.replace('_', ' ')}
                </Button>
              ))}
            </div>
            <div className="w-px bg-gray-200 mx-2"></div>
            <div className="flex gap-1">
              {(['all', 'Administration', 'Operations', 'Project Management', 'Customer Service'] as const).map((dept) => (
                <Button
                  key={dept}
                  variant={departmentFilter === dept ? "default" : "outline"}
                  onClick={() => setDepartmentFilter(dept)}
                  className="text-sm px-4 py-2 rounded-lg transition-all duration-200"
                >
                  {dept}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSection;
