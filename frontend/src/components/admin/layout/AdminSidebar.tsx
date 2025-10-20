import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LogOut, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  permission: string;
}
interface AuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "personnel" | "client";
}

interface AdminSidebarProps {
  navItems: NavItem[];
  filteredNavItems: NavItem[];
  user: AuthUser | null;
  logout: () => void;
}

const getRoleColor = (role: string) => {
  return role === "admin"
    ? "bg-red-50 text-red-700 border-red-200"
    : "bg-blue-50 text-blue-700 border-blue-200";
};
const getRoleLabel = (role: string) => {
  return role === "admin" ? "ADMINISTRATOR" : "PERSONNEL";
};

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  navItems,
  filteredNavItems,
  user,
  logout,
}) => {
  const location = useLocation();

  return (
    <div className="w-72 bg-white border-r border-gray-200 shadow-sm flex flex-col flex-shrink-0 h-screen">
      <div className="px-6 py-8 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-sm text-gray-500">Management Console</p>
          </div>
        </div>
        {user && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{`${user.firstName} ${user.lastName}`}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Badge
                className={`${getRoleColor(
                  user.role
                )} text-xs font-medium border px-2 py-1`}
              >
                {getRoleLabel(user.role)}
              </Badge>
              <div
                title="Online"
                className="w-2 h-2 bg-green-400 rounded-full"
              ></div>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
            Navigation
          </p>
          <div className="space-y-1">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <item.icon
                  className={`w-5 h-5 mr-3 transition-colors ${
                    location.pathname.startsWith(item.to)
                      ? "text-blue-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 h-10 font-medium text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          onClick={logout}
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </Button>
      </div>
    </div>
  );
};
