import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product"; // Adjust this path if needed
import { Edit, Eye, Trash2 } from "lucide-react";

interface ProductViewProps {
  products: Product[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductViewProps> = ({
  products,
  onEdit,
  onView,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card
          key={product._id}
          className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
        >
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={product.image}
              alt={product.productName}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <CardContent className="p-4 flex flex-col flex-grow">
            <div className="space-y-2 flex-grow">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-lg leading-tight">
                  {product.productName}
                </h3>
                <span className="text-xs flex-shrink-0 mt-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                  {product.category}
                </span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 h-[40px]">
                {product.productShortDescription}
              </p>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-lg">
                  ₱{product.productPrice.toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  {/* ✏️ ADDED WRAPPER */}
                  <span className="text-sm text-gray-500">
                    {product.squareFeet} sq ft
                  </span>
                  {/* ✏️ ADD THIS BADGE */}
                  <span
                    className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                      product.stock > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock} in stock
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-4 mt-auto space-y-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onEdit(product._id)}
                >
                  <Edit className="h-3 w-3 mr-2" /> Edit
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={() => onView(product._id)}
                >
                  <Eye className="h-3 w-3 mr-2" /> View
                </Button>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => onDelete(product)}
              >
                <Trash2 className="h-3 w-3 mr-2" /> Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
