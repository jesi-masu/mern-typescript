
export type UserRole = 'admin' | 'personnel';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  category: 'orders' | 'products' | 'projects' | 'contracts' | 'users' | 'system';
}

export interface CustomerNotification {
  id: string;
  customerId: string;
  orderId: string;
  message: string;
  type: 'order_update' | 'payment_confirmed' | 'contract_ready' | 'delivery_scheduled';
  timestamp: string;
  read: boolean;
  fromPersonnel: string;
}

export interface AdminAuthContextType {
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
  activityLogs: ActivityLog[];
  customerNotifications: CustomerNotification[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  logActivity: (action: string, details: string, category: ActivityLog['category']) => void;
  hasPermission: (permission: string) => boolean;
  addCustomerNotification: (customerId: string, orderId: string, message: string, type: CustomerNotification['type']) => void;
  getCustomerNotifications: (customerId: string) => CustomerNotification[];
  markNotificationAsRead: (notificationId: string) => void;
}
