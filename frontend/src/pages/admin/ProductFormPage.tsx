import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import {
  fetchProductById,
  createProduct,
  updateProduct,
} from "@/services/productService";
import ProductForm from "@/components/admin/ProductForm";

type ProductCreateUpdateData = Omit<Product, "_id" | "createdAt" | "updatedAt">;

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode && id) {
      const getProduct = async () => {
        try {
          setLoading(true);
          const data = await fetchProductById(id);
          setProduct(data);
        } catch (err: any) {
          setError(err.message || "Failed to fetch product details.");
          toast({
            title: "Error",
            description: "Could not fetch product data.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      getProduct();
    }
  }, [id, isEditMode, toast]);

  const handleSaveProduct = async (formData: ProductCreateUpdateData) => {
    try {
      if (isEditMode && id) {
        await updateProduct(id, formData);
        toast({
          title: "Success!",
          description: `"${formData.productName}" has been updated successfully.`,
        });
      } else {
        await createProduct(formData);
        toast({
          title: "Success!",
          description: `"${formData.productName}" has been created successfully.`,
        });
      }
      navigate("/admin/products");
    } catch (err: any) {
      toast({
        title: "Error",
        description: `Failed to save product: ${
          err.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/products");
  };

  if (loading) {
    return <div className="container py-12 text-center">Loading form...</div>;
  }

  if (error) {
    return (
      <div className="container py-12 text-center text-red-500">{error}</div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <ProductForm
        product={product}
        onSubmit={handleSaveProduct}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ProductFormPage;
