// adjusted fetch enabling and headers so the page can render for AdminAuthContext demo logins
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
  DollarSign,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useContext } from "react";
import { AdminAuthContext } from "@/context/AdminAuthContext";

// Define the expected structure for the dashboard statistics from the API
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

// Helper function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value);
};

// Helper function to format numbers with commas
const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const adminContext = useContext(AdminAuthContext);
  const isAdminLoggedInDemo = adminContext?.isAuthenticated === true;

  // --- Data Fetching using React Query ---
  const fetchDashboardStats = async (): Promise<DashboardStats> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    // If token is absent but admin demo login is active, we still attempt the request (may fail on protected backend).
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/stats`,
      {
        headers,
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  // useQuery hook to manage the fetching, caching, loading, and error states
  // Enabled when we have a real token OR when admin demo is logged in (so page is accessible).
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
    enabled: !!token || isAdminLoggedInDemo, // run if token exists or demo admin is logged in
  });

  const handleQuickAction = (action: string) => {
    navigate(`/admin/${action}`);
  };

  // --- UI States ---

  // Loading State - combine both loaders
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // Error State
  if (error) {
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

  // Success State
  const statCards = stats
    ? [
        {
          title: "Total Revenue",
          value: formatCurrency(stats.totalRevenue),
          change: `+${stats.revenueChange}%`,
          icon: DollarSign,
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          System Operational
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates from your business (Static Example)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* This section is static for now but could be powered by another API endpoint */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">New order received</p>
                  <p className="text-sm text-gray-600">Order #ORD-2024-001</p>
                </div>
                <Badge variant="outline">New</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Product updated</p>
                  <p className="text-sm text-gray-600">Modern Container Home</p>
                </div>
                <Badge variant="outline">Updated</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

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
