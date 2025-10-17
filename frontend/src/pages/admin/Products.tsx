import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Plus,
  Edit,
  Eye,
  Trash2,
  LayoutGrid,
  List,
  Filter,
  Search,
  Package, // Added for "No products" view
} from "lucide-react";

// --- Props interface for both Grid and Table views ---
interface ProductViewProps {
  products: Product[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (product: Product) => void;
}

// --- ProductGrid Component ---
const ProductGrid: React.FC<ProductViewProps> = ({
  products,
  onEdit,
  onView,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                <span className="text-sm text-gray-500">
                  {product.squareFeet} sq ft
                </span>
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

// --- ProductTable Component ---
const ProductTable: React.FC<ProductViewProps> = ({
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

// --- Main Products Page Component (Refactored) ---
const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
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
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = [
    ...Array.from(new Set(products.map((product) => product.category))),
  ];

  // --- Render Logic ---
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
        <p>Please try refreshing the page or contact support.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-4 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* This part stays on the left */}
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Product Catalog
          </h2>
          <p className="text-gray-600 mt-1">
            Browse, filter, and manage all your prefab products.
          </p>
        </div>

        {/* ✨ New wrapper div to group the items on the right ✨ */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <Package className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-semibold text-gray-800">
              {products.length}
            </span>
            <span className="text-gray-500">Total Products</span>
          </div>

          <Button onClick={() => navigate("/admin/products/new")}>
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </div>
      </div>

      <hr className="border-t border-gray-200" />

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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-2 rounded-lg border border-gray-300 w-full"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
                  setViewMode(viewMode === "grid" ? "table" : "grid")
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
          Showing <strong>{filteredProducts.length}</strong> of{" "}
          <strong>{products.length}</strong> total products.
        </div>
      </Card>

      <div>
        {filteredProducts.length > 0 ? (
          viewMode === "grid" ? (
            <ProductGrid
              products={filteredProducts}
              onEdit={(id) => navigate(`/admin/products/edit/${id}`)}
              onView={(id) => navigate(`/admin/products/view/${id}`)}
              onDelete={handleOpenDeleteDialog}
            />
          ) : (
            <ProductTable
              products={filteredProducts}
              onEdit={(id) => navigate(`/admin/products/edit/${id}`)}
              onView={(id) => navigate(`/admin/products/view/${id}`)}
              onDelete={handleOpenDeleteDialog}
            />
          )
        ) : (
          <Card className="text-center p-12 shadow-lg rounded-xl">
            <Package className="h-16 w-16 text-gray-400 mb-6 mx-auto" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              No Products Found
            </h3>
            <p className="text-gray-600">
              No products match your current filters. Try a different search.
            </p>
          </Card>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
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
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
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
