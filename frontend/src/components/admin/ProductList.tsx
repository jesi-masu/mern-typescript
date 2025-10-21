//frontend/src/components/admin/ProductList
import React from "react";
import { Card } from "@/components/ui/card";
import { Product } from "@/types/product"; // Adjust path as needed
import { ProductGrid } from "./ProductGrid";
import { ProductTable } from "./ProductTable";
import { Package } from "lucide-react";

interface ProductListProps {
  viewMode: "grid" | "table";
  filteredProducts: Product[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  viewMode,
  filteredProducts,
  onEdit,
  onView,
  onDelete,
}) => {
  if (filteredProducts.length === 0) {
    return (
      <Card className="text-center p-12 shadow-lg rounded-xl">
        <Package className="h-16 w-16 text-gray-400 mb-6 mx-auto" />
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
          No Products Found
        </h3>
        <p className="text-gray-600">
          No products match your current filters. Try a different search.
        </p>
      </Card>
    );
  }

  return viewMode === "grid" ? (
    <ProductGrid
      products={filteredProducts}
      onEdit={onEdit}
      onView={onView}
      onDelete={onDelete}
    />
  ) : (
    <ProductTable
      products={filteredProducts}
      onEdit={onEdit}
      onView={onView}
      onDelete={onDelete}
    />
  );
};
