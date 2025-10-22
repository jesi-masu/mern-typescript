import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Search,
  Eye,
  Archive,
  Trash2,
  MessageSquare,
  Inbox,
  CheckCircle2,
  Clock,
  MailOpen,
  Reply,
  Loader2, // ✏️ Added for loading
  AlertCircle, // ✏️ Added for errors
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext"; // ✏️ IMPORT YOUR AUTH HOOK

// ✏️ UPDATED INTERFACE to match your Mongoose Model
interface ContactMessage {
  _id: string; // Changed from id
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string; // Changed from timestamp
  status: "unread" | "read" | "archived";
}

// ✏️ Removed NewsletterSubscription interface

const Messages = () => {
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [loading, setLoading] = useState(true); // ✏️ Added loading state
  const [error, setError] = useState<string | null>(null); // ✏️ Added error state
  const { toast } = useToast();
  const { token } = useAuth(); // ✏️ Get auth token

  // ✏️ REFACTORED to fetch data from API
  useEffect(() => {
    const fetchMessages = async () => {
      if (!token) return; // Don't fetch if token isn't ready

      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:4000/api/messages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch messages. Please log in again.");
        }
        const data: ContactMessage[] = await response.json();
        setContactMessages(data);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
        toast({
          title: "Error",
          description: err.message || "Could not fetch messages.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [token, toast]); // Re-run when the token is available

  // ✏️ REFACTORED to update status via API
  const handleUpdateStatus = async (
    messageId: string,
    status: "read" | "archived"
  ) => {
    // Optimistically update the UI
    setContactMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId ? { ...msg, status: status } : msg
      )
    );

    if (status === "archived") {
      toast({
        title: "Message Archived",
        description: "The message has been moved to archives.",
      });
    }

    try {
      await fetch(`http://localhost:4000/api/messages/${messageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      // No need to re-fetch, UI is already updated
    } catch (err) {
      // Revert UI on error
      setContactMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, status: "unread" } : msg
        )
      );
      toast({
        title: "Error",
        description: "Failed to update message status.",
        variant: "destructive",
      });
    }
  };

  // ✏️ REFACTORED to delete via API
  const handleDeleteMessage = async (messageId: string) => {
    // Optimistically update UI
    const originalMessages = [...contactMessages];
    setContactMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    setSelectedMessage(null);
    toast({
      title: "Message Deleted",
      description: "The message has been permanently deleted.",
    });

    try {
      await fetch(`http://localhost:4000/api/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      // Revert UI on error
      setContactMessages(originalMessages);
      toast({
        title: "Error",
        description: "Failed to delete message.",
        variant: "destructive",
      });
    }
  };

  // ✏️ IMPROVED search filter
  const filteredMessages = contactMessages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "bg-blue-100 text-blue-800"; // Changed to blue
      case "read":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = contactMessages.filter(
    (msg) => msg.status === "unread"
  ).length;
  const readCount = contactMessages.filter(
    (msg) => msg.status === "read"
  ).length;
  const archivedCount = contactMessages.filter(
    (msg) => msg.status === "archived"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Customer Messages
          </h1>
          <p className="text-slate-600 mt-1">
            Manage customer inquiries from your contact form
          </p>
        </div>
      </div>
      {/* Statistics Cards */}
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
        {/* ✏️ Removed Subscribers Card */}
      </div>
      {/* Search Bar */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              placeholder="Search by name, email, subject, or message content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-12 text-base border-slate-200 focus:border-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* ✏️ Removed Tabs component wrapper */}

      {/* Message List & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Contact Form Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 max-h-[700px] overflow-y-auto">
                {/* ✏️ ADDED LOADING AND ERROR STATES */}
                {loading && (
                  <div className="flex items-center justify-center p-16">
                    <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                  </div>
                )}

                {error && (
                  <div className="flex flex-col items-center justify-center p-16 text-red-600">
                    <AlertCircle className="h-10 w-10 mb-2" />
                    <p className="font-medium">{error}</p>
                  </div>
                )}

                {!loading && !error && filteredMessages.length === 0 && (
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

                {!loading &&
                  !error &&
                  filteredMessages.map((message) => (
                    <div
                      key={message._id} // ✏️ Changed to _id
                      className={`p-5 cursor-pointer transition-all hover:bg-slate-50 ${
                        selectedMessage?._id === message._id // ✏️ Changed to _id
                          ? "bg-blue-50 border-l-4 border-l-blue-600"
                          : "border-l-4 border-l-transparent"
                      } ${message.status === "unread" ? "bg-blue-50/30" : ""}`}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (message.status === "unread") {
                          handleUpdateStatus(message._id, "read"); // ✏️ Changed to _id and new fn
                        }
                      }}
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
        </div>

        {/* Message Detail */}
        <div>
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
                      onClick={() =>
                        handleUpdateStatus(selectedMessage._id, "archived")
                      }
                      // ✏️ Disable if already archived
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
                      onClick={() => handleDeleteMessage(selectedMessage._id)}
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
                  <p className="text-sm mt-1">
                    Click on a message to view details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Messages;
