// src/pages/admin/Dashboard.tsx
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  PhilippinePeso,
  Loader2,
  AlertTriangle,
  ListOrdered, // Icon for Recent Activities
  AlertCircle, // Icon for error
  Activity, // Icon for empty state
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
// ✨ 1. IMPORT THE PERMISSION CHECKER
import { hasUserPermission } from "@/utils/adminPermissions";

// --- Main Dashboard Stats Type ---
interface DashboardStats {
  totalRevenue: number;
  activeOrders: number;
  totalCustomers: number;
  productsSold: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  productsChange: number;
}

// --- Type for Activity Log ---
interface ActivityLogType {
  _id: string;
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
  createdAt: string;
}
interface FetchLogsResponse {
  logs: ActivityLogType[];
  page: number;
  limit: number;
  totalPages: number;
  totalLogs: number;
}

// --- Helper functions for formatting ---
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value);
};
const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
};

// --- Helper function for relative time ---
const formatRelativeTime = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (error) {
    return "just now";
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  // ✨ 2. GET THE FULL USER OBJECT (it includes the role)
  const { user, token, isLoading: isAuthLoading } = useAuth();

  // --- Query 1: Dashboard Stats ---
  const fetchDashboardStats = async (): Promise<DashboardStats> => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/stats`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch dashboard statistics");
    }
    return response.json();
  };

  const {
    data: stats,
    isLoading: isStatsLoading,
    error: statsError,
  } = useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
    // Only fetch stats if the user is authorized to see them
    enabled:
      !isAuthLoading &&
      !!token &&
      !!user &&
      hasUserPermission(user.role, "view_company_stats"),
  });

  // --- Query 2: Recent Order Activities ---
  const fetchRecentOrderActivities = async (): Promise<FetchLogsResponse> => {
    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/activity-logs?category=orders&limit=10&page=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch recent activities");
    }
    return response.json();
  };

  const {
    data: activitiesData,
    isLoading: isActivitiesLoading,
    error: activitiesError,
  } = useQuery<FetchLogsResponse>({
    queryKey: ["recentOrderActivities"],
    queryFn: fetchRecentOrderActivities,
    enabled: !isAuthLoading && !!token,
  });

  const handleQuickAction = (action: string) => {
    navigate(`/admin/${action}`);
  };

  // --- Helper to render activity badges ---
  const renderActivityBadge = (action: string) => {
    if (action.includes("Created")) {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          New
        </Badge>
      );
    }
    if (action.includes("Uploaded")) {
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          Upload
        </Badge>
      );
    }
    if (action.includes("Updated")) {
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          Update
        </Badge>
      );
    }
    return <Badge variant="outline">Log</Badge>;
  };

  // --- UI States ---
  if (isAuthLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // Error State for stats *if* the user was supposed to see them
  if (
    statsError &&
    user &&
    hasUserPermission(user.role, "view_company_stats")
  ) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center bg-red-50 p-4 rounded-lg">
        <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
        <p className="font-semibold text-red-700">
          Failed to load dashboard data
        </p>
        <p className="text-sm text-red-600">
          Please check your connection or try again later.
        </p>
      </div>
    );
  }

  // Data for the stat cards
  const statCards = stats
    ? [
        {
          title: "Total Revenue",
          value: formatCurrency(stats.totalRevenue),
          change: `+${stats.revenueChange}%`,
          icon: PhilippinePeso,
          color: "text-green-600",
        },
        {
          title: "Active Orders",
          value: formatNumber(stats.activeOrders),
          change: `+${stats.ordersChange}%`,
          icon: ShoppingCart,
          color: "text-blue-600",
        },
        {
          title: "Total Customers",
          value: formatNumber(stats.totalCustomers),
          change: `+${stats.customersChange}%`,
          icon: Users,
          color: "text-purple-600",
        },
        {
          title: "Products Sold",
          value: formatNumber(stats.productsSold),
          change: `+${stats.productsChange}%`,
          icon: Package,
          color: "text-orange-600",
        },
      ]
    : [];

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || "Staff"}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user && hasUserPermission(user.role, "view_company_stats")
              ? "Here's what's happening with your business today."
              : "Manage your assigned tasks and orders."}
          </p>
        </div>
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          System Operational
        </Badge>
      </div>

      {/* ✨ 3. WRAP THE STATS IN THE PERMISSION CHECK */}
      {user && hasUserPermission(user.role, "view_company_stats") ? (
        // This is what ONLY ADMINS will see:
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isStatsLoading
            ? // Show skeletons or loader while stats are loading
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </CardContent>
                </Card>
              ))
            : // Show the stat cards once loaded
              statCards.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <p
                      className={`text-xs ${stat.color} flex items-center gap-1 mt-1`}
                    >
                      <TrendingUp className="h-3 w-3" />
                      {stat.change} from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
        </div>
      ) : (
        // This is what PERSONNEL will see instead:
        <Card>
          <CardHeader>
            <CardTitle>Personnel Dashboard</CardTitle>
            <CardDescription>
              You can manage your assigned orders, projects, and messages using
              the sidebar.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
      {/* END OF PERMISSION CHECK */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* --- Recent Activities Card (Visible to both) --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListOrdered className="h-5 w-5" />
              Recent Order Activities
            </CardTitle>
            <CardDescription>
              The 10 latest activities from the 'orders' category.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] overflow-y-auto pr-2">
            {isActivitiesLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : activitiesError ? (
              <div className="flex flex-col h-full items-center justify-center text-red-500">
                <AlertCircle className="h-8 w-8 mb-2" />
                <p className="font-medium">Failed to load activities</p>
              </div>
            ) : !activitiesData || activitiesData.logs.length === 0 ? (
              <div className="flex flex-col h-full items-center justify-center text-gray-500">
                <Activity className="h-8 w-8 mb-2" />
                <p className="font-medium">No recent order activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activitiesData.logs.map((log) => (
                  <div
                    key={log._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 overflow-hidden">
                      <p className="font-medium truncate" title={log.action}>
                        {log.action}
                      </p>
                      <p
                        className="text-sm text-gray-600 truncate"
                        title={log.details}
                      >
                        {log.details}
                      </p>
                      <p className="text-xs text-gray-500 pt-1">
                        {formatRelativeTime(log.createdAt)} by {log.userName}
                      </p>
                    </div>
                    <div className="pl-2">
                      {renderActivityBadge(log.action)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* --- Quick Actions Card (Visible to both) --- */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleQuickAction("products")}
                className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              >
                <Package className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-medium text-blue-900">Manage Products</p>
                <p className="text-sm text-blue-700">Add or edit items</p>
              </button>
              <button
                onClick={() => handleQuickAction("customers")}
                className="p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors cursor-pointer"
              >
                <Users className="h-6 w-6 text-green-600 mb-2" />
                <p className="font-medium text-green-900">View Customers</p>
                <p className="text-sm text-green-700">See customer list</p>
              </button>
              <button
                onClick={() => handleQuickAction("orders")}
                className="p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
              >
                <ShoppingCart className="h-6 w-6 text-purple-600 mb-2" />
                <p className="font-medium text-purple-900">Process Orders</p>
                <p className="text-sm text-purple-700">Manage active orders</p>
              </button>
              <button
                onClick={() => handleQuickAction("reports")}
                className="p-4 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors cursor-pointer"
              >
                <BarChart3 className="h-6 w-6 text-orange-600 mb-2" />
                <p className="font-medium text-orange-900">View Reports</p>
                <p className="text-sm text-orange-700">Check analytics</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Dashboard;
