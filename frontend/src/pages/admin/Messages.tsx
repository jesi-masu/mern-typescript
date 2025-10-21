import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Search,
  Eye,
  Archive,
  Trash2,
  MessageSquare,
  Users,
  Inbox,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  MailOpen,
  Reply,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: "unread" | "read" | "archived";
  type: "contact_form";
}

interface NewsletterSubscription {
  id: string;
  email: string;
  timestamp: string;
  status: "subscribed" | "unsubscribed";
  type: "newsletter";
  source: string;
}

const Messages = () => {
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [newsletters, setNewsletters] = useState<NewsletterSubscription[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const { toast } = useToast();

  useEffect(() => {
    // Load data from localStorage
    const loadedMessages = JSON.parse(
      localStorage.getItem("contactMessages") || "[]"
    );
    const loadedNewsletters = JSON.parse(
      localStorage.getItem("newsletterSubscriptions") || "[]"
    );

    setContactMessages(loadedMessages);
    setNewsletters(loadedNewsletters);
  }, []);

  const updateContactMessages = (updatedMessages: ContactMessage[]) => {
    setContactMessages(updatedMessages);
    localStorage.setItem("contactMessages", JSON.stringify(updatedMessages));
  };

  const markAsRead = (messageId: string) => {
    const updatedMessages = contactMessages.map((msg) =>
      msg.id === messageId ? { ...msg, status: "read" as const } : msg
    );
    updateContactMessages(updatedMessages);
  };

  const archiveMessage = (messageId: string) => {
    const updatedMessages = contactMessages.map((msg) =>
      msg.id === messageId ? { ...msg, status: "archived" as const } : msg
    );
    updateContactMessages(updatedMessages);
    toast({
      title: "Message Archived",
      description: "The message has been moved to archives.",
    });
  };

  const deleteMessage = (messageId: string) => {
    const updatedMessages = contactMessages.filter(
      (msg) => msg.id !== messageId
    );
    updateContactMessages(updatedMessages);
    setSelectedMessage(null);
    toast({
      title: "Message Deleted",
      description: "The message has been permanently deleted.",
    });
  };

  const filteredMessages = contactMessages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNewsletters = newsletters.filter((sub) =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "bg-red-100 text-red-800";
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
  const subscribedCount = newsletters.filter(
    (sub) => sub.status === "subscribed"
  ).length;

  const exportToCSV = () => {
    const csvContent = newsletters
      .map(
        (sub) =>
          `${sub.email},${sub.source},${formatDate(sub.timestamp)},${
            sub.status
          }`
      )
      .join("\n");

    const blob = new Blob([`Email,Source,Date,Status\n${csvContent}`], {
      type: "text/csv",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    sonnerToast.success("Newsletter list exported successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Messages & Communications
          </h1>
          <p className="text-slate-600 mt-1">
            Manage customer inquiries and newsletter subscriptions
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Subscribers
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {subscribedCount}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
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

      <Tabs defaultValue="contact-messages" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="contact-messages"
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Contact Messages ({contactMessages.length})
          </TabsTrigger>
          <TabsTrigger value="newsletters" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Newsletter Subscriptions ({newsletters.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contact-messages" className="space-y-4">
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
                    {filteredMessages.length === 0 ? (
                      <div className="text-center py-16 text-slate-500">
                        <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium">No messages found</p>
                        <p className="text-sm text-slate-400 mt-1">
                          Try adjusting your search
                        </p>
                      </div>
                    ) : (
                      filteredMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-5 cursor-pointer transition-all hover:bg-slate-50 ${
                            selectedMessage?.id === message.id
                              ? "bg-blue-50 border-l-4 border-l-blue-600"
                              : "border-l-4 border-l-transparent"
                          } ${
                            message.status === "unread" ? "bg-blue-50/30" : ""
                          }`}
                          onClick={() => {
                            setSelectedMessage(message);
                            if (message.status === "unread") {
                              markAsRead(message.id);
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
                                    message.status === "unread"
                                      ? "font-bold"
                                      : ""
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
                              className={`${getStatusColor(
                                message.status
                              )} ml-2`}
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
                              {formatDate(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
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
                        <span>{formatDate(selectedMessage.timestamp)}</span>
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
                          onClick={() => archiveMessage(selectedMessage.id)}
                        >
                          <Archive className="h-4 w-4 mr-2" />
                          Archive Message
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          onClick={() => deleteMessage(selectedMessage.id)}
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
        </TabsContent>

        <TabsContent value="newsletters">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-slate-50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Users className="h-5 w-5 text-purple-600" />
                  Newsletter Subscriptions
                </CardTitle>
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                  size="sm"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                  disabled={newsletters.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="font-semibold text-slate-700">
                        Email Address
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Source
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Subscribed Date
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNewsletters.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-16">
                          <Mail className="h-16 w-16 mx-auto mb-4 opacity-30 text-slate-400" />
                          <p className="text-lg font-medium text-slate-500">
                            No newsletter subscriptions found
                          </p>
                          <p className="text-sm text-slate-400 mt-1">
                            Subscribers will appear here once they sign up
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredNewsletters.map((subscription, index) => (
                        <TableRow
                          key={subscription.id}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                          }
                        >
                          <TableCell className="font-medium text-slate-900">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-purple-600" />
                              {subscription.email}
                            </div>
                          </TableCell>
                          <TableCell className="capitalize text-slate-700">
                            <Badge variant="outline" className="bg-white">
                              {subscription.source}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-600">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {formatDate(subscription.timestamp)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getStatusColor(
                                subscription.status
                              )}`}
                              variant="secondary"
                            >
                              {subscription.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messages;
