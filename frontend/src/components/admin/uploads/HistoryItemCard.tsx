import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

// Define the shape of the record prop
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

// Helper functions for displaying status
const getStatusIcon = (status: UploadRecord["status"]) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "failed":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    case "processing":
      return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusColor = (status: UploadRecord["status"]) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "failed":
      return "bg-red-100 text-red-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

interface HistoryItemCardProps {
  record: UploadRecord;
}

export const HistoryItemCard: React.FC<HistoryItemCardProps> = ({ record }) => {
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
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
              <p className="font-medium">
                {record.recordCount.toLocaleString()}
              </p>
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
  );
};
