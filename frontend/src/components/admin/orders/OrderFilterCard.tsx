import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Calendar as CalendarIcon,
} from "lucide-react";

// Define the props this component will need from its parent (Orders.tsx)
interface OrderFilterCardProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  paymentStatusFilter: string;
  setPaymentStatusFilter: (status: string) => void;
  viewMode: "card" | "table";
  setViewMode: (mode: "card" | "table") => void;
  filteredOrderCount: number;
  totalOrderCount: number;
}

const OrderFilterCard: React.FC<OrderFilterCardProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  paymentStatusFilter,
  setPaymentStatusFilter,
  viewMode,
  setViewMode,
  filteredOrderCount,
  totalOrderCount,
}) => {
  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
            <Filter className="h-6 w-6 text-blue-600" />
            Order Filters
          </CardTitle>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full md:w-auto">
            {/* --- Search Input --- */}
            <div className="relative flex-grow sm:flex-grow-0 sm:w-72">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-2 rounded-lg border border-gray-300 w-full"
              />
            </div>

            {/* --- Status Filter --- */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-52 rounded-lg border border-gray-300">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Order Statuses</SelectItem>
                <SelectItem value="Pending">
                  Pending{" "}
                  <span style={{ fontSize: "0.8em", color: "gray" }}>
                    <i>verification required</i>
                  </span>
                </SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="In Production">In Production</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* ✏️ 8. REPLACED Date Range Picker with Payment Status Filter */}
            <Select
              value={paymentStatusFilter}
              onValueChange={setPaymentStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-52 rounded-lg border border-gray-300">
                <SelectValue placeholder="Filter by payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="50% Complete Paid">
                  50% Complete Paid
                </SelectItem>
                <SelectItem value="90% Complete Paid">
                  90% Complete Paid
                </SelectItem>
                <SelectItem value="100% Complete Paid">
                  100% Complete Paid
                </SelectItem>
              </SelectContent>
            </Select>

            {/* --- View Mode Toggle --- */}
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setViewMode(viewMode === "card" ? "table" : "card")
              }
            >
              {viewMode === "card" ? (
                <List className="h-5 w-5" />
              ) : (
                <LayoutGrid className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* --- Filter Results Count --- */}
      <div className="pb-4 px-5 text-sm text-muted-foreground">
        Showing <strong>{filteredOrderCount}</strong> of{" "}
        <strong>{totalOrderCount}</strong> total orders.
      </div>
    </Card>
  );
};

export default OrderFilterCard;
