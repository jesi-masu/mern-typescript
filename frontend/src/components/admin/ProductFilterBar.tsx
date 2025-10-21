//frontend/src/components/admin/ProductFilterBar
import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Filter, Search } from "lucide-react";

type ViewMode = "grid" | "table";

interface ProductFilterBarProps {
  searchQuery: string;
  categoryFilter: string;
  viewMode: ViewMode;
  uniqueCategories: string[];
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
  productCount: number;
  filteredProductCount: number;
}

export const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  searchQuery,
  categoryFilter,
  viewMode,
  uniqueCategories,
  onSearchChange,
  onCategoryChange,
  onViewModeChange,
  productCount,
  filteredProductCount,
}) => {
  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
            <Filter className="h-6 w-6 text-blue-600" />
            Filter Products
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 pr-4 py-2 rounded-lg border border-gray-300 w-full"
              />
            </div>
            <Select value={categoryFilter} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-full sm:w-52 rounded-lg border border-gray-300">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                onViewModeChange(viewMode === "grid" ? "table" : "grid")
              }
              className="rounded-lg border-gray-300"
            >
              {viewMode === "grid" ? (
                <List className="h-5 w-5" />
              ) : (
                <LayoutGrid className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <div className="pb-4 px-5 text-sm text-muted-foreground">
        Showing <strong>{filteredProductCount}</strong> of{" "}
        <strong>{productCount}</strong> total products.
      </div>
    </Card>
  );
};
