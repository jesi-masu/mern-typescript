
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  squareFeet: number;
  image: string;
  description: string;
  longDescription?: string;
  features?: string[];
  specifications?: Record<string, string>;
  inclusion?: string[];
  leadTime?: string;
  images?: string[];
  modelUrl?: string;
}

// Mock products data
export const products: Product[] = [
  {
    id: 1,
    name: "Modern Studio Module",
    price: 39999,
    category: "Residential",
    squareFeet: 400,
    image: "https://camcoprefabricatedstructures.com/wp-content/uploads/2025/02/Mask-group-26.png",
    description: "Perfect for a backyard office or guest house. Includes bathroom, kitchenette, and living space.",
    longDescription: "This modern studio module is designed with flexibility in mind. At 400 square feet, it's perfect for a backyard office, guest house, or rental unit. The module includes a full bathroom, kitchenette, and versatile living space that can be configured to your needs. High ceilings and large windows create an airy, open feeling despite the compact footprint.",
    features: ["Full bathroom", "Modern kitchenette", "Energy-efficient design", "Pre-wired for internet", "Customizable interior layout", "Quick installation"],
    specifications: {
      dimensions: "20ft × 20ft",
      height: "9ft ceiling height",
      foundation: "Concrete pier or slab",
      structure: "Steel frame with insulated panels",
      roof: "Standing seam metal roof",
      windows: "Double-pane energy efficient", 
      electrical: "100 amp service",
      plumbing: "Full hookups required"
    },
    inclusion: ["Free shipping within 100 miles", "Foundation preparation guide", "All necessary permits documentation", "Installation manual", "5-year structural warranty"],
    leadTime: "4-6 weeks",
    images: [
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: 2,
    name: "Family Home Base Module",
    price: 89999,
    category: "Residential",
    squareFeet: 1200,
    image: "https://camcoprefabricatedstructures.com/wp-content/uploads/2025/02/22.webp",
    description: "A spacious 3-bedroom family home with open concept living areas and modern finishes.",
    longDescription: "This family home base module offers 1,200 square feet of thoughtfully designed living space. With 3 bedrooms, 2 bathrooms, and open concept living areas, it's perfect for families. The modern design features high ceilings, large windows for natural light, and premium finishes throughout. The floor plan is optimized for comfortable family living while maintaining energy efficiency.",
    features: ["3 bedrooms", "2 bathrooms", "Open concept kitchen and living area", "Energy-efficient appliances", "Ample storage", "Modern finishes", "Customizable exterior"],
    specifications: {
      dimensions: "40ft × 30ft",
      height: "9ft ceiling height",
      foundation: "Concrete slab required",
      structure: "Steel frame with insulated panels",
      roof: "Standing seam metal roof",
      windows: "Triple-pane energy efficient", 
      electrical: "200 amp service",
      plumbing: "Full hookups required"
    },
    inclusion: ["Free shipping within 100 miles", "Foundation preparation guide", "All necessary permits documentation", "Installation coordination", "10-year structural warranty"],
    leadTime: "8-10 weeks",
    images: [
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", 
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: 3,
    name: "Commercial Office Pod",
    price: 45999,
    category: "Commercial",
    squareFeet: 600,
    image: "https://camcoprefabricatedstructures.com/wp-content/uploads/2025/02/1700707774461.webp",
    description: "Open workspace for up to 8 employees. Modern design with plenty of natural light.",
    leadTime: "6-8 weeks",
    images: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: 4,
    name: "Starter Home Module",
    price: 59999,
    category: "Residential",
    squareFeet: 800,
    image: "https://camcoprefabricatedstructures.com/wp-content/uploads/2025/02/1719035864073-scaled.webp",
    description: "Perfect starter home for couples or small families. 2 bedrooms, 1 bathroom with modern amenities.",
    leadTime: "5-7 weeks",
    images: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: 5,
    name: "Retail Store Module",
    price: 79999,
    category: "Commercial",
    squareFeet: 1000,
    image: "https://camcoprefabricatedstructures.com/wp-content/uploads/2025/02/20231223_142438.webp",
    description: "Ready-to-use retail space with storefront, display areas, storage room and employee facilities.",
    leadTime: "8-12 weeks",
    images: [
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: 6,
    name: "Tiny Home Module",
    price: 29999,
    category: "Residential",
    squareFeet: 250,
    image: "https://camcoprefabricatedstructures.com/wp-content/uploads/2025/02/Duplex-Residential-2.webp",
    description: "Compact living solution with ingenious space-saving features. Perfect for minimalist lifestyles.",
    leadTime: "3-5 weeks",
    images: [
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    ]
  }
];

export const categories = ["Residential", "Commercial", "Industrial"];
