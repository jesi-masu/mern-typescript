import React from "react";
import { Input } from "@/components/ui/input";
import { Receipt, MapPin, Search } from "lucide-react";

interface UploadsFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  receiptCount: number;
  imageCount: number;
}

const UploadsFilter: React.FC<UploadsFilterProps> = ({
  searchTerm,
  setSearchTerm,
  receiptCount,
  imageCount,
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by customer, order ID, or filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Receipt className="h-4 w-4" />
            {receiptCount} Receipts
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {imageCount} Images
          </span>
        </div>
      </div>
    </div>
  );
};

export default UploadsFilter;
