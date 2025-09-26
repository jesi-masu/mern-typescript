// frontend/src/components/shop/ProductCard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { formatPrice, usdToPhp } from "@/lib/formatters";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleBuyNow = (productId: string) => {
    navigate(`/product/${productId}`);
    toast("Redirecting to product detail page");
  };

  const handleViewDetails = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.productName,
      price: product.productPrice,
      image: product.image || "/placeholder-product-image.jpg",
    });
    toast.success("Product added to cart");
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 overflow-hidden relative group">
        <img
          src={product.image || "/placeholder-product-image.jpg"}
          alt={product.productName}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="default"
            className="bg-prefab-600 hover:bg-prefab-700 text-white"
            onClick={() => handleBuyNow(product._id)}
          >
            Buy Now
          </Button>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{product.productName}</CardTitle>
          <span className="text-prefab-600 text-lg font-semibold">
            {formatPrice(product.productPrice)}
          </span>
        </div>
        <div className="flex items-center mt-1">
          <span className="text-sm text-gray-500">
            {product.category}{" "}
            {product.squareFeet && `· ${product.squareFeet} sq ft`}
          </span>
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-gray-600 text-sm line-clamp-3">
          {product.productShortDescription ||
            product.productLongDescription ||
            "No description available"}
        </p>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => handleViewDetails(product._id)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Button>
          <Button
            className="bg-prefab-600 hover:bg-prefab-700 text-white flex items-center gap-2"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
