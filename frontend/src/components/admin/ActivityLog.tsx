// frontend/src/pages/admin/ActivityLog.tsx (or wherever you placed it)

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  Clock,
  User,
  Activity,
  Filter,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --- Types ---
// NOTE: This type now matches the data coming from your backend API.
// You should update your `@/types/admin.ts` file to match this structure.
export interface ActivityLogType {
  _id: string; // Mongoose uses _id
  userId: string | null;
  userName: string;
  action: string;
  details: string;
  category:
    | "orders"
    | "products"
    | "projects"
    | "contracts"
    | "users"
    | "system";
  createdAt: string; // Mongoose uses createdAt
}

interface FetchLogsResponse {
  logs: ActivityLogType[];
  page: number;
  limit: number;
  totalPages: number;
  totalLogs: number;
}

// --- API Fetching Function ---
const fetchActivityLogs = async (
  token: string,
  page: number,
  search: string,
  category: string
): Promise<FetchLogsResponse> => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", "20"); // You can make this dynamic
  if (search) {
    params.append("search", search);
  }
  if (category && category !== "all") {
    params.append("category", category);
  }

  const response = await fetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/api/activity-logs?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch activity logs.");
  }
  return response.json();
};

// Helper function for permissions (same as your file)
const hasPermission = (userRole: string, permission: string): boolean => {
  const rolePermissions: Record<string, string[]> = {
    admin: [
      "view_activity_logs",
      "manage_settings",
      "manage_users",
      "view_reports",
      "view_dashboard",
      "view_projects",
      "view_products",
      "manage_orders",
      "view_contracts",
      "view_customers",
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

// --- The Component ---
const ActivityLog: React.FC = () => {
  // Make sure your useAuth hook provides `token`
  const { user, token, isLoading: isAuthLoading } = useAuth();

  // --- State Management ---
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // --- Debouncing Effect ---
  // Prevents spamming the API on every single keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on a new search
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // --- Data Fetching with React Query ---
  const {
    data,
    isLoading: isLogsLoading,
    isFetching,
    error,
  } = useQuery<FetchLogsResponse>({
    // queryKey uniquely identifies this query
    queryKey: ["activityLogs", page, debouncedSearch, categoryFilter],
    // The query function to run
    queryFn: () =>
      fetchActivityLogs(token!, page, debouncedSearch, categoryFilter),
    // Only run this query if we are logged in (have a token and user)
    enabled: !!token && !!user,
    // This is a nice UX touch: it keeps the old data visible
    // while the new page is fetching in the background.
    keepPreviousData: true,
  });

  // --- Event Handlers ---
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setPage(1); // Reset to page 1 on new filter
  };

  // --- Helper Functions (same as your file) ---
  const getCategoryColor = (category: ActivityLogType["category"]) => {
    const colors = {
      orders: "bg-blue-100 text-blue-800",
      products: "bg-green-100 text-green-800",
      projects: "bg-purple-100 text-purple-800",
      contracts: "bg-orange-100 text-orange-800",
      users: "bg-red-100 text-red-800",
      system: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.system;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --- Render States ---
  if (isAuthLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !hasPermission(user.role, "view_activity_logs")) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-600">
            You don't have permission to view activity logs.
          </p>
        </div>
      </div>
    );
  }

  // --- Main Component JSX ---
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Activity Log</h2>
          <p className="text-gray-600">
            Track all system activities and user actions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            {data ? `${data.totalLogs} total activities` : "Loading..."}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-500" />
              Filter Activities
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Input
                placeholder="Search by action, user, or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sm:w-64"
              />
              <Select
                value={categoryFilter}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="projects">Projects</SelectItem>
                  <SelectItem value="contracts">Contracts</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* --- Loading & Error States for the query --- */}
          {isLogsLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" /> Error loading
              data.
            </div>
          ) : data && data.logs.length > 0 ? (
            // --- Render Logs ---
            <div className="space-y-3">
              {data.logs.map((log) => (
                <div
                  key={log._id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getCategoryColor(log.category)}>
                          {log.category}
                        </Badge>
                        <span className="font-medium text-gray-900">
                          {log.action}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{log.details}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {log.userName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {/* Use createdAt, not timestamp */}
                          {formatDate(log.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // --- Empty State ---
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No activities found
              </h3>
              <p className="text-gray-600">
                {searchQuery || categoryFilter !== "all"
                  ? "No activities match your current filters."
                  : "Activity logs will appear here as actions are performed."}
              </p>
            </div>
          )}

          {/* --- Pagination Controls --- */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 mt-6 border-t">
              <span className="text-sm text-gray-600">
                Page {data.page} of {data.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page <= 1 || isFetching}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= data.totalPages || isFetching}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                  {/* Show a mini-loader when fetching next page */}
                  {isFetching && (
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLog;
