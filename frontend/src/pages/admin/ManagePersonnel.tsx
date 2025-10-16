import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext"; // Using the correct auth hook
import {
  UserCheck,
  Clock,
  Shield,
  Activity,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  Users,
  UserPlus,
  Mail,
  Phone,
  Loader2,
  PowerOff,
  CheckCircle,
  Hourglass,
} from "lucide-react";

// --- Type Definitions ---
interface PersonnelMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "personnel";
  position: string;
  status: "active" | "on_leave" | "offline";
  operationalStatus: "available" | "busy" | "away" | "do_not_disturb";
  lastLogin: string;
  loginStatus: "online" | "offline";
  department: string;
  location: string;
  joinDate: string;
  lastActivity: string;
  projectsAssigned: number;
  completedTasks: number;
  efficiency: number;
  workingHours: string;
}

// --- Status Icon and Color Mappings ---
const personnelStatusMap = {
  active: { icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
  on_leave: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
  offline: { icon: PowerOff, color: "text-gray-500", bg: "bg-gray-50" },
};
const operationalStatusMap = {
  available: { icon: CheckCircle, color: "text-green-500", text: "Available" },
  busy: { icon: Hourglass, color: "text-orange-500", text: "Busy" },
  away: { icon: Clock, color: "text-blue-500", text: "Away" },
  do_not_disturb: {
    icon: AlertCircle,
    color: "text-red-500",
    text: "Do Not Disturb",
  },
};
const loginStatusMap = {
  online: { color: "bg-green-500", text: "Online" },
  offline: { color: "bg-gray-400", text: "Offline" },
};

// Helper function for checking permissions
const hasPermission = (userRole: string, permission: string): boolean => {
  const rolePermissions: Record<string, string[]> = {
    admin: [
      "manage_users",
      "manage_settings",
      "view_dashboard",
      "view_projects",
      "view_products",
      "manage_orders",
      "view_contracts",
      "view_customers",
      "view_reports",
      "view_activity_logs",
    ],
    personnel: [
      "view_dashboard",
      "view_projects",
      "view_products",
      "manage_orders",
      "view_customers",
    ],
    client: [],
  };
  return rolePermissions[userRole]?.includes(permission) || false;
};

const ManagePersonnel: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | PersonnelMember["status"]
  >("all");
  const [departmentFilter, setDepartmentFilter] = useState<
    "all" | PersonnelMember["department"]
  >("all");

  // Static data for demonstration
  const [personnel, setPersonnel] = useState<PersonnelMember[]>([
    {
      id: "1",
      name: "Marcus Chen",
      email: "marcus.chen@prefabplus.com",
      phone: "+63 917 123 4567",
      role: "admin",
      position: "Chief Operations Officer",
      status: "active",
      operationalStatus: "available",
      lastLogin: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      loginStatus: "online",
      department: "Administration",
      location: "Manila HQ",
      joinDate: "2023-01-15",
      lastActivity: "Reviewed Q4 reports",
      projectsAssigned: 12,
      completedTasks: 245,
      efficiency: 98,
      workingHours: "08:00 - 17:00",
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria.santos@prefabplus.com",
      phone: "+63 918 234 5678",
      role: "personnel",
      position: "Project Coordinator",
      status: "active",
      operationalStatus: "busy",
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      loginStatus: "online",
      department: "Operations",
      location: "Cebu Branch",
      joinDate: "2023-03-20",
      lastActivity: "Updated project timeline",
      projectsAssigned: 8,
      completedTasks: 187,
      efficiency: 94,
      workingHours: "07:00 - 16:00",
    },
    // ... other personnel data
  ]);

  const filteredPersonnel = personnel.filter((member) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesSearch =
      member.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      member.email.toLowerCase().includes(lowerCaseSearchTerm) ||
      member.department.toLowerCase().includes(lowerCaseSearchTerm) ||
      member.position.toLowerCase().includes(lowerCaseSearchTerm);
    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;
    const matchesDepartment =
      departmentFilter === "all" || member.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const updatePersonnelStatus = (
    id: string,
    newStatus: "active" | "on_leave"
  ) => {
    setPersonnel((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, status: newStatus } : member
      )
    );
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user || !hasPermission(user.role, "manage_users")) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-xl">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg border border-gray-100">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h3>
          <p className="text-lg text-gray-600">
            You do not have permission to manage personnel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 p-4 sm:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-3xl border border-gray-100 shadow-xl p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-200 rounded-full opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-200 rounded-full opacity-15 transform translate-x-1/3 translate-y-1/3"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between z-10 relative">
          <div>
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-2">
              Team <span className="text-indigo-700">Roster</span>
            </h1>
            <p className="text-xl text-gray-600">
              Effortlessly manage your team, track their status, and monitor key
              metrics.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-8 mt-6 md:mt-0">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-700">
                {personnel.length}
              </div>
              <div className="text-base font-medium text-gray-600 mt-1">
                Total Members
              </div>
            </div>
            <div className="w-px h-20 bg-gray-200 hidden sm:block"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600">
                {personnel.filter((p) => p.loginStatus === "online").length}
              </div>
              <div className="text-base font-medium text-gray-600 mt-1">
                Currently Online
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 z-10 relative">
          <Card className="bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Active
              </CardTitle>
              <div className="p-2 bg-emerald-100 rounded-full">
                <UserCheck className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {personnel.filter((p) => p.status === "active").length}
              </div>
              <p className="text-sm text-gray-500">Ready for assignments</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Online Now
              </CardTitle>
              <div className="p-2 bg-blue-100 rounded-full">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {personnel.filter((p) => p.loginStatus === "online").length}
              </div>
              <p className="text-sm text-gray-500">Currently logged in</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-semibold text-gray-700">
                On Leave
              </CardTitle>
              <div className="p-2 bg-amber-100 rounded-full">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {personnel.filter((p) => p.status === "on_leave").length}
              </div>
              <p className="text-sm text-gray-500">Temporarily unavailable</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Avg. Efficiency
              </CardTitle>
              <div className="p-2 bg-purple-100 rounded-full">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {personnel.length > 0
                  ? Math.round(
                      personnel.reduce((acc, p) => acc + p.efficiency, 0) /
                        personnel.length
                    )
                  : 0}
                %
              </div>
              <p className="text-sm text-gray-500">Overall team performance</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="shadow-lg rounded-2xl bg-white p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
            <Filter className="h-6 w-6 text-gray-600" />
            Browse & Filter
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 w-full text-base"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(
                  value as "all" | "active" | "on_leave" | "offline"
                )
              }
            >
              <SelectTrigger className="w-full sm:w-[180px] rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-base">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-lg border border-gray-100">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-full sm:w-[220px] rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-base">
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-lg border border-gray-100">
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Administration">Administration</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Project Management">
                  Project Management
                </SelectItem>
                <SelectItem value="Customer Service">
                  Customer Service
                </SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all duration-300 flex items-center gap-2">
              <UserPlus className="h-5 w-5" /> Add New
            </Button>
          </div>
        </div>
      </Card>

      <Card className="bg-white shadow-xl border border-gray-100 rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 p-6">
          <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
            <Users className="w-6 h-6 text-gray-700" />
            Current Personnel List ({filteredPersonnel.length} found)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="[&_tr]:border-b-0">
                <TableRow className="bg-gray-50/70 border-b border-gray-100 text-gray-600 text-sm">
                  <TableHead className="py-4 px-6 font-semibold text-gray-700">
                    Member
                  </TableHead>
                  <TableHead className="py-4 px-6 font-semibold text-gray-700">
                    Role & Department
                  </TableHead>
                  <TableHead className="py-4 px-6 font-semibold text-gray-700">
                    Current Status
                  </TableHead>
                  <TableHead className="py-4 px-6 font-semibold text-gray-700 text-center">
                    Performance
                  </TableHead>
                  <TableHead className="py-4 px-6 font-semibold text-gray-700">
                    Last Activity
                  </TableHead>
                  <TableHead className="py-4 px-6 font-semibold text-gray-700 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPersonnel.length > 0 ? (
                  filteredPersonnel.map((member) => (
                    <TableRow
                      key={member.id}
                      className="group hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-base font-medium text-gray-900">
                              {member.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {member.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {member.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {member.position}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.department}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Joined:{" "}
                          {new Date(member.joinDate).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            className={`${
                              personnelStatusMap[member.status].bg
                            } ${
                              personnelStatusMap[member.status].color
                            } font-medium px-2 py-1 rounded-md text-xs`}
                          >
                            {React.createElement(
                              personnelStatusMap[member.status].icon,
                              { className: "h-3 w-3 mr-1" }
                            )}
                            {member.status
                              .replace("_", " ")
                              .split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`border-none ${
                              operationalStatusMap[member.operationalStatus]
                                .color
                            } ${
                              loginStatusMap[member.loginStatus].color ===
                              "bg-green-500"
                                ? "border-green-400 bg-green-50/50"
                                : "border-gray-300 bg-gray-50/50"
                            } text-xs px-2 py-1`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full mr-1 ${
                                loginStatusMap[member.loginStatus].color
                              }`}
                            />
                            {loginStatusMap[member.loginStatus].text}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`border-none text-gray-600 bg-gray-100 text-xs px-2 py-1`}
                          >
                            {React.createElement(
                              operationalStatusMap[member.operationalStatus]
                                .icon,
                              { className: "h-3 w-3 mr-1" }
                            )}
                            {
                              operationalStatusMap[member.operationalStatus]
                                .text
                            }
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Last Login:{" "}
                          {new Date(member.lastLogin).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-base font-semibold text-gray-900">
                          {member.efficiency}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.projectsAssigned} Projects,{" "}
                          {member.completedTasks} Tasks
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-xs truncate">
                          {member.lastActivity}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Working hours: {member.workingHours}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 ml-2"
                          onClick={() =>
                            updatePersonnelStatus(
                              member.id,
                              member.status === "active" ? "on_leave" : "active"
                            )
                          }
                        >
                          {member.status === "active"
                            ? "Mark On Leave"
                            : "Mark Active"}
                        </Button>
                      </td>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-700 mb-2">
                        No Personnel Found
                      </h3>
                      <p className="text-lg">
                        {searchTerm ||
                        statusFilter !== "all" ||
                        departmentFilter !== "all"
                          ? "No personnel match your current search or filter criteria. Please adjust your selections."
                          : "It looks like there are no team members to display yet. Add new personnel to get started!"}
                      </p>
                    </td>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagePersonnel;
