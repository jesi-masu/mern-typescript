
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: 'active' | 'on_leave' | 'offline';
  operationalStatus: 'available' | 'busy' | 'away' | 'do_not_disturb';
  loginStatus: 'online' | 'offline';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, operationalStatus, loginStatus }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'on_leave':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'offline':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
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

  const getLoginStatusColor = (loginStatus: string) => {
    return loginStatus === 'online' 
      ? 'bg-green-400' 
      : 'bg-gray-400';
  };

  return (
    <div className="space-y-2">
      <Badge className={`${getStatusColor(status)} border font-medium`}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
      <div className="flex items-center gap-2 text-sm">
        <div className={`w-2 h-2 ${getOperationalStatusColor(operationalStatus)} rounded-full`}></div>
        <span className="font-medium text-gray-700 capitalize">
          {operationalStatus.replace('_', ' ')}
        </span>
      </div>
    </div>
  );
};

export default StatusBadge;
