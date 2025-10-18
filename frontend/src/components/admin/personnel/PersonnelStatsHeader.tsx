import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Clock } from "lucide-react"; // Simplified icons

interface PersonnelStatsHeaderProps {
  totalCount: number;
  activeCount: number;
  onLeaveCount: number;
}

export const PersonnelStatsHeader: React.FC<PersonnelStatsHeaderProps> = ({
  totalCount,
  activeCount,
  onLeaveCount,
}) => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-3xl border border-gray-100 shadow-xl p-10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-200 rounded-full opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-200 rounded-full opacity-15 transform translate-x-1/3 translate-y-1/3"></div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between z-10 relative">
        <div>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-2">
            Manage <span className="text-indigo-700">Effeciently</span>
          </h1>
          <p className="text-xl text-gray-600">
            Your administrators and personnel
          </p>
        </div>
        <div className="text-center mt-6 md:mt-0">
          <div className="text-4xl font-bold text-blue-700">{totalCount}</div>
          <div className="text-base font-medium text-gray-600 mt-1">
            Total Members
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 z-10 relative">
        <Card className="bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-700">
              Active
            </CardTitle>
            <div className="p-2 bg-emerald-100 rounded-full">
              <UserCheck className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {activeCount}
            </div>
            <p className="text-sm text-gray-500">Currently active members</p>
          </CardContent>
        </Card>
        <Card className="bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-700">
              On Leave
            </CardTitle>
            <div className="p-2 bg-amber-100 rounded-full">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {onLeaveCount}
            </div>
            <p className="text-sm text-gray-500">Temporarily unavailable</p>
          </CardContent>
        </Card>
        {/* Add card for Inactive if you implement that status */}
      </div>
    </div>
  );
};
