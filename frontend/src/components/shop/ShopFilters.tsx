// frontend/src/components/shop/ShopFilters.tsx
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPrice } from "@/lib/formatters";

interface ShopFiltersProps {
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (value: string[]) => void;
  categories: string[];
}

const ShopFilters = ({
  priceRange,
  setPriceRange,
  searchQuery,
  setSearchQuery,
  selectedCategories,
  setSelectedCategories,
  categories,
}: ShopFiltersProps) => {
  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Define new min and max values for the slider in PHP
  const minPrice = 50000;
  const maxPrice = 2000000;

  return (
    <div className="lg:col-span-1">
      <div className="bg-white p-4 rounded-lg shadow-sm sticky top-24">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-700" /> Filters
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        {/* Price Range */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">
            Price Range: {formatPrice(priceRange[0])} -{" "}
            {formatPrice(priceRange[1])}
          </label>
          <Slider
            defaultValue={[minPrice, maxPrice]}
            min={minPrice}
            max={maxPrice}
            step={50000}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mt-2"
          />
        </div>
        {/* Categories */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Categories</label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryChange(category)}
                />
                <label
                  htmlFor={`category-${category}`}
                  className="text-sm text-gray-700 ml-2 cursor-pointer"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
        {/* Clear Filters */}
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => {
            setPriceRange([minPrice, maxPrice]);
            setSearchQuery("");
            setSelectedCategories([]);
          }}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default ShopFilters;
