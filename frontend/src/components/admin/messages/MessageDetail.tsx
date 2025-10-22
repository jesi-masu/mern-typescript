// src/components/admin/messages/MessageDetail.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Archive,
  Trash2,
  MessageSquare,
  Clock,
  Reply,
} from "lucide-react";

// Re-define or import the ContactMessage interface here
interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: "unread" | "read" | "archived";
}

interface MessageDetailProps {
  selectedMessage: ContactMessage | null;
  onArchive: (messageId: string) => void;
  onDelete: (messageId: string) => void;
  formatDate: (timestamp: string) => string;
  getStatusColor: (status: string) => string;
}

export const MessageDetail: React.FC<MessageDetailProps> = ({
  selectedMessage,
  onArchive,
  onDelete,
  formatDate,
  getStatusColor,
}) => {
  return (
    <Card className="shadow-lg border-0 sticky top-6">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Eye className="h-5 w-5 text-blue-600" />
          Message Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {selectedMessage ? (
          <div className="space-y-6">
            {/* Sender Info */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-slate-900">
                    {selectedMessage.name}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {selectedMessage.email}
                  </p>
                </div>
              </div>
              <Badge
                className={getStatusColor(selectedMessage.status)}
                variant="secondary"
              >
                {selectedMessage.status}
              </Badge>
            </div>
            {/* Subject */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Subject
              </label>
              <p className="text-sm bg-white border border-slate-200 p-3 rounded-lg mt-1 font-medium text-slate-900">
                {selectedMessage.subject}
              </p>
            </div>
            {/* Message */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Message
              </label>
              <div className="text-sm bg-white border border-slate-200 p-4 rounded-lg mt-1 whitespace-pre-wrap text-slate-700 leading-relaxed max-h-64 overflow-y-auto">
                {selectedMessage.message}
              </div>
            </div>
            {/* Timestamp */}
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Received:</span>
              <span>{formatDate(selectedMessage.createdAt)}</span>
            </div>
            {/* Actions */}
            <div className="space-y-2 pt-2">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`;
                }}
              >
                <Reply className="h-4 w-4 mr-2" />
                Reply via Email
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-300 hover:bg-slate-50"
                onClick={() => onArchive(selectedMessage._id)}
                disabled={selectedMessage.status === "archived"}
              >
                <Archive className="h-4 w-4 mr-2" />
                {selectedMessage.status === "archived"
                  ? "Archived"
                  : "Archive Message"}
              </Button>
              <Button
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                onClick={() => onDelete(selectedMessage._id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Message
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <Eye className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No message selected</p>
            <p className="text-sm mt-1">Click on a message to view details</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
