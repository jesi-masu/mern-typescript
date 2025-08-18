// frontend/src/pages/ProductDetail.tsx
import { useState, useEffect } from "react"; // Import useEffect
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Box, Truck, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatPrice, usdToPhp } from "@/lib/formatters";

// Import the Product type and the service function
import { Product } from "@/types/product";
import { fetchProductById } from "@/services/productService";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>(); // 'id' from URL will be MongoDB's _id (string)
  const navigate = useNavigate();

  // State to store the fetched product, loading status, and error
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  // useEffect hook to fetch product data when the component mounts or ID changes
  useEffect(() => {
    const getProduct = async () => {
      if (!id) {
        setError("Product ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const fetchedProduct = await fetchProductById(id);
        setProduct(fetchedProduct);
        setActiveImage(0); // Reset active image when a new product is loaded
      } catch (err: any) {
        setError(err.message || "Failed to load product details.");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]); // Dependency array: re-run effect if 'id' changes

  // Handle loading state
  if (loading) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Product...</h1>
          <p>Fetching product details. Please wait.</p>
        </div>
      </Layout>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="mb-6 text-red-500">{error}</p>
          <Button onClick={() => navigate("/shop")}>Return to Shop</Button>
        </div>
      </Layout>
    );
  }

  // Handle case where product is not found after loading and no error occurred
  if (!product) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">
            The product you're looking for doesn't exist or could not be loaded.
          </p>
          <Button onClick={() => navigate("/shop")}>Return to Shop</Button>
        </div>
      </Layout>
    );
  }

  const handleBuyNow = () => {
    // Use product._id for navigation to checkout
    navigate(`/checkout/${product._id}`);
  };

  return (
    <Layout>
      <div className="container py-8">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => navigate("/shop")}
        >
          ← Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div>
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 h-80 md:h-96">
              <img
                src={
                  product.images && product.images.length > 0
                    ? product.images[activeImage]
                    : product.image // Fallback to single 'image' if 'images' array is empty or undefined
                }
                alt={product.productName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(product.images || []).map(
                (
                  image,
                  index // Safely iterate over images array
                ) => (
                  <button
                    key={index}
                    className={`h-20 rounded overflow-hidden border-2 ${
                      activeImage === index
                        ? "border-prefab-500"
                        : "border-transparent"
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.productName} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                )
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.productName}</h1>{" "}
            {/* Updated to productName */}
            <div className="flex items-center text-lg font-semibold text-prefab-600 mb-4">
              {formatPrice(product.productPrice)}{" "}
              {/* Updated to productPrice */}
            </div>
            <div className="mb-4">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                {product.category}
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                {product.squareFeet} sq ft
              </span>
            </div>
            <p className="text-gray-600 mb-6">
              {product.productLongDescription ||
                product.productShortDescription}{" "}
              {/* Use long, fallback to short */}
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="bg-prefab-50">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Box className="h-8 w-8 text-prefab-600 mb-2" />
                  <CardDescription className="text-prefab-800">
                    {product.squareFeet} sq ft
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-prefab-50">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Truck className="h-8 w-8 text-prefab-600 mb-2" />
                  <CardDescription className="text-prefab-800">
                    {product.leadTime}
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-prefab-50">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Package className="h-8 w-8 text-prefab-600 mb-2" />
                  <CardDescription className="text-prefab-800">
                    Complete Kit
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
            <div className="flex space-x-4 mt-6">
              <Button
                className="w-full bg-prefab-600 hover:bg-prefab-700 text-white"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    View 3D Model
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-full h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>{product.productName} - 3D Model</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                      Explore the 3D model of this product in detail
                    </DialogDescription>
                  </DialogHeader>
                  <div className="w-full h-full">
                    {product.threeDModelUrl ? (
                      <div className="sketchfab-embed-wrapper h-full">
                        <iframe
                          title={`${product.productName} 3D Model`}
                          className="w-full h-[60vh] rounded-lg"
                          frameBorder="0"
                          allowFullScreen={true}
                          allow="autoplay; fullscreen; xr-spatial-tracking"
                          src={product.threeDModelUrl}
                        ></iframe>
                      </div>
                    ) : (
                      <div className="text-center h-full flex items-center justify-center">
                        <p>No 3D model available for this product.</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="features">
            <TabsList className="w-full justify-start border-b mb-0 rounded-none">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="inclusion">What's Included</TabsTrigger>
              <TabsTrigger value="quote">Quotation</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="pt-6 px-1">
              <h3 className="text-xl font-medium mb-4">Key Features</h3>
              {product.features && product.features.length > 0 ? ( // Conditional check
                <ul className="list-disc ml-6 space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-gray-700">
                      {feature}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">
                  No features listed for this product.
                </p>
              )}
            </TabsContent>

            <TabsContent value="specifications" className="pt-6 px-1">
              <h3 className="text-xl font-medium mb-4">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {product.specifications &&
                Object.keys(product.specifications).length > 0 ? ( // Conditional check
                  Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="border-b pb-2">
                      <span className="font-medium capitalize">{key}: </span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">
                    No specifications listed for this product.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="inclusion" className="pt-6 px-1">
              <h3 className="text-xl font-medium mb-4">What's Included</h3>
              {product.inclusion && product.inclusion.length > 0 ? ( // Conditional check
                <ul className="list-disc ml-6 space-y-2">
                  {product.inclusion.map((item, index) => (
                    <li key={index} className="text-gray-700">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">
                  No inclusions listed for this product.
                </p>
              )}
            </TabsContent>

            <TabsContent value="quote" className="pt-6 px-1">
              <h3 className="text-xl font-medium mb-4">Quotation Breakdown</h3>
              <div className="bg-gray-50 rounded-lg p-6 border mb-6">
                <div className="space-y-3 mb-6">
                  {/* These values are calculated based on a percentage of the total price.
                      Ensure your backend product price is the total, or adjust calculation as needed. */}
                  <div className="flex justify-between">
                    <span>Base Structure</span>
                    <span className="font-medium">
                      {formatPrice(usdToPhp(product.productPrice * 0.6))}{" "}
                      {/* Updated to productPrice */}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interior Finishes</span>
                    <span className="font-medium">
                      {formatPrice(usdToPhp(product.productPrice * 0.25))}{" "}
                      {/* Updated to productPrice */}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Utilities & Systems</span>
                    <span className="font-medium">
                      {formatPrice(usdToPhp(product.productPrice * 0.15))}{" "}
                      {/* Updated to productPrice */}
                    </span>
                  </div>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold">
                  <span>Total Price</span>
                  <span>
                    {formatPrice(usdToPhp(product.productPrice))}
                  </span>{" "}
                  {/* Updated to productPrice */}
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  * This quotation is valid for 30 days and does not include
                  site preparation, foundation work, or shipping costs beyond
                  100 miles.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
