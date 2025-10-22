// src/components/admin/messages/MessageList.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  MessageSquare,
  Clock,
  MailOpen,
  Loader2,
  AlertCircle,
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

interface MessageListProps {
  messages: ContactMessage[];
  selectedMessageId: string | null;
  onMessageSelect: (message: ContactMessage) => void;
  loading: boolean;
  error: string | null;
  searchTerm: string; // Needed for the empty state message
  formatDate: (timestamp: string) => string;
  getStatusColor: (status: string) => string;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  selectedMessageId,
  onMessageSelect,
  loading,
  error,
  searchTerm,
  formatDate,
  getStatusColor,
}) => {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          Contact Form Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100 max-h-[700px] overflow-y-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center p-16">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center p-16 text-red-600">
              <AlertCircle className="h-10 w-10 mb-2" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && messages.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No messages found</p>
              <p className="text-sm text-slate-400 mt-1">
                {searchTerm
                  ? "Try adjusting your search"
                  : "New messages will appear here."}
              </p>
            </div>
          )}

          {/* Message Items */}
          {!loading &&
            !error &&
            messages.map((message) => (
              <div
                key={message._id}
                className={`p-5 cursor-pointer transition-all hover:bg-slate-50 ${
                  selectedMessageId === message._id
                    ? "bg-blue-50 border-l-4 border-l-blue-600"
                    : "border-l-4 border-l-transparent"
                } ${message.status === "unread" ? "bg-blue-50/30" : ""}`}
                onClick={() => onMessageSelect(message)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`p-2 rounded-full ${
                        message.status === "unread"
                          ? "bg-blue-100"
                          : "bg-slate-100"
                      }`}
                    >
                      {message.status === "unread" ? (
                        <Mail className="h-4 w-4 text-blue-600" />
                      ) : (
                        <MailOpen className="h-4 w-4 text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-semibold text-slate-900 ${
                          message.status === "unread" ? "font-bold" : ""
                        }`}
                      >
                        {message.name}
                      </h4>
                      <p className="text-sm text-slate-600 truncate">
                        {message.email}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`${getStatusColor(message.status)} ml-2`}
                    variant="secondary"
                  >
                    {message.status}
                  </Badge>
                </div>
                <div className="ml-11">
                  <p className="font-medium text-sm text-slate-900 mb-1">
                    {message.subject}
                  </p>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                    {message.message}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="h-3 w-3" />
                    {formatDate(message.createdAt)}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
