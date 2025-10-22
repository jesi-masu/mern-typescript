// src/components/admin/messages/MessageStats.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Inbox, CheckCircle2, Archive } from "lucide-react";

interface MessageStatsProps {
  unreadCount: number;
  readCount: number;
  archivedCount: number;
}

export const MessageStats: React.FC<MessageStatsProps> = ({
  unreadCount,
  readCount,
  archivedCount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Unread Messages
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {unreadCount}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Inbox className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Read Messages
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {readCount}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-slate-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Archived</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {archivedCount}
              </p>
            </div>
            <div className="bg-slate-100 p-3 rounded-full">
              <Archive className="h-6 w-6 text-slate-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
