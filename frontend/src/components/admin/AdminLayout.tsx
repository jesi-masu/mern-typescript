
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  FileText,
  LogOut,
  Building2,
  Activity,
  Shield,
  User,
  Upload,
  Image,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { currentUser, logout, hasPermission } = useAdminAuth();
  const location = useLocation();

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', permission: 'view_dashboard' },
    { to: '/admin/projects', icon: Building2, label: 'Projects', permission: 'view_projects' },
    { to: '/admin/products', icon: Package, label: 'Products', permission: 'view_products' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Orders', permission: 'manage_orders' },
    { to: '/admin/contracts', icon: FileText, label: 'Contracts', permission: 'view_contracts' },
    { to: '/admin/customers', icon: Users, label: 'Customers', permission: 'view_customers' },
    { to: '/admin/messages', icon: MessageSquare, label: 'Messages', permission: 'view_customers' },
    { to: '/admin/customer-uploads', icon: Image, label: 'Customer Uploads', permission: 'view_customers' },
    { to: '/admin/personnel', icon: User, label: 'Manage Personnel', permission: 'manage_users' },
    { to: '/admin/reports', icon: BarChart3, label: 'Reports', permission: 'view_reports' },
    { to: '/admin/records', icon: Upload, label: 'Records Upload', permission: 'manage_settings' },
    { to: '/admin/activity', icon: Activity, label: 'Activity Log', permission: 'view_activity_logs' },
    { to: '/admin/settings', icon: Settings, label: 'Settings', permission: 'manage_settings' },
  ];

  // Filter navigation items based on user permissions
  const filteredNavItems = navItems.filter(item => hasPermission(item.permission));

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200';
  };

  const getRoleLabel = (role: string) => {
    return role === 'admin' ? 'ADMINISTRATOR' : 'PERSONNEL';
  };

  const handleLogout = () => {
    logout(); // This will handle the redirection to /admin/login
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Enhanced Sidebar - Always visible */}
      <div className="w-72 bg-white border-r border-gray-200 shadow-sm flex flex-col flex-shrink-0">
        {/* Header Section */}
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
          
          {currentUser && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{currentUser.name}</p>
                  <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge className={`${getRoleColor(currentUser.role)} text-xs font-medium border px-2 py-1`}>
                  {getRoleLabel(currentUser.role)}
                </Badge>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation Section */}
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
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className={`w-5 h-5 mr-3 transition-colors ${
                    location.pathname === item.to ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 h-10 font-medium text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-8 w-px bg-gray-200"></div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {filteredNavItems.find(item => location.pathname === item.to)?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {currentUser?.name?.charAt(0) || 'A'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="h-full px-8 py-6">
            <div className="max-w-7xl mx-auto">
              {children || <Outlet />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
