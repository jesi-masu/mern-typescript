// frontend/src/components/shop/ProductGrid.tsx

import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product"; // Assuming this is your correct type path

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="lg:col-span-3">
      {products.length > 0 ? (
        // AnimatePresence is used to detect when items are removed from the grid
        // The `layout` prop on motion.div animates the grid shuffle
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {products.map((product) => (
              // The key MUST be unique and stable, `product._id` is perfect
              <ProductCard key={product._id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-gray-600">
            Try adjusting your filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
