import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ShoppingCart,
  Plus,
  Minus,
  Search,
  Filter,
  CreditCard,
  Package,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { formatPriceFromUSD } from "@/lib/formatters";
import { fetchProducts } from "@/services/productService";
import { Product } from "@/types/product";

const CustomerShoppingTab = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    addToCart,
    items: cartItems,
    getTotalItems,
    getTotalPrice,
    updateQuantity,
  } = useCart();
  const { isAuthenticated } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showCheckout, setShowCheckout] = useState(false);

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const categories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts = products.filter((product) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      product.productName.toLowerCase().includes(searchLower) ||
      product.productShortDescription?.toLowerCase().includes(searchLower);
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return formatPriceFromUSD(price);
  };

  const getCartQuantity = (productId: string) => {
    return (
      cartItems.find((item) => item.productId === productId)?.quantity || 0
    );
  };

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    addToCart({
      productId: product._id,
      name: product.productName,
      price: product.productPrice,
      image:
        product.image ||
        "https://placehold.co/400x300/E2E8F0/4A5568?text=No+Image",
      quantity: 1,
    });
    toast({
      title: "Item Added",
      description: `${product.productName} has been added to your cart.`,
    });
  };

  const handleItemSelect = (productId: string, checked: boolean) => {
    const newSelectedItems = new Set(selectedItems);
    if (checked) newSelectedItems.add(productId);
    else newSelectedItems.delete(productId);
    setSelectedItems(newSelectedItems);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked)
      setSelectedItems(new Set(cartItems.map((item) => item.productId)));
    else setSelectedItems(new Set());
  };

  const getSelectedItemsTotal = () => {
    return cartItems
      .filter((item) => selectedItems.has(item.productId))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getSelectedItemsCount = () => {
    return cartItems
      .filter((item) => selectedItems.has(item.productId))
      .reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select items to checkout.",
        variant: "destructive",
      });
      return;
    }
    setShowCheckout(true);
  };

  const handleProceedToCheckout = () => {
    const firstSelectedItem = cartItems.find((item) =>
      selectedItems.has(item.productId)
    );
    if (firstSelectedItem) {
      navigate(`/checkout/${firstSelectedItem.productId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-red-50 text-red-700 rounded-lg p-4">
        <AlertCircle className="h-8 w-8 mb-2" />
        <h3 className="text-lg font-semibold">Failed to Load Products</h3>
        <p>
          There was an error fetching the product data. Please try again later.
        </p>
      </div>
    );
  }

  if (showCheckout) {
    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.has(item.productId)
    );
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Order Summary</h2>
          <Button variant="outline" onClick={() => setShowCheckout(false)}>
            Back to Cart
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Selected Items ({selectedCartItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedCartItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total: {formatPrice(getSelectedItemsTotal())}</span>
                <Button
                  onClick={handleProceedToCheckout}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold">Shopping Cart</h3>
                <p className="text-sm text-gray-600">{getTotalItems()} items</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                {formatPrice(getTotalPrice())}
              </p>
              <p className="text-sm text-gray-500">Total Amount</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {cartItems.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Cart Items ({cartItems.length})
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={
                      selectedItems.size === cartItems.length &&
                      cartItems.length > 0
                    }
                    onCheckedChange={(checked) =>
                      handleSelectAll(Boolean(checked))
                    }
                  />
                  <label htmlFor="select-all" className="text-sm font-medium">
                    Select All
                  </label>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={selectedItems.size === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Checkout ({getSelectedItemsCount()}) -{" "}
                  {formatPrice(getSelectedItemsTotal())}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <Checkbox
                  id={`item-${item.productId}`}
                  checked={selectedItems.has(item.productId)}
                  onCheckedChange={(checked) =>
                    handleItemSelect(item.productId, Boolean(checked))
                  }
                />
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    {formatPrice(item.price)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-medium w-8 text-center">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const quantityInCart = getCartQuantity(product._id);
          return (
            <Card
              key={product._id}
              className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              <Link to={`/product/${product._id}`} className="block">
                <div className="aspect-video relative">
                  <img
                    src={
                      product.image ||
                      "https://placehold.co/400x300/E2E8F0/4A5568?text=No+Image"
                    }
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-600">
                    {product.category}
                  </Badge>
                </div>
              </Link>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Link to={`/product/${product._id}`}>
                    <CardTitle className="text-lg hover:text-blue-600">
                      {product.productName}
                    </CardTitle>
                  </Link>
                  <p className="text-xl font-bold text-green-600">
                    {formatPrice(product.productPrice)}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex-grow flex flex-col">
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                  {product.productShortDescription}
                </p>
                <div className="flex items-center justify-center mt-auto">
                  {quantityInCart > 0 ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateQuantity(product._id, quantityInCart - 1)
                        }
                        className="h-9 w-9 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-bold text-lg w-10 text-center">
                        {quantityInCart}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateQuantity(product._id, quantityInCart + 1)
                        }
                        className="h-9 w-9 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 col-span-full">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerShoppingTab;
