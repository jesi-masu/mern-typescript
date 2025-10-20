import React from "react";
import { useLocation } from "react-router-dom";
import { AdminNotifications } from "./AdminNotifications";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
  to: string;
  label: string;
}

interface AdminHeaderProps {
  navItems: NavItem[];
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ navItems }) => {
  const location = useLocation();
  const { user } = useAuth();

  const currentPage = navItems.find((item) =>
    location.pathname.startsWith(item.to)
  );
  const pageTitle = currentPage?.label || "Admin Panel";

  const userInitials = user
    ? `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`
    : "A";

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex-shrink-0 h-20">
      <div className="flex items-center justify-between h-full">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <AdminNotifications />

          <div className="h-9 w-9 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-full flex items-center justify-center ring-2 ring-offset-2 ring-indigo-200">
            <span className="text-white text-sm font-medium uppercase">
              {userInitials}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
