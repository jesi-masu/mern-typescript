import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ContractFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const ContractFilterBar: React.FC<ContractFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
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
          <div className="flex gap-2 flex-wrap">
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractFilterBar;
