import { Home, Building2, Factory } from "lucide-react";

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Residential":
      return <Home className="h-4 w-4" />;
    case "Commercial":
      return <Building2 className="h-4 w-4" />;
    case "Industrial":
      return <Factory className="h-4 w-4" />;
    default:
      return <Building2 className="h-4 w-4" />;
  }
};

export const getCategoryColor = (category: string) => {
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
