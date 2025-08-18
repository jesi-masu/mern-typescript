
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Receipt, MapPin, Eye, Download, Search, Filter } from 'lucide-react';

interface Upload {
  id: string;
  orderId: string;
  customerName: string;
  type: 'payment_receipt' | 'location_image';
  fileName: string;
  uploadDate: string;
  size: string;
  status: 'pending' | 'reviewed' | 'approved';
}

// Mock data for customer uploads
const customerUploads: Upload[] = [
  {
    id: 'UP-001',
    orderId: 'ORD-001',
    customerName: 'John Doe',
    type: 'payment_receipt',
    fileName: 'payment_receipt_001.pdf',
    uploadDate: '2024-06-20T10:30:00Z',
    size: '2.3 MB',
    status: 'pending'
  },
  {
    id: 'UP-002',
    orderId: 'ORD-001',
    customerName: 'John Doe',
    type: 'location_image',
    fileName: 'installation_site.jpg',
    uploadDate: '2024-06-20T10:32:00Z',
    size: '4.1 MB',
    status: 'reviewed'
  },
  {
    id: 'UP-003',
    orderId: 'ORD-002',
    customerName: 'Jane Smith',
    type: 'payment_receipt',
    fileName: 'bank_transfer_receipt.png',
    uploadDate: '2024-06-18T15:00:00Z',
    size: '1.8 MB',
    status: 'approved'
  },
  {
    id: 'UP-004',
    orderId: 'ORD-003',
    customerName: 'Mike Johnson',
    type: 'location_image',
    fileName: 'project_location_aerial.jpg',
    uploadDate: '2024-06-19T14:15:00Z',
    size: '5.2 MB',
    status: 'pending'
  },
  {
    id: 'UP-005',
    orderId: 'ORD-004',
    customerName: 'Sarah Wilson',
    type: 'payment_receipt',
    fileName: 'credit_card_receipt.pdf',
    uploadDate: '2024-06-17T09:45:00Z',
    size: '1.5 MB',
    status: 'approved'
  }
];

const CustomerUploads: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const getUploadIcon = (type: string) => {
    return type === 'payment_receipt' ? <Receipt className="h-4 w-4" /> : <MapPin className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewFile = (upload: Upload) => {
    console.log('Viewing file:', upload.fileName);
  };

  const handleDownloadFile = (upload: Upload) => {
    console.log('Downloading file:', upload.fileName);
  };

  const filterUploads = (uploads: Upload[], type?: string) => {
    let filtered = uploads;
    
    if (type && type !== 'all') {
      filtered = filtered.filter(upload => upload.type === type);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(upload => 
        upload.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const paymentReceipts = filterUploads(customerUploads, 'payment_receipt');
  const locationImages = filterUploads(customerUploads, 'location_image');
  const allUploads = filterUploads(customerUploads);

  const renderUploadCard = (upload: Upload) => (
    <Card key={upload.id} className="mb-4 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                {getUploadIcon(upload.type)}
                <span className="font-semibold text-gray-900">{upload.fileName}</span>
              </div>
              <Badge className={`${getStatusColor(upload.status)} border`}>
                {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Customer</p>
                <p className="text-sm text-gray-600">{upload.customerName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Order ID</p>
                <p className="text-sm text-gray-600">{upload.orderId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Upload Date</p>
                <p className="text-sm text-gray-600">{formatDate(upload.uploadDate)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Filter className="h-3 w-3" />
                {upload.type.replace('_', ' ').toUpperCase()}
              </span>
              <span>Size: {upload.size}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 ml-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">
                    {upload.type === 'payment_receipt' ? 'Payment Receipt Preview' : 'Location Image Preview'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div className="space-y-2">
                      <p className="font-medium text-gray-700">Customer:</p>
                      <p className="text-gray-600">{upload.customerName}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-gray-700">Order ID:</p>
                      <p className="text-gray-600">{upload.orderId}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-gray-700">File Name:</p>
                      <p className="text-gray-600">{upload.fileName}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-gray-700">Upload Date:</p>
                      <p className="text-gray-600">{formatDate(upload.uploadDate)}</p>
                    </div>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center bg-gray-50">
                    {upload.type === 'payment_receipt' ? (
                      <div className="space-y-3">
                        <Receipt className="h-16 w-16 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-lg font-medium text-gray-700">Payment Receipt Preview</p>
                          <p className="text-sm text-gray-500 mt-1">
                            In a real implementation, the actual receipt would be displayed here
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <MapPin className="h-16 w-16 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-lg font-medium text-gray-700">Location Image Preview</p>
                          <p className="text-sm text-gray-500 mt-1">
                            In a real implementation, the actual location image would be displayed here
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" size="sm" onClick={() => handleDownloadFile(upload)} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Uploads</h1>
          <p className="text-gray-600">Review and manage payment receipts and location images submitted by customers</p>
        </div>

        {/* Search and Stats */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by customer, order ID, or filename..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Receipt className="h-4 w-4" />
                {paymentReceipts.length} Receipts
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {locationImages.length} Images
              </span>
            </div>
          </div>
        </div>

        {/* Categorized Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All Uploads ({allUploads.length})
            </TabsTrigger>
            <TabsTrigger value="payment_receipt" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Payment Receipts ({paymentReceipts.length})
            </TabsTrigger>
            <TabsTrigger value="location_image" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location Images ({locationImages.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {allUploads.length > 0 ? (
              allUploads.map(renderUploadCard)
            ) : (
              <Card className="p-12 text-center">
                <p className="text-gray-500">No uploads found matching your criteria.</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="payment_receipt" className="space-y-4">
            {paymentReceipts.length > 0 ? (
              paymentReceipts.map(renderUploadCard)
            ) : (
              <Card className="p-12 text-center">
                <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No payment receipts found matching your criteria.</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="location_image" className="space-y-4">
            {locationImages.length > 0 ? (
              locationImages.map(renderUploadCard)
            ) : (
              <Card className="p-12 text-center">
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No location images found matching your criteria.</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerUploads;
