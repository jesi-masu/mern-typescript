// frontend/src/utils/adminPermissions.ts
import { UserRole } from "@/types/admin"; // Make sure this path is correct

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    "view_dashboard",
    "view_company_stats", // ✨ NEW: Only admin sees high-level stats
    "view_projects",
    "view_products",
    "manage_orders",
    "view_contracts",
    "view_customers",
    "manage_users",
    "view_reports", // ✨ Only admin sees reports
    "manage_settings",
    "view_activity_logs",
    "view_messages",
    "view_customer_uploads",
    "manage_records",
  ],
  personnel: [
    "view_dashboard", // Can see dashboard, but not all stats
    "view_projects",
    "view_products",
    "manage_orders",
    "view_contracts",
    "view_customers",
    "view_messages",
    "view_customer_uploads",
    // "view_reports" has been removed
    "manage_records",
  ],
};

export const hasUserPermission = (
  userRole: UserRole,
  permission: string
): boolean => {
  // Make sure the role exists before trying to access it
  if (!userRole || !ROLE_PERMISSIONS[userRole]) {
    return false;
  }
  return ROLE_PERMISSIONS[userRole].includes(permission);
};
