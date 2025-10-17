import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Receipt, MapPin, Eye, Download, Filter } from "lucide-react";
import { Upload } from "@/pages/admin/CustomerUploads"; // We will export this type from the main file

interface UploadCardProps {
  upload: Upload;
}

const UploadCard: React.FC<UploadCardProps> = ({ upload }) => {
  const getUploadIcon = (type: string) =>
    type === "payment_receipt" ? (
      <Receipt className="h-4 w-4" />
    ) : (
      <MapPin className="h-4 w-4" />
    );
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "reviewed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                {getUploadIcon(upload.type)}
                <span className="font-semibold text-gray-900 truncate max-w-[200px]">
                  {upload.fileName}
                </span>
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
                <p className="text-sm text-gray-600">
                  #{upload.orderId.slice(-6)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Upload Date</p>
                <p className="text-sm text-gray-600">
                  {formatDate(upload.uploadDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Filter className="h-3 w-3" />
                {upload.type.replace("_", " ").toUpperCase()}
              </span>
              {upload.size && <span>Size: {upload.size}</span>}
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
                    {upload.type === "payment_receipt"
                      ? "Payment Receipt Preview"
                      : "Location Image Preview"}
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <img
                    src={upload.fileUrl}
                    alt={upload.fileName}
                    className="max-w-full max-h-[70vh] mx-auto rounded-md"
                  />
                </div>
              </DialogContent>
            </Dialog>
            <a
              href={upload.fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadCard;
