//frontend/src/pages/admin/Products.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Ensure Product type aligns with your backend's expected structure for API calls
import { Product } from "@/types/product";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/productService";
import { Plus, Edit, Eye, Trash2, X } from "lucide-react"; // Import X for close button
import { useToast } from "@/hooks/use-toast";

type ProductCreateUpdateData = Omit<Product, "_id" | "createdAt" | "updatedAt">;

import ProductForm from "@/components/admin/ProductForm"; // ProductFormData is inferred by ProductForm's onSubmit prop
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState<string>("All Categories");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(
    undefined
  );
  const [viewMode, setViewMode] = useState(false);
  const { toast } = useToast();

  const getProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data: Product[] = await fetchProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    // productPrice is already a number from your Product type, no need for parseFloat
    const matchesSearch =
      product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.productShortDescription?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (product.productLongDescription?.toLowerCase() || "").includes(
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

  const handleOpenAddProduct = () => {
    setCurrentProduct(undefined);
    setViewMode(false);
    setDialogOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setViewMode(false);
    setDialogOpen(true);
  };

  const handleOpenViewProduct = (product: Product) => {
    setCurrentProduct(product);
    setViewMode(true);
    setDialogOpen(true);
  };

  const handleOpenDeleteDialog = (product: Product) => {
    setCurrentProduct(product);
    setDeleteDialogOpen(true);
  };

  // --- CRUD Operations ---
  const handleSaveProduct = async (formData: ProductCreateUpdateData) => {
    try {
      const productToSave = formData; // No more manual mapping here!

      if (currentProduct) {
        // Update existing product
        await updateProduct(currentProduct._id, productToSave);
        toast({
          title: "Product updated",
          description: `"${productToSave.productName}" has been updated successfully.`,
        });
      } else {
        // Add new product
        await createProduct(productToSave); // No need for casting as Omit<Product, "_id">; ProductForm handles the Omit
        toast({
          title: "Product added",
          description: `"${productToSave.productName}" has been added successfully.`,
        });
      }
      setDialogOpen(false);
      await getProducts(); // Re-fetch products to update the UI with the latest data
    } catch (err: any) {
      toast({
        title: "Error",
        description: `Failed to save product: ${err.message || err.toString()}`,
        variant: "destructive",
      });
      console.error("Error saving product:", err);
    }
  };

  const handleDeleteProduct = async () => {
    if (!currentProduct) return;

    try {
      await deleteProduct(currentProduct._id);
      toast({
        title: "Product deleted",
        description: `"${currentProduct.productName}" has been deleted.`,
      });
      setDeleteDialogOpen(false);
      await getProducts();
    } catch (err: any) {
      toast({
        title: "Error",
        description: `Failed to delete product: ${
          err.message || err.toString()
        }`,
        variant: "destructive",
      });
      console.error("Error deleting product:", err);
    }
  };

  // --- Loading and Error States ---
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
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenAddProduct}>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            {viewMode ? (
              <div className="max-h-[80vh] overflow-y-auto px-1">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Product Details</h2>
                  {/* Close button for view mode dialog */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDialogOpen(false)}
                    className="rounded-full"
                  >
                    <X className="h-5 w-5" /> {/* Changed to an X icon */}
                  </Button>
                </div>

                {currentProduct && (
                  <div className="space-y-6">
                    <div className="aspect-video w-full overflow-hidden rounded-md">
                      <img
                        src={currentProduct.image}
                        alt={currentProduct.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">
                          {currentProduct.productName}
                        </h1>
                        <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {currentProduct.category}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold">
                          ${currentProduct.productPrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {currentProduct.squareFeet} sq ft
                        </span>
                      </div>

                      <div>
                        <h3 className="text-md font-semibold mb-2">
                          Short Description
                        </h3>
                        <p className="text-gray-700">
                          {currentProduct.productShortDescription}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-md font-semibold mb-2">
                          Long Description
                        </h3>
                        <p className="text-gray-700">
                          {currentProduct.productLongDescription}
                        </p>
                      </div>

                      {/* Display other fields if available in currentProduct */}
                      {currentProduct.threeDModelUrl && (
                        <div>
                          <h3 className="text-md font-semibold mb-2">
                            3D Model
                          </h3>
                          <a
                            href={currentProduct.threeDModelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View 3D Model
                          </a>
                        </div>
                      )}
                      {currentProduct.features &&
                        currentProduct.features.length > 0 && (
                          <div>
                            <h3 className="text-md font-semibold mb-2">
                              Features
                            </h3>
                            <ul className="list-disc list-inside text-gray-700">
                              {currentProduct.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      {currentProduct.specifications && (
                        <div>
                          <h3 className="text-md font-semibold mb-2">
                            Specifications
                          </h3>
                          <ul className="list-disc list-inside text-gray-700">
                            {Object.entries(currentProduct.specifications).map(
                              ([key, value]) =>
                                value && (
                                  <li key={key}>
                                    <strong>
                                      {key.charAt(0).toUpperCase() +
                                        key.slice(1)}
                                      :
                                    </strong>{" "}
                                    {value}
                                  </li>
                                )
                            )}
                          </ul>
                        </div>
                      )}
                      {currentProduct.inclusion &&
                        currentProduct.inclusion.length > 0 && (
                          <div>
                            <h3 className="text-md font-semibold mb-2">
                              Inclusion
                            </h3>
                            <ul className="list-disc list-inside text-gray-700">
                              {currentProduct.inclusion.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      {currentProduct.leadTime && (
                        <div>
                          <h3 className="text-md font-semibold mb-2">
                            Lead Time
                          </h3>
                          <p className="text-gray-700">
                            {currentProduct.leadTime}
                          </p>
                        </div>
                      )}

                      <div className="pt-4 flex justify-end">
                        <Button onClick={() => setDialogOpen(false)}>
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <ProductForm
                product={currentProduct}
                onSubmit={handleSaveProduct}
                onCancel={() => setDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card
            key={product._id} // Use _id from backend
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
                    onClick={() => handleOpenEditProduct(product)}
                  >
                    <Edit className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleOpenViewProduct(product)}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product "
              {currentProduct?.productName}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
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
