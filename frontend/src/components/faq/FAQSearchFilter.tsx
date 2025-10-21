import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, HelpCircle } from "lucide-react";

interface FAQCategory {
  category: string;
  icon: React.ElementType;
  color: string;
}

interface FAQSearchFilterProps {
  searchQuery: string;
  activeCategory: string;
  faqData: FAQCategory[];
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
}

export const FAQSearchFilter: React.FC<FAQSearchFilterProps> = ({
  searchQuery,
  activeCategory,
  faqData,
  onSearchChange,
  onCategoryChange,
}) => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-prefab-300/20 to-prefab-400/20 rounded-2xl blur-xl" />
            <div className="relative bg-white rounded-2xl border border-gray-200/50 shadow-xl backdrop-blur-sm">
              <div className="flex items-center p-2">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-prefab-300 to-prefab-400 rounded-xl ml-2">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <Input
                  type="text"
                  placeholder="Search for questions, keywords, or topics..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="border-0 text-lg bg-transparent focus:ring-0 focus:outline-none placeholder:text-gray-400 flex-grow" // Added flex-grow
                />
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Button
              variant={activeCategory === "all" ? "default" : "outline"}
              className={`group relative overflow-hidden transition-all duration-300 ${
                activeCategory === "all"
                  ? "bg-gradient-to-r from-prefab-400 to-prefab-500 text-white shadow-lg hover:shadow-xl border-0"
                  : "bg-white border-gray-200 hover:border-prefab-300 hover:bg-prefab-50"
              }`}
              onClick={() => onCategoryChange("all")}
            >
              <div className="relative z-10 flex items-center">
                <HelpCircle className="w-4 h-4 mr-2" />
                All Categories
              </div>
            </Button>

            {faqData.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={index}
                  variant={
                    activeCategory === category.category ? "default" : "outline"
                  }
                  className={`group relative overflow-hidden transition-all duration-300 ${
                    activeCategory === category.category
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg hover:shadow-xl border-0`
                      : "bg-white border-gray-200 hover:border-prefab-300 hover:bg-prefab-50"
                  }`}
                  onClick={() => onCategoryChange(category.category)}
                >
                  <div className="relative z-10 flex items-center">
                    <IconComponent className="w-4 h-4 mr-2" />
                    {category.category}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
