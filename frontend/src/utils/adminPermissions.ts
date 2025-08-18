
import { UserRole } from '@/types/admin';

// Role permissions - Updated to include new permissions
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    'view_dashboard',
    'manage_products',
    'view_products',
    'manage_projects',
    'view_projects',
    'manage_orders',
    'manage_contracts',
    'view_contracts',
    'manage_customers',
    'view_customers',
    'view_reports',
    'manage_settings',
    'view_activity_logs',
    'manage_users'
  ],
  personnel: [
    'view_dashboard',
    'view_products',
    'view_projects',
    'manage_orders',
    'view_contracts',
    'view_customers',
    'view_reports'
  ]
};

export const hasUserPermission = (userRole: UserRole, permission: string): boolean => {
  return ROLE_PERMISSIONS[userRole].includes(permission);
};
