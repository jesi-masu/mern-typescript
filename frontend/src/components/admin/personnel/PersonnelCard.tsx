
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Shield, User, Mail, Phone, Building, MapPin, Calendar, Briefcase, TrendingUp } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface PersonnelMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'personnel';
  position: string;
  status: 'active' | 'on_leave' | 'offline';
  operationalStatus: 'available' | 'busy' | 'away' | 'do_not_disturb';
  lastLogin: string;
  loginStatus: 'online' | 'offline';
  department: string;
  location: string;
  joinDate: string;
  lastActivity: string;
  projectsAssigned: number;
  completedTasks: number;
  efficiency: number;
  workingHours: string;
}

interface PersonnelCardProps {
  member: PersonnelMember;
  onUpdateStatus: (id: string, newStatus: 'active' | 'on_leave') => void;
}

const PersonnelCard: React.FC<PersonnelCardProps> = ({ member, onUpdateStatus }) => {
  const getRoleIcon = (role: string) => {
    return role === 'admin' ? Shield : User;
  };

  const getLoginStatusColor = (loginStatus: string) => {
    return loginStatus === 'online' 
      ? 'bg-green-400' 
      : 'bg-gray-400';
  };

  const getOperationalStatusColor = (operationalStatus: string) => {
    switch (operationalStatus) {
      case 'available':
        return 'bg-green-400';
      case 'busy':
        return 'bg-yellow-400';
      case 'away':
        return 'bg-orange-400';
      case 'do_not_disturb':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return 'text-emerald-600';
    if (efficiency >= 90) return 'text-blue-600';
    if (efficiency >= 85) return 'text-amber-600';
    return 'text-red-600';
  };

  const formatLastLogin = (lastLogin: string) => {
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const RoleIcon = getRoleIcon(member.role);

  return (
    <TableRow className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
      <TableCell className="py-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-sm">
              <RoleIcon className="w-6 h-6 text-white" />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getLoginStatusColor(member.loginStatus)} rounded-full border-2 border-white shadow-sm`}></div>
            <div className={`absolute -top-1 -right-1 w-3 h-3 ${getOperationalStatusColor(member.operationalStatus)} rounded-full border-2 border-white`}></div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 text-base">{member.name}</div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Mail className="w-3 h-3" />
              {member.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Phone className="w-3 h-3" />
              {member.phone}
            </div>
            <Badge variant="outline" className="text-xs mt-2 font-medium">
              {member.role.toUpperCase()}
            </Badge>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <div className="font-semibold text-gray-900 mb-1">{member.position}</div>
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <Building className="w-3 h-3" />
            {member.department}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-3 h-3" />
            {member.location}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <Calendar className="w-3 h-3" />
            Since {new Date(member.joinDate).toLocaleDateString()}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge 
          status={member.status}
          operationalStatus={member.operationalStatus}
          loginStatus={member.loginStatus}
        />
        <div className="text-xs text-gray-500 mt-2">
          Last login: {formatLastLogin(member.lastLogin)}
        </div>
        <div className="text-xs text-gray-500">
          Hours: {member.workingHours}
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <span className={`font-bold text-lg ${getEfficiencyColor(member.efficiency)}`}>
              {member.efficiency}%
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              {member.projectsAssigned} projects
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {member.completedTasks} tasks completed
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <div className="font-medium text-gray-900 mb-1">{member.lastActivity}</div>
          <div className="text-xs text-gray-500">Latest activity</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-2">
          {member.status === 'active' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateStatus(member.id, 'on_leave')}
              className="text-amber-600 border-amber-200 hover:bg-amber-50 font-medium"
            >
              Set Leave
            </Button>
          ) : member.status === 'on_leave' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateStatus(member.id, 'active')}
              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 font-medium"
            >
              Set Active
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:bg-blue-50 font-medium"
          >
            View Details
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default PersonnelCard;
