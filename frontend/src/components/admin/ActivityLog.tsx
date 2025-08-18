import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { ActivityLog as ActivityLogType } from '@/types/admin';
import { Clock, User, Activity, Filter } from 'lucide-react';

const ActivityLog: React.FC = () => {
  const { activityLogs } = useAdminAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: ActivityLogType['category']) => {
    const colors = {
      orders: 'bg-blue-100 text-blue-800',
      products: 'bg-green-100 text-green-800',
      projects: 'bg-purple-100 text-purple-800',
      contracts: 'bg-orange-100 text-orange-800',
      users: 'bg-red-100 text-red-800',
      system: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.system;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Activity Log</h2>
          <p className="text-gray-600">Track all system activities and user actions</p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">{filteredLogs.length} activities</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Activities
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sm:w-64"
              />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
          <div className="space-y-3">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getCategoryColor(log.category)}>
                          {log.category}
                        </Badge>
                        <span className="font-medium text-gray-900">{log.action}</span>
                      </div>
                      <p className="text-gray-600 mb-2">{log.details}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {log.userName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(log.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No activities found</h3>
                <p className="text-gray-600">
                  {searchQuery || categoryFilter !== 'all' 
                    ? "No activities match your current filters." 
                    : "Activity logs will appear here as actions are performed."}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLog;
