import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types/product";
import { fetchProductById } from "@/services/productService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Check, Copy, X } from "lucide-react";

const getSketchfabEmbedUrl = (url?: string): string | null => {
  if (!url || !url.includes("sketchfab.com")) return null;
  const match = url.match(/([a-f0-9]{32})/i);
  if (match && match[0]) {
    const modelUid = match[0];
    return `https://sketchfab.com/models/${modelUid}/embed`;
  }
  console.warn(
    "Could not extract a valid Sketchfab model ID from the URL:",
    url
  );
  return null;
};

const ProductViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

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

  const handleCopyId = () => {
    if (!product?._id) return;

    navigator.clipboard.writeText(product._id).then(() => {
      toast({
        title: "Copied!",
        description: "Product ID has been copied to your clipboard.",
      });
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset icon after 2 seconds
    });
  };

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

  const sketchfabEmbedUrl = getSketchfabEmbedUrl(product.threeDModelUrl);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {product.productName}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate(`/admin/products/edit/${product._id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Product
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/products")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
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
              <div className="mt-4 prose max-w-none text-foreground">
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
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {product.inclusion && product.inclusion.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  {product.inclusion.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {product.exclusion && product.exclusion.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>What's Not Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  {/* @ts-ignore */}
                  {product.exclusion.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <X className="h-4 w-4 text-red-600" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
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
              <div className="flex justify-between items-center">
                <span className="font-semibold text-muted-foreground">
                  Price
                </span>
                <span className="text-lg font-bold">
                  ₱{product.productPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-muted-foreground">
                  Category
                </span>
                <span className="text-sm px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                  {product.category}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-muted-foreground">
                  Square Feet
                </span>
                <span>{product.squareFeet} sq ft</span>
              </div>
              {product.leadTime && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-muted-foreground">
                    Lead Time
                  </span>
                  <span>{product.leadTime}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-semibold text-muted-foreground">
                  Product ID
                </span>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {product._id}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyId}
                    aria-label="Copy Product ID"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {product.specifications &&
            Object.values(product.specifications).some((v) => v) && (
              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {Object.entries(product.specifications).map(
                      ([key, value]) =>
                        value ? (
                          <li key={key} className="flex justify-between">
                            <strong className="capitalize text-muted-foreground">
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

          {sketchfabEmbedUrl && (
            <Card>
              <CardHeader>
                <CardTitle>3D Model Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full overflow-hidden rounded-md border">
                  <iframe
                    title={product.productName}
                    allowFullScreen
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    src={sketchfabEmbedUrl}
                    className="h-full w-full"
                  />
                </div>
                <a
                  href={product.threeDModelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm mt-2 block text-center"
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
