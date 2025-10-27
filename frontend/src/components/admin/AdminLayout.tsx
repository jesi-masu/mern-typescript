import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AdminSidebar } from "./layout/AdminSidebar";
import { AdminHeader } from "./layout/AdminHeader";
import { useAuth } from "@/context/AuthContext";
// ✨ Import the central permission checker
// (Adjust this path if your adminPermission.ts file is elsewhere, e.g., @/lib/...)
import { hasUserPermission } from "@/utils/adminPermissions";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  FileText,
  Building2,
  Activity,
  Shield,
  User,
  Upload,
  Image,
  MessageSquare,
} from "lucide-react";
import { Loader2 } from "lucide-react";

// ❌ The local hasPermission function has been REMOVED.
// We now use the imported `hasUserPermission` function.

const navItems = [
  {
    to: "/admin/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    permission: "view_dashboard",
  },
  {
    to: "/admin/projects",
    icon: Building2,
    label: "Projects",
    permission: "view_projects",
  },
  {
    to: "/admin/products",
    icon: Package,
    label: "Products",
    permission: "view_products",
  },
  {
    to: "/admin/orders",
    icon: ShoppingCart,
    label: "Orders",
    permission: "manage_orders",
  },
  {
    to: "/admin/contracts",
    icon: FileText,
    label: "Contracts",
    permission: "view_contracts",
  },
  {
    to: "/admin/customers",
    icon: Users,
    label: "Customers",
    permission: "view_customers",
  },
  {
    to: "/admin/messages",
    icon: MessageSquare,
    label: "Messages",
    permission: "view_messages",
  },
  {
    to: "/admin/customer-uploads",
    icon: Image,
    label: "Customer Uploads",
    permission: "view_customer_uploads",
  },
  {
    to: "/admin/personnel",
    icon: User,
    label: "Manage Personnel",
    permission: "manage_users",
  },
  {
    to: "/admin/reports",
    icon: BarChart3,
    label: "Reports",
    permission: "view_reports",
  },
  {
    to: "/admin/records",
    icon: Upload,
    label: "Records Upload",
    permission: "manage_records", // ✨ Use the dedicated permission
  },
  {
    to: "/admin/activity",
    icon: Activity,
    label: "Activity Log",
    permission: "view_activity_logs",
  },
  {
    to: "/admin/settings",
    icon: Settings,
    label: "Settings",
    permission: "manage_settings",
  },
];

const AdminLayout: React.FC = () => {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // ✨ MODIFIED: This now uses the imported `hasUserPermission` function
  const filteredNavItems = user
    ? navItems.filter((item) => hasUserPermission(user.role, item.permission))
    : [];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar
        navItems={navItems}
        filteredNavItems={filteredNavItems}
        user={user}
        logout={logout}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AdminHeader navItems={navItems} />
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="h-full px-4 sm:px-6 md:px-8 py-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
