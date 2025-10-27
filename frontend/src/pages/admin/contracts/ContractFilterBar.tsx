// frontend/src/pages/admin/contracts/ContractFilterBar.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, List, LayoutGrid } from "lucide-react"; // Make sure List & LayoutGrid are imported

type ViewMode = "table" | "card";

interface ContractFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const ContractFilterBar: React.FC<ContractFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        {/* Main flex container */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Search Bar (flex-1) */}
          <div className="flex-1 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by Customer, Order ID, Product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters and Toggle Group */}
          <div className="flex gap-2 flex-wrap items-center">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={statusFilter === "Pending" ? "default" : "outline"}
              onClick={() => setStatusFilter("Pending")}
              size="sm"
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === "Completed" ? "default" : "outline"}
              onClick={() => setStatusFilter("Completed")}
              size="sm"
            >
              Completed
            </Button>
            <Button
              variant={statusFilter === "Cancelled" ? "default" : "outline"}
              onClick={() => setStatusFilter("Cancelled")}
              size="sm"
            >
              Cancelled
            </Button>

            {/* Vertical Separator */}
            <div className="border-l border-border h-6 mx-2 hidden sm:block"></div>

            {/* --- UPDATED: SINGLE TOGGLE BUTTON --- */}
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                onViewModeChange(viewMode === "table" ? "card" : "table")
              }
              title={
                viewMode === "table"
                  ? "Switch to Card View"
                  : "Switch to Table View"
              }
            >
              {viewMode === "table" ? (
                <LayoutGrid className="h-4 w-4" />
              ) : (
                <List className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractFilterBar;
