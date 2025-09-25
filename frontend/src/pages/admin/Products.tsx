import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/product";
import { fetchProducts, deleteProduct } from "@/services/productService";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Eye, Trash2, LayoutGrid, List } from "lucide-react";

// --- ProductTable Component ---
const ProductTable: React.FC<{
  products: Product[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (product: Product) => void;
}> = ({ products, onEdit, onView, onDelete }) => {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Size (sq ft)</TableHead>
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

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState<string>("All Categories");

  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  const getProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data: Product[] = await fetchProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleOpenDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete._id);
      toast({
        title: "Product deleted",
        description: `"${productToDelete.productName}" has been deleted.`,
      });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      await getProducts();
    } catch (err: any) {
      toast({
        title: "Error",
        description: `Failed to delete product: ${
          err.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.productShortDescription?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      );

    const matchesCategory =
      categoryFilter === "All Categories" ||
      product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = [
    "All Categories",
    ...Array.from(new Set(products.map((product) => product.category))),
  ];

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading Products...</h1>
        <p>Please wait while we load the available modules.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Products</h1>
        <p className="mb-6 text-red-500">{error}</p>
        <p>
          Please try refreshing the page or contact support if the issue
          persists.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground mt-1 text-gray-600">
            Manage all your prefab products
          </p>
        </div>
        <Button onClick={() => navigate("/admin/products/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search products..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="px-4 py-2 rounded-md border border-input"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {uniqueCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
        >
          {viewMode === "grid" ? (
            <List className="h-4 w-4" />
          ) : (
            <LayoutGrid className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing <strong>{filteredProducts.length}</strong> of{" "}
        <strong>{products.length}</strong> total products.
      </div>

      <div>
        {filteredProducts.length > 0 ? (
          viewMode === "grid" ? (
            // --- [FIXED] Corrected responsive grid classes ---
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product._id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">
                          {product.productName}
                        </h3>
                        <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {product.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {product.productShortDescription}
                      </p>
                      <div className="flex justify-between items-center pt-2">
                        <span className="font-bold">
                          ₱{product.productPrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {product.squareFeet} sq ft
                        </span>
                      </div>
                      <div className="flex pt-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            navigate(`/admin/products/edit/${product._id}`)
                          }
                        >
                          <Edit className="h-3 w-3 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            navigate(`/admin/products/view/${product._id}`)
                          }
                        >
                          <Eye className="h-3 w-3 mr-1" /> View
                        </Button>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => handleOpenDeleteDialog(product)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <ProductTable
              products={filteredProducts}
              onEdit={(id) => navigate(`/admin/products/edit/${id}`)}
              onView={(id) => navigate(`/admin/products/view/${id}`)}
              onDelete={handleOpenDeleteDialog}
            />
          )
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">No Products Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{productToDelete?.productName}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={handleDeleteProduct}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Products;
