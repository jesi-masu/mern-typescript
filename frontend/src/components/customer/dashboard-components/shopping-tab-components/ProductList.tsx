import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Plus,
  Minus,
  Search,
  Eye,
  Home,
  Building2,
  Factory,
} from "lucide-react";
import { Product } from "@/types/product";

// --- A self-contained ProductCard component with the desired UI ---
const ProductCard: React.FC<{
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  formatPrice: (price: number) => string;
}> = ({
  product,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  formatPrice,
}) => {
  const navigate = useNavigate();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Residential":
        return <Home className="h-4 w-4" />;
      case "Commercial":
        return <Building2 className="h-4 w-4" />;
      case "Industrial":
        return <Factory className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />; // Fallback
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Residential":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "Commercial":
        return "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300";
      case "Industrial":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300";
    }
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
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            View Product
          </Button>
        </div>

        {/* --- [MOVED] Category Badge is now positioned over the image --- */}
        <Badge
          variant="outline"
          className={`absolute top-3 right-3 z-10 flex items-center gap-1.5 ${getCategoryColor(
            product.category
          )}`}
        >
          {getCategoryIcon(product.category)}
          <span className="text-xs font-medium">{product.category}</span>
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{product.productName}</CardTitle>
          <div className="text-right flex-shrink-0 pl-2">
            <span className="text-blue-600 font-semibold">
              {formatPrice(product.productPrice)}
            </span>
            {product.squareFeet && (
              <p className="text-xs text-muted-foreground">
                {product.squareFeet} sq ft
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-gray-600 text-sm line-clamp-3">
          {product.productShortDescription || "No description available"}
        </p>
      </CardContent>
      <CardFooter className="pt-2 mt-auto">
        <div className="w-full grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/product/${product._id}`)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
          {quantityInCart > 0 ? (
            <div className="flex items-center justify-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  onUpdateQuantity(product._id, quantityInCart - 1)
                }
                className="h-9 w-9"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold text-lg w-10 text-center">
                {quantityInCart}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  onUpdateQuantity(product._id, quantityInCart + 1)
                }
                className="h-9 w-9"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              onClick={() => onAddToCart(product)}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

// --- Main ProductList Component ---
interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  getCartQuantity: (productId: string) => number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(price);
};

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onAddToCart,
  getCartQuantity,
  onUpdateQuantity,
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 col-span-full">
        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-500">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          quantityInCart={getCartQuantity(product._id)}
          onAddToCart={onAddToCart}
          onUpdateQuantity={onUpdateQuantity}
          formatPrice={formatPrice}
        />
      ))}
    </div>
  );
};
