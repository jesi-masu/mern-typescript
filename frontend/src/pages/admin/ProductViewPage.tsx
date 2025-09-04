import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { fetchProductById } from "@/services/productService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";

const ProductViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const getProductDetails = async () => {
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
      getProductDetails();
    }
  }, [id, toast]);

  if (loading) {
    return (
      <div className="container py-12 text-center">
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center text-red-500">{error}</div>
    );
  }

  if (!product) {
    return (
      <div className="container py-12 text-center">Product not found.</div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/products")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <h1 className="text-3xl font-bold tracking-tight mt-2">
            {product.productName}
          </h1>
        </div>
        <Button onClick={() => navigate(`/admin/products/edit/${product._id}`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Product
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full overflow-hidden rounded-md mb-4">
                <img
                  src={product.image}
                  alt={product.productName}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-muted-foreground">
                {product.productShortDescription}
              </p>
              <div className="mt-4 prose max-w-none">
                <p>{product.productLongDescription}</p>
              </div>
            </CardContent>
          </Card>

          {product.features && product.features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold">Price</span>
                <span className="text-lg font-bold">
                  ₱{product.productPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Category</span>
                <span className="text-sm px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                  {product.category}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Square Feet</span>
                <span>{product.squareFeet} sq ft</span>
              </div>
              {product.leadTime && (
                <div className="flex justify-between">
                  <span className="font-semibold">Lead Time</span>
                  <span>{product.leadTime}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {product.specifications && (
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {Object.entries(product.specifications).map(([key, value]) =>
                    value ? (
                      <li key={key} className="flex justify-between">
                        <strong className="capitalize">
                          {key.replace(/([A-Z])/g, " $1")}:
                        </strong>
                        <span>{value}</span>
                      </li>
                    ) : null
                  )}
                </ul>
              </CardContent>
            </Card>
          )}

          {product.threeDModelUrl && (
            <Card>
              <CardHeader>
                <CardTitle>3D Model</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={product.threeDModelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View on Sketchfab
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductViewPage;
