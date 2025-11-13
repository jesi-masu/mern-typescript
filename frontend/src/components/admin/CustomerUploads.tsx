import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Receipt, MapPin, Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import UploadsFilter from "@/components/admin/uploads/UploadsFilter";
import UploadCard from "@/components/admin/uploads/UploadCard";

// Export the Upload interface so child components can use it
export interface Upload {
  id: string;
  orderId: string;
  customerName: string;
  type: "payment_receipt" | "location_image";
  fileUrl: string;
  fileName: string;
  uploadDate: string;
  size?: string;
  status: "pending" | "reviewed" | "approved";
}

const CustomerUploads: React.FC = () => {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { token, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (isAuthLoading) return;

    const fetchUploads = async () => {
      if (!token) {
        setError("Authentication token not found.");
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/uploads`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch customer uploads.");
        const data: Upload[] = await response.json();
        setUploads(data);
      } catch (err: any) {
        setError(err.message);
        toast.error("Error", { description: err.message });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUploads();
  }, [token, isAuthLoading]);

  const filteredUploads = useMemo(() => {
    return uploads.filter((upload) => {
      if (activeTab !== "all" && upload.type !== activeTab) return false;
      if (searchTerm) {
        const lowercasedSearch = searchTerm.toLowerCase();
        return (
          upload.customerName.toLowerCase().includes(lowercasedSearch) ||
          upload.orderId.toLowerCase().includes(lowercasedSearch) ||
          upload.fileName.toLowerCase().includes(lowercasedSearch)
        );
      }
      return true;
    });
  }, [uploads, activeTab, searchTerm]);

  const receiptCount = useMemo(
    () => uploads.filter((u) => u.type === "payment_receipt").length,
    [uploads]
  );
  const imageCount = useMemo(
    () => uploads.filter((u) => u.type === "location_image").length,
    [uploads]
  );

  if (isLoading || isAuthLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-64 w-full items-center justify-center bg-red-50 text-red-700 rounded-lg">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <h3 className="font-semibold">Failed to load uploads</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const renderContent = (items: Upload[], emptyMessage: string) => {
    if (items.length > 0) {
      return items.map((upload) => (
        <UploadCard key={upload.id} upload={upload} />
      ));
    }
    return <div className="text-center p-12 text-gray-500">{emptyMessage}</div>;
  };

  return (
    <div className="animate-fadeIn min-h-screen bg-gray-50 p-4 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Customer Uploads
          </h1>
          <p className="text-gray-600">
            Review and manage payment receipts and location images submitted by
            customers
          </p>
        </div>

        <UploadsFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          receiptCount={receiptCount}
          imageCount={imageCount}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All Uploads ({uploads.length})
            </TabsTrigger>
            <TabsTrigger
              value="payment_receipt"
              className="flex items-center gap-2"
            >
              <Receipt className="h-4 w-4" />
              Payment Receipts ({receiptCount})
            </TabsTrigger>
            <TabsTrigger
              value="location_image"
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Location Images ({imageCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {renderContent(filteredUploads, "No uploads found.")}
          </TabsContent>
          <TabsContent value="payment_receipt">
            {renderContent(filteredUploads, "No payment receipts found.")}
          </TabsContent>
          <TabsContent value="location_image">
            {renderContent(filteredUploads, "No location images found.")}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerUploads;
