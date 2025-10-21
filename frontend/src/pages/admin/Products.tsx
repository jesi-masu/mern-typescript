import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

// ✨ 1. Fixed import paths (removed "products" folder)
import { ProductHeader } from "@/components/admin/ProductHeader";
import { ProductFilterBar } from "@/components/admin/ProductFilterBar";
import { ProductList } from "@/components/admin/ProductList";

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
      <ProductHeader productCount={products.length} />
      <hr className="border-t border-gray-200" />

      {/* ✨ 2. Fixed <ProductFilterBar /> props */}
      <ProductFilterBar
        searchQuery={searchQuery}
        categoryFilter={categoryFilter}
        viewMode={viewMode}
        uniqueCategories={uniqueCategories}
        onSearchChange={setSearchQuery}
        onCategoryChange={setCategoryFilter}
        onViewModeChange={setViewMode}
        productCount={products.length}
        filteredProductCount={filteredProducts.length}
      />

      {/* ✨ 3. Added the missing <ProductList /> component */}
      <ProductList
        viewMode={viewMode}
        filteredProducts={filteredProducts}
        onEdit={(id) => navigate(`/admin/products/edit/${id}`)}
        onView={(id) => navigate(`/admin/products/view/${id}`)}
        onDelete={handleOpenDeleteDialog}
      />

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
