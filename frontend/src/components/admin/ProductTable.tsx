//frontend/src/components/admin/ProductTable
import React from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product"; // Adjust this path if needed
import { Edit, Eye, Trash2 } from "lucide-react";

interface ProductViewProps {
  products: Product[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (product: Product) => void;
}

export const ProductTable: React.FC<ProductViewProps> = ({
  products,
  onEdit,
  onView,
  onDelete,
}) => {
  return (
    <Card className="shadow-lg rounded-xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Size (sq ft)</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                <img
                  src={product.image}
                  alt={product.productName}
                  className="h-12 w-16 object-cover rounded-md"
                />
              </TableCell>
              <TableCell className="font-medium">
                {product.productName}
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>₱{product.productPrice.toLocaleString()}</TableCell>
              <TableCell>{product.squareFeet}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(product._id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="default"
                    size="icon"
                    onClick={() => onView(product._id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(product)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
