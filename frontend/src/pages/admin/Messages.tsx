// src/pages/admin/Messages.tsx
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

// Import the new components
import { MessageStats } from "@/components/admin/messages/MessageStats";
import { MessageList } from "@/components/admin/messages/MessageList";
import { MessageDetail } from "@/components/admin/messages/MessageDetail";

// Define the interface once here
interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: "unread" | "read" | "archived";
}

const Messages = () => {
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { token } = useAuth();

  // --- Data Fetching ---
  useEffect(() => {
    const fetchMessages = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:4000/api/messages", {
          headers: { Authorization: `Bearer ${token}` },
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
  }, [token, toast]);

  // --- API Call Handlers ---
  const handleUpdateStatus = async (
    messageId: string,
    status: "read" | "archived"
  ) => {
    // Optimistic UI update
    const originalStatus =
      contactMessages.find((msg) => msg._id === messageId)?.status || "unread"; // Store original status for rollback
    setContactMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId ? { ...msg, status: status } : msg
      )
    );
    if (status === "archived") {
      toast({ title: "Message Archived" });
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
    } catch (err) {
      // Rollback UI on error
      setContactMessages((prev) =>
        prev.map(
          (msg) =>
            msg._id === messageId ? { ...msg, status: originalStatus } : msg // Use original status
        )
      );
      toast({
        title: "Error",
        description: "Failed to update message status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    const originalMessages = [...contactMessages];
    setContactMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    setSelectedMessage(null); // Deselect if deleted
    toast({ title: "Message Deleted" });

    try {
      await fetch(`http://localhost:4000/api/messages/${messageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      setContactMessages(originalMessages); // Rollback
      toast({
        title: "Error",
        description: "Failed to delete message.",
        variant: "destructive",
      });
    }
  };

  // --- Filtering & Calculations ---
  const filteredMessages = contactMessages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = contactMessages.filter(
    (msg) => msg.status === "unread"
  ).length;
  const readCount = contactMessages.filter(
    (msg) => msg.status === "read"
  ).length;
  const archivedCount = contactMessages.filter(
    (msg) => msg.status === "archived"
  ).length;

  // --- Helper Functions (can remain here or move to a utils file) ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "bg-blue-100 text-blue-800";
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

  // --- Handler for selecting a message in the list ---
  const handleMessageSelect = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === "unread") {
      handleUpdateStatus(message._id, "read");
    }
  };

  return (
    <div className="animate-fadeIn min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 space-y-6">
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

      {/* Render Message Stats */}
      <MessageStats
        unreadCount={unreadCount}
        readCount={readCount}
        archivedCount={archivedCount}
      />

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

      {/* Message List & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Render Message List */}
          <MessageList
            messages={filteredMessages}
            selectedMessageId={selectedMessage?._id || null}
            onMessageSelect={handleMessageSelect} // Pass the handler
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
          />
        </div>
        <div>
          {/* Render Message Detail */}
          <MessageDetail
            selectedMessage={selectedMessage}
            onArchive={() =>
              selectedMessage &&
              handleUpdateStatus(selectedMessage._id, "archived")
            }
            onDelete={() =>
              selectedMessage && handleDeleteMessage(selectedMessage._id)
            }
            formatDate={formatDate}
            getStatusColor={getStatusColor}
          />
        </div>
      </div>
    </div>
  );
};
export default Messages;
