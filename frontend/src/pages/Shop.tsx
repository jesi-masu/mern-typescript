// frontend/src/pages/Shop.tsx
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ShopFilters from "@/components/shop/ShopFilters";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopPagination from "@/components/shop/ShopPagination";
import { Product } from "@/types/product";
import { fetchProducts } from "@/services/productService";
import { Sparkles } from "lucide-react";
// No longer need 'Package', can be removed if not used elsewhere

const Shop = () => {
  // --- State from your Current Shop File (Preserved) ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const initialMinPrice = 5000;
  const initialMaxPrice = 2000000;
  const [priceRange, setPriceRange] = useState([
    initialMinPrice,
    initialMaxPrice,
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // --- New State for Animations from Test File ---
  const [scrollY, setScrollY] = useState(0);

  // --- Parallax Scroll Effect from Test File ---
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Your Data Fetching Logic (UNCHANGED) ---
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

  // --- Your Filtering Logic (UNCHANGED) ---
  const filteredProducts = products.filter((product) => {
    const productPrice =
      typeof product.productPrice === "string"
        ? parseFloat(product.productPrice)
        : product.productPrice;
    const inPriceRange =
      productPrice >= priceRange[0] && productPrice <= priceRange[1];
    const matchesSearch =
      product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.productShortDescription?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (product.productLongDescription?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      );
    const inSelectedCategories =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    return inPriceRange && matchesSearch && inSelectedCategories;
  });

  // --- Your Pagination Logic (UNCHANGED) ---
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);
  const handleFiltersChange = () => {
    setCurrentPage(1);
  };

  // --- Your Loading and Error States (UNCHANGED) ---
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
      {/* --- New Animated Hero Section from Test File --- */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 text-white pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          ></div>
          <div
            className="absolute w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"
            style={{
              transform: `translateY(${scrollY * -0.2}px)`,
              animationDelay: "1s",
            }}
          ></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZhtD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 5}s`,
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="container mx-auto mb-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/20 shadow-xl animate-fade-in-down hover:bg-white/20 transition-all duration-300 cursor-pointer group"
              style={{ animationDelay: "0.2s" }}
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-semibold tracking-wider uppercase">
                Premium Collection
              </span>
            </div>
            <h1
              className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white animate-gradient">
                Prefabricated
              </span>
              <br />
              <span className="text-blue-200">Modules</span>
            </h1>
            <p
              className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto mb-8 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              Discover our curated selection of high-quality prefabricated
              building modules, meticulously engineered for residential,
              commercial, and industrial excellence.
            </p>
            <div
              className="flex flex-wrap justify-center gap-8 mt-12 animate-fade-in-up"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">
                  {products.length}+
                </div>
                <div className="text-blue-200 text-sm uppercase tracking-wider">
                  Products
                </div>
              </div>
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">
                  {availableCategories.length}
                </div>
                <div className="text-blue-200 text-sm uppercase tracking-wider">
                  Categories
                </div>
              </div>
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">
                  100%
                </div>
                <div className="text-blue-200 text-sm uppercase tracking-wider">
                  Quality
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-18 md:h-24 text-white"
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* --- Main Content Section with animations applied --- */}
      <section className="py-12 bg-white -mt-5">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="animate-fade-in-left">
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
            </div>
            <div className="lg:col-span-3">
              <ProductGrid products={currentProducts} />
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

      {/* --- Custom CSS for animations from Test File --- */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
        }
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </Layout>
  );
};

export default Shop;
