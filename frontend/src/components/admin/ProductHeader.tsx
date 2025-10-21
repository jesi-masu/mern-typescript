//frontend/src/components/admin/ProductHeader
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductHeaderProps {
  productCount: number;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  productCount,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Product Catalog
        </h2>
        <p className="text-gray-600 mt-1">
          Browse, filter, and manage all your prefab products.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <Package className="h-6 w-6 text-indigo-600" />
          <span className="text-xl font-semibold text-gray-800">
            {productCount}
          </span>
          <span className="text-gray-500">Total Products</span>
        </div>

        <Button onClick={() => navigate("/admin/products/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>
    </div>
  );
};
