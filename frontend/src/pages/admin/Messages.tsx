
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Mail, Search, Eye, Archive, Trash2, MessageSquare, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'unread' | 'read' | 'archived';
  type: 'contact_form';
}

interface NewsletterSubscription {
  id: string;
  email: string;
  timestamp: string;
  status: 'subscribed' | 'unsubscribed';
  type: 'newsletter';
  source: string;
}

const Messages = () => {
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [newsletters, setNewsletters] = useState<NewsletterSubscription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load data from localStorage
    const loadedMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    const loadedNewsletters = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
    
    setContactMessages(loadedMessages);
    setNewsletters(loadedNewsletters);
  }, []);

  const updateContactMessages = (updatedMessages: ContactMessage[]) => {
    setContactMessages(updatedMessages);
    localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
  };

  const markAsRead = (messageId: string) => {
    const updatedMessages = contactMessages.map(msg =>
      msg.id === messageId ? { ...msg, status: 'read' as const } : msg
    );
    updateContactMessages(updatedMessages);
  };

  const archiveMessage = (messageId: string) => {
    const updatedMessages = contactMessages.map(msg =>
      msg.id === messageId ? { ...msg, status: 'archived' as const } : msg
    );
    updateContactMessages(updatedMessages);
    toast({
      title: "Message Archived",
      description: "The message has been moved to archives.",
    });
  };

  const deleteMessage = (messageId: string) => {
    const updatedMessages = contactMessages.filter(msg => msg.id !== messageId);
    updateContactMessages(updatedMessages);
    setSelectedMessage(null);
    toast({
      title: "Message Deleted",
      description: "The message has been permanently deleted.",
    });
  };

  const filteredMessages = contactMessages.filter(msg =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNewsletters = newsletters.filter(sub =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = contactMessages.filter(msg => msg.status === 'unread').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Messages & Communications</h1>
          <p className="text-gray-600">Manage customer inquiries and newsletter subscriptions</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {unreadCount} Unread
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search messages or emails..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="contact-messages" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contact-messages" className="flex items-center gap-2">
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
              <Card>
                <CardHeader>
                  <CardTitle>Contact Form Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredMessages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No messages found</p>
                      </div>
                    ) : (
                      filteredMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                            selectedMessage?.id === message.id ? 'border-blue-500 bg-blue-50' : ''
                          }`}
                          onClick={() => {
                            setSelectedMessage(message);
                            if (message.status === 'unread') {
                              markAsRead(message.id);
                            }
                          }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold">{message.name}</h4>
                              <p className="text-sm text-gray-600">{message.email}</p>
                            </div>
                            <Badge className={getStatusColor(message.status)} variant="secondary">
                              {message.status}
                            </Badge>
                          </div>
                          <p className="font-medium text-sm mb-1">Subject: {message.subject}</p>
                          <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{formatDate(message.timestamp)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Message Detail */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Message Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedMessage ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-lg">{selectedMessage.name}</h4>
                        <p className="text-gray-600">{selectedMessage.email}</p>
                        <Badge className={getStatusColor(selectedMessage.status)} variant="secondary">
                          {selectedMessage.status}
                        </Badge>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-1">Subject</h5>
                        <p className="text-sm bg-gray-50 p-2 rounded">{selectedMessage.subject}</p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-1">Message</h5>
                        <p className="text-sm bg-gray-50 p-3 rounded whitespace-pre-wrap">{selectedMessage.message}</p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-1">Received</h5>
                        <p className="text-sm text-gray-600">{formatDate(selectedMessage.timestamp)}</p>
                      </div>

                      <div className="flex flex-col gap-2 pt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => archiveMessage(selectedMessage.id)}
                          className="flex items-center gap-2"
                        >
                          <Archive className="h-4 w-4" />
                          Archive
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteMessage(selectedMessage.id)}
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a message to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="newsletters">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Newsletter Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Subscribed Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNewsletters.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        No newsletter subscriptions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredNewsletters.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell className="font-medium">{subscription.email}</TableCell>
                        <TableCell className="capitalize">{subscription.source}</TableCell>
                        <TableCell>{formatDate(subscription.timestamp)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(subscription.status)} variant="secondary">
                            {subscription.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messages;
