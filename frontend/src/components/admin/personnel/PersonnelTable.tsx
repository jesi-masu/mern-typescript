import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Personnel } from "@/pages/admin/ManagePersonnelPage";
import { Users, Mail, Phone, UserCheck, Clock, PowerOff } from "lucide-react";

interface PersonnelTableProps {
  personnelList: Personnel[];
  isLoading: boolean;
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
}

export const statusMap: {
  [key in Personnel["status"]]: {
    icon: React.ElementType;
    color: string;
    bg: string;
    text: string;
  };
} = {
  active: {
    icon: UserCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    text: "Active",
  },
  on_leave: {
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-100",
    text: "On Leave",
  },
  inactive: {
    icon: PowerOff,
    color: "text-gray-500",
    bg: "bg-gray-100",
    text: "Inactive",
  },
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

export const PersonnelTable: React.FC<PersonnelTableProps> = ({
  personnelList,
  isLoading,
  onViewDetails,
  onEdit,
}) => {
  return (
    <Card className="bg-white shadow-xl border border-gray-100 rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 p-6">
        <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
          <Users className="w-6 h-6 text-gray-700" />
          Personnel List ({isLoading ? "..." : personnelList.length} found)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/70 border-b border-gray-100 text-gray-600 text-sm">
                <TableHead className="py-4 px-6 font-semibold">
                  Member
                </TableHead>
                <TableHead className="py-4 px-6 font-semibold">
                  Role & Position
                </TableHead>
                <TableHead className="py-4 px-6 font-semibold">
                  Department
                </TableHead>
                <TableHead className="py-4 px-6 font-semibold">
                  Status
                </TableHead>
                <TableHead className="py-4 px-6 font-semibold">
                  Joined
                </TableHead>
                <TableHead className="py-4 px-6 font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && personnelList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : personnelList.length > 0 ? (
                personnelList.map((member) => (
                  <TableRow
                    key={member._id}
                    className="group hover:bg-gray-50 transition-colors duration-200"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg">
                          {member.firstName.charAt(0)}
                          {member.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-base font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {member.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {member.phoneNumber}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 capitalize">
                        {member.role}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.position || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-700">
                      {member.department || "N/A"}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge
                        className={`${statusMap[member.status].bg} ${
                          statusMap[member.status].color
                        } font-medium px-2 py-1 rounded-md text-xs`}
                      >
                        {React.createElement(statusMap[member.status].icon, {
                          className: "h-3 w-3 mr-1",
                        })}
                        {statusMap[member.status].text}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(member.createdAt)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                        onClick={() => onViewDetails(member._id)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 ml-2"
                        onClick={() => onEdit(member._id)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-gray-500"
                  >
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No Personnel Found
                    </h3>
                    <p>No team members match your current filter criteria.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
