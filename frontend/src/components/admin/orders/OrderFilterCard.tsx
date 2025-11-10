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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils"; // Assumes you have a lib/utils.ts for shadcn
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

// Define the props this component will need from its parent (Orders.tsx)
interface OrderFilterCardProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
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
  dateRange,
  setDateRange,
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
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="In Production">In Production</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* --- NEW: Date Range Picker --- */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full sm:w-64 justify-start text-left font-normal rounded-lg border border-gray-300",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

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
