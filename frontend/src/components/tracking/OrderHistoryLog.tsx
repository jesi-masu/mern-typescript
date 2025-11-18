import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/order";
import {
  List,
  CheckCircle,
  Clock,
  Truck,
  Package,
  Phone,
  XCircle,
} from "lucide-react";
import { format } from "date-fns"; // A more powerful date formatter

// Define the shape of a single update
type TrackingUpdate = {
  status: string;
  message: string;
  timestamp: string;
};

interface OrderHistoryLogProps {
  // We just pass the updates array
  updates: TrackingUpdate[] | undefined;
}

// Helper to format the timestamp
const formatTimestamp = (dateString: string) => {
  return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a");
};

// Helper to get a relevant icon
const getStatusIcon = (status: string) => {
  if (status.includes("Cancelled"))
    return <XCircle className="h-5 w-5 text-red-500" />;
  if (status.includes("Pending") || status.includes("Placed"))
    return <Phone className="h-5 w-5 text-yellow-500" />;
  if (status.includes("Processing") || status.includes("Production"))
    return <Clock className="h-5 w-5 text-blue-500" />;
  if (status.includes("Shipped"))
    return <Truck className="h-5 w-5 text-indigo-500" />;
  if (status.includes("Delivered") || status.includes("Completed"))
    return <CheckCircle className="h-5 w-5 text-green-500" />;

  return <Package className="h-5 w-5 text-gray-500" />;
};

export const OrderHistoryLog: React.FC<OrderHistoryLogProps> = ({
  updates,
}) => {
  if (!updates || updates.length === 0) {
    // Show a "pending" state if no updates exist yet
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Recent Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center h-24 gap-2">
            <Clock className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              No updates yet. Your order is pending verification.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort updates: newest first
  const sortedUpdates = [...updates].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5" />
          Recent Updates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedUpdates.map((update, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex flex-col items-center">
              {/* Icon */}
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                {getStatusIcon(update.status)}
              </div>
              {/* Vertical line (omit for last item) */}
              {index < sortedUpdates.length - 1 && (
                <div className="w-0.5 flex-1 bg-gray-200 my-1" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <p className="font-semibold text-sm text-gray-800">
                {update.message}
              </p>
              <p className="text-xs text-gray-500">
                {formatTimestamp(update.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
