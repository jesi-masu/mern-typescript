import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle } from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../ui/use-toast";
import { fetchProducts } from "../../../services/productService";
import { Product } from "../../../types/product";

// Component Imports
import { CartSummaryCard } from "./shopping-tab-components/CartSummaryCard";
import { CartItemsList } from "./shopping-tab-components/CartItemsList";
import { ProductFilters } from "./shopping-tab-components/ProductFilters";
import { ProductList } from "./shopping-tab-components/ProductList";
import { CheckoutSummary } from "./shopping-tab-components/CheckoutSummary";

const CustomerShoppingTab = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    items: cartItems,
    addToCart,
    getTotalItems,
    getTotalPrice,
    updateQuantity,
    removeItems,
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

  const getCartQuantity = (productId: string) =>
    cartItems.find((item) => item.id === productId)?.quantity || 0;

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
      id: product._id,
      name: product.productName,
      price: product.productPrice,
      image:
        product.image ||
        "https://placehold.co/400x300/E2E8F0/4A5568?text=No+Image",
    });
    toast({
      title: "Item Added",
      description: `${product.productName} has been added to your cart.`,
    });
  };

  const handleItemSelect = (itemId: string, checked: boolean) => {
    const newSelectedItems = new Set(selectedItems);
    if (checked) newSelectedItems.add(itemId);
    else newSelectedItems.delete(itemId);
    setSelectedItems(newSelectedItems);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedItems(new Set(cartItems.map((item) => item.id)));
    else setSelectedItems(new Set());
  };

  const handleRemoveSelectedItems = () => {
    if (selectedItems.size === 0) return;
    const itemIdsToRemove = Array.from(selectedItems);
    removeItems(itemIdsToRemove);
    setSelectedItems(new Set());
  };

  const getSelectedItemsTotal = () =>
    cartItems
      .filter((item) => selectedItems.has(item.id))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  const getSelectedItemsCount = () =>
    cartItems
      .filter((item) => selectedItems.has(item.id))
      .reduce((total, item) => total + item.quantity, 0);

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
    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.has(item.id)
    );

    if (selectedCartItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select items to checkout.",
        variant: "destructive",
      });
      return;
    }
    navigate("/checkout", { state: { items: selectedCartItems } });
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
      selectedItems.has(item.id)
    );
    return (
      <CheckoutSummary
        selectedCartItems={selectedCartItems}
        onBackToCart={() => setShowCheckout(false)}
        onProceedToCheckout={handleProceedToCheckout}
        getSelectedItemsTotal={getSelectedItemsTotal}
      />
    );
  }

  return (
    <div className="space-y-6">
      <CartSummaryCard
        totalItems={getTotalItems()}
        totalPrice={getTotalPrice()}
      />
      <CartItemsList
        cartItems={cartItems}
        selectedItems={selectedItems}
        onItemSelect={handleItemSelect}
        onSelectAll={handleSelectAll}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckout}
        onRemoveSelected={handleRemoveSelectedItems}
        getSelectedItemsCount={getSelectedItemsCount}
        getSelectedItemsTotal={getSelectedItemsTotal}
      />
      <ProductFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />
      <ProductList
        products={filteredProducts}
        onAddToCart={handleAddToCart}
        getCartQuantity={getCartQuantity}
        onUpdateQuantity={updateQuantity}
      />
    </div>
  );
};

export default CustomerShoppingTab;
