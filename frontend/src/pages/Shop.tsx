// frontend/src/pages/Shop.tsx
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ShopFilters from "@/components/shop/ShopFilters";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopPagination from "@/components/shop/ShopPagination";
import { Product } from "@/types/product";
import { fetchProducts } from "@/services/productService";
import { Package } from "lucide-react";

const Shop = () => {
  // State for fetched products
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // New min and max prices for the slider
  const initialMinPrice = 50000;
  const initialMaxPrice = 2000000;

  // Existing filter states
  const [priceRange, setPriceRange] = useState([
    initialMinPrice,
    initialMaxPrice,
  ]); // Initialize with new min/max
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // State to hold unique categories fetched from products
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // --- useEffect for data fetching ---
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data: Product[] = await fetchProducts();
        setProducts(data);

        const uniqueCategories = Array.from(
          new Set(data.map((p) => p.category))
        );
        setAvailableCategories(uniqueCategories);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  // Filtered Products logic (adjusting property names)
  const filteredProducts = products.filter((product) => {
    // Ensure productPrice is treated as a number for filtering
    const productPrice =
      typeof product.productPrice === "string"
        ? parseFloat(product.productPrice)
        : product.productPrice;

    // Filter by price range
    const inPriceRange =
      productPrice >= priceRange[0] && productPrice <= priceRange[1];

    // Filter by search query - search in productName, productShortDescription, productLongDescription
    const matchesSearch =
      product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.productShortDescription?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (product.productLongDescription?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      );

    // Filter by selected categories
    const inSelectedCategories =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    return inPriceRange && matchesSearch && inSelectedCategories;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when filters change (existing)
  const handleFiltersChange = () => {
    setCurrentPage(1);
  };

  // --- Loading and Error States for the Shop Page ---
  if (loading) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Products...</h1>
          <p>Please wait while we load the available modules.</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Products</h1>
          <p className="mb-6 text-red-500">{error}</p>
          <p>
            Please try refreshing the page or contact support if the issue
            persists.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="relative bg-gradient-to-r from-blue-800 via-blue-500 to-blue-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
              <Package className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide">
                PREMIUM COLLECTION
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Prefabricated Modules
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Discover our curated selection of high-quality prefabricated
              building modules, meticulously engineered for residential,
              commercial, and industrial excellence.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar filters */}
            <ShopFilters
              priceRange={priceRange}
              setPriceRange={(value) => {
                setPriceRange(value);
                handleFiltersChange();
              }}
              searchQuery={searchQuery}
              setSearchQuery={(value) => {
                setSearchQuery(value);
                handleFiltersChange();
              }}
              selectedCategories={selectedCategories}
              setSelectedCategories={(value) => {
                setSelectedCategories(value);
                handleFiltersChange();
              }}
              categories={availableCategories}
            />

            {/* Product grid */}
            <div className="lg:col-span-3">
              <ProductGrid products={currentProducts} />

              {/* Only show pagination if there are more products than productsPerPage */}
              {filteredProducts.length > productsPerPage && (
                <div className="mt-8">
                  <ShopPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
