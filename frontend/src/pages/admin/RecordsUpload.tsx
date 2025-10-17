import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UploadForm } from "@/components/admin/uploads/UploadForm";
import { ManualEntryForm } from "@/components/admin/uploads/ManualEntryForm";
import { HistoryItemCard } from "@/components/admin/uploads/HistoryItemCard";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Loader2, FileSpreadsheet } from "lucide-react";

interface UploadRecord {
  id: string;
  fileName: string;
  recordType: string;
  uploadDate: string;
  status: "pending" | "processing" | "completed" | "failed";
  recordCount: number;
  description?: string;
  errors?: string[];
}

const hasPermission = (userRole: string, permission: string): boolean => {
  return userRole === "admin";
};

const RecordsUpload: React.FC = () => {
  const { user, token, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadHistory, setUploadHistory] = useState<UploadRecord[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recordType, setRecordType] = useState<string>("orders");
  const [description, setDescription] = useState<string>("");

  const [validationResult, setValidationResult] = useState<{
    validRecordCount: number;
    totalRecords: number;
    errors: string[];
  } | null>(null);

  const recordTypes = [{ value: "orders", label: "Order History" }];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValidationResult(null);
    const file = event.target.files?.[0];
    if (file) {
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

  const handleFileUpload = async (isConfirmed: boolean = false) => {
    if (!selectedFile) return;
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    const endpoint = isConfirmed
      ? "/api/import/historical-orders"
      : "/api/import/validate-historical-orders";
    const newRecordId = `FILE-${Date.now()}`;

    if (isConfirmed) {
      const newRecord: UploadRecord = {
        id: newRecordId,
        fileName: selectedFile.name,
        recordType,
        uploadDate: new Date().toISOString(),
        status: "processing",
        recordCount: 0,
        description,
      };
      setUploadHistory((prev) => [newRecord, ...prev]);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      if (isConfirmed) {
        const updatedRecord: UploadRecord = {
          id: newRecordId,
          fileName: selectedFile.name,
          recordType,
          uploadDate: new Date().toISOString(),
          status: "completed",
          recordCount: result.importedCount || 0,
          description,
        };
        setUploadHistory((prev) =>
          prev.map((r) => (r.id === newRecordId ? updatedRecord : r))
        );
        toast({ title: "Import Successful", description: result.message });
        setValidationResult(null);
        setSelectedFile(null);
        setDescription("");
      } else {
        setValidationResult(result);
        toast({
          title: "Validation Complete",
          description: "Review the results before confirming the import.",
        });
      }
    } catch (error: any) {
      toast({
        title: isConfirmed ? "Import Failed" : "Validation Failed",
        description: error.message,
        variant: "destructive",
      });
      if (isConfirmed) {
        const updatedRecord: UploadRecord = {
          id: newRecordId,
          fileName: selectedFile.name,
          recordType,
          uploadDate: new Date().toISOString(),
          status: "failed",
          recordCount: 0,
          description,
          errors: [error.message],
        };
        setUploadHistory((prev) =>
          prev.map((r) => (r.id === newRecordId ? updatedRecord : r))
        );
      }
      setValidationResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualEntrySubmit = async (formData: any) => {
    setIsProcessing(true);

    const newRecord: UploadRecord = {
      id: `MANUAL-${Date.now()}`,
      fileName: "Manual Entry",
      recordType: "orders",
      uploadDate: new Date().toISOString(),
      status: "processing",
      recordCount: 0,
      description: `Manual entry for order on ${formData.createdAt}`,
    };

    setUploadHistory((prev) => [newRecord, ...prev]);

    try {
      const payload = {
        ...formData,
        products: formData.products.filter(
          (p: any) => p.productId.trim() !== ""
        ),
      };

      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/import/historical-order-manual`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      const updatedRecord = {
        ...newRecord,
        status: "completed" as const,
        recordCount: 1,
      };
      setUploadHistory((prev) =>
        prev.map((r) => (r.id === newRecord.id ? updatedRecord : r))
      );
      toast({
        title: "Success",
        description: "Historical order added successfully.",
      });
    } catch (error: any) {
      const updatedRecord = {
        ...newRecord,
        status: "failed" as const,
        errors: [error.message || "Failed to add order."],
      };
      setUploadHistory((prev) =>
        prev.map((r) => (r.id === newRecord.id ? updatedRecord : r))
      );
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !hasPermission(user.role, "manage_settings")) {
    return (
      <div className="text-center p-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Access Denied</h3>
        <p className="text-gray-600">
          You don't have permission to upload records.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Records Upload</h2>
        <p className="text-gray-600">
          Import historical and external data into the system.
        </p>
      </div>

      <Tabs defaultValue="file-upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file-upload">Bulk Upload via File</TabsTrigger>
          <TabsTrigger value="manual-entry">
            Manual Entry (Single Order)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file-upload">
          <UploadForm
            selectedFile={selectedFile}
            recordType={recordType}
            description={description}
            recordTypes={recordTypes}
            onFileSelect={handleFileSelect}
            onRecordTypeChange={setRecordType}
            onDescriptionChange={setDescription}
            onUpload={() => handleFileUpload(false)}
            onClearFile={() => setSelectedFile(null)}
            isUploading={isProcessing}
          />
          {validationResult && (
            <Card className="mt-6 bg-gray-50">
              <CardHeader>
                <CardTitle>Validation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Found <strong>{validationResult.validRecordCount}</strong>{" "}
                  valid records out of{" "}
                  <strong>{validationResult.totalRecords}</strong>.
                </p>
                {validationResult.errors.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-red-600">
                      Errors Found ({validationResult.errors.length}):
                    </h4>
                    <ul className="text-sm text-red-500 list-disc pl-5 max-h-40 overflow-y-auto bg-red-50 p-2 rounded-md">
                      {validationResult.errors.slice(0, 10).map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                      {validationResult.errors.length > 10 && (
                        <li>
                          ...and {validationResult.errors.length - 10} more.
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                <Button
                  className="mt-6"
                  onClick={() => handleFileUpload(true)}
                  disabled={
                    isProcessing || validationResult.validRecordCount === 0
                  }
                >
                  {isProcessing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Confirm and Import {validationResult.validRecordCount} Valid
                  Records
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="manual-entry">
          <ManualEntryForm
            onSubmit={handleManualEntrySubmit}
            isProcessing={isProcessing}
          />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Upload History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uploadHistory.length > 0 ? (
              uploadHistory.map((record) => (
                <HistoryItemCard key={record.id} record={record} />
              ))
            ) : (
              <div className="text-center py-12">
                <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No import history</h3>
                <p className="text-gray-600">
                  Your import history will appear here.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecordsUpload;
