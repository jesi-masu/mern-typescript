import { Button } from "@/components/ui/button";
import { Target, Home, Building2, Factory } from "lucide-react";

interface CategoryFiltersProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

const categories = [
  { name: "Residential", icon: <Home className="h-4 w-4" /> },
  { name: "Commercial", icon: <Building2 className="h-4 w-4" /> },
  { name: "Industrial", icon: <Factory className="h-4 w-4" /> },
];

const CategoryFilters = ({
  selectedCategory,
  setSelectedCategory,
}: CategoryFiltersProps) => {
  const getButtonClass = (isActive: boolean) =>
    `flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-medium transition-all duration-300 ${
      isActive
        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg scale-105"
        : "border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-700 hover:scale-105 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-600 dark:hover:text-blue-400 dark:hover:bg-gray-700/20"
    }`;

  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12 animate-fade-in-up">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => setSelectedCategory(null)}
        className={getButtonClass(selectedCategory === null)}
      >
        <Target className="h-4 w-4" />
        All Projects
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.name}
          variant={selectedCategory === cat.name ? "default" : "outline"}
          onClick={() => setSelectedCategory(cat.name)}
          className={getButtonClass(selectedCategory === cat.name)}
        >
          {cat.icon}
          {cat.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilters;
