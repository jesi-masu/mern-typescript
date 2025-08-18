
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  X,
  Download,
  FileSpreadsheet,
  Database
} from 'lucide-react';

interface UploadRecord {
  id: string;
  fileName: string;
  recordType: string;
  uploadDate: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  recordCount: number;
  description?: string;
  errors?: string[];
}

const RecordsUpload: React.FC = () => {
  const { logActivity, hasPermission } = useAdminAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recordType, setRecordType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [uploadHistory, setUploadHistory] = useState<UploadRecord[]>([
    {
      id: 'UP-001',
      fileName: 'customer_data_2024.csv',
      recordType: 'customers',
      uploadDate: '2024-06-25T10:30:00Z',
      status: 'completed',
      recordCount: 150,
      description: 'Customer database migration from legacy system'
    },
    {
      id: 'UP-002',
      fileName: 'product_inventory.xlsx',
      recordType: 'products',
      uploadDate: '2024-06-24T14:15:00Z',
      status: 'failed',
      recordCount: 0,
      description: 'Product inventory update',
      errors: ['Invalid product category format', 'Missing required price field']
    }
  ]);

  const recordTypes = [
    { value: 'customers', label: 'Customer Records' },
    { value: 'orders', label: 'Order History' },
    { value: 'products', label: 'Product Catalog' },
    { value: 'contracts', label: 'Contract Documents' },
    { value: 'projects', label: 'Project Data' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['.csv', '.xlsx', '.xls', '.json'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        toast({
          title: "Invalid file type",
          description: "Please upload CSV, Excel, or JSON files only.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload files smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !recordType) {
      toast({
        title: "Missing information",
        description: "Please select a file and record type.",
        variant: "destructive",
      });
      return;
    }

    // Simulate upload process
    const newRecord: UploadRecord = {
      id: `UP-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      fileName: selectedFile.name,
      recordType,
      uploadDate: new Date().toISOString(),
      status: 'processing',
      recordCount: 0,
      description: description || undefined
    };

    setUploadHistory([newRecord, ...uploadHistory]);
    
    // Log the activity
    logActivity(
      "Records Upload", 
      `Started upload of ${selectedFile.name} (${recordType})`, 
      "system"
    );

    toast({
      title: "Upload started",
      description: `Processing ${selectedFile.name}...`,
    });

    // Simulate processing
    setTimeout(() => {
      const updatedRecord = {
        ...newRecord,
        status: 'completed' as const,
        recordCount: Math.floor(Math.random() * 200) + 50
      };

      setUploadHistory(prev => 
        prev.map(record => 
          record.id === newRecord.id ? updatedRecord : record
        )
      );

      toast({
        title: "Upload completed",
        description: `Successfully processed ${updatedRecord.recordCount} records.`,
      });

      logActivity(
        "Records Upload", 
        `Completed upload of ${selectedFile.name} - ${updatedRecord.recordCount} records processed`, 
        "system"
      );
    }, 3000);

    // Reset form
    setSelectedFile(null);
    setRecordType('');
    setDescription('');
  };

  const getStatusIcon = (status: UploadRecord['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: UploadRecord['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  if (!hasPermission('manage_settings')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don't have permission to upload records.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Records Upload</h2>
          <p className="text-gray-600">Import existing records into the system</p>
        </div>
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">{uploadHistory.length} uploads</span>
        </div>
      </div>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Records
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Select File
                </label>
                <div className="relative">
                  <Input
                    type="file"
                    accept=".csv,.xlsx,.xls,.json"
                    onChange={handleFileSelect}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {selectedFile && (
                  <div className="mt-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-700">{selectedFile.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Record Type
                </label>
                <Select value={recordType} onValueChange={setRecordType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    {recordTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Description (Optional)
                </label>
                <Textarea
                  placeholder="Add a description for this upload..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-500">
              Supported formats: CSV, Excel (.xlsx, .xls), JSON • Max size: 10MB
            </div>
            <Button onClick={handleUpload} disabled={!selectedFile || !recordType}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Records
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Upload History
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Log
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uploadHistory.length > 0 ? (
              uploadHistory.map((record) => (
                <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold">{record.fileName}</span>
                        <Badge className={getStatusColor(record.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(record.status)}
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </div>
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                        <div>
                          <p className="text-sm text-gray-500">Record Type</p>
                          <p className="font-medium capitalize">{record.recordType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Upload Date</p>
                          <p className="font-medium">{formatDate(record.uploadDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Records Processed</p>
                          <p className="font-medium">{record.recordCount.toLocaleString()}</p>
                        </div>
                      </div>
                      {record.description && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="text-sm">{record.description}</p>
                        </div>
                      )}
                      {record.errors && record.errors.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-red-600 font-medium mb-1">Errors:</p>
                          <ul className="text-sm text-red-600 space-y-1">
                            {record.errors.map((error, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                {error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No uploads yet</h3>
                <p className="text-gray-600">Upload history will appear here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecordsUpload;
