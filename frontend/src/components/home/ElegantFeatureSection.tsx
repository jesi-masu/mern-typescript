// src/components/ElegantFeaturesSection.tsx (or wherever your component is located)
import { useState } from 'react';
import { Home, Hammer, Building, Palette, ShowerHead, Info } from 'lucide-react';
import Lightbox from './Lightbox'; // Import the Lightbox component

const features = [
  {
    name: 'Prefab Container',
    description: 'Premium modular container units engineered for versatility and durability in any environment.',
    icon: Home,
    color: 'blue'
  },
  {
    name: 'Advanced Materials',
    description: 'High-grade steel framework with eco-friendly insulation and weather-resistant composite panels.',
    icon: Hammer,
    color: 'emerald'
  },
  {
    name: 'Prefab Camhouse',
    description: 'Modern customizable living spaces designed for comfort, style, and energy efficiency.',
    icon: Building,
    color: 'purple'
  },
  {
    name: 'Premium Finishes',
    description: 'Hand-crafted details with sustainable materials and precision-engineered components.',
    icon: Palette,
    color: 'orange'
  },
  {
    name: 'Portable Facilities',
    description: 'Complete sanitation solutions with modern amenities and easy installation.',
    icon: ShowerHead,
    color: 'teal'
  },
  {
    name: 'Quality Assurance',
    description: 'Each unit undergoes rigorous testing to ensure structural integrity and longevity.',
    icon: Info,
    color: 'rose'
  },
];

const colorClasses = {
  blue: {
    icon: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    hover: 'hover:border-blue-400 hover:shadow-blue-100'
  },
  emerald: {
    icon: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    hover: 'hover:border-emerald-400 hover:shadow-emerald-100'
  },
  purple: {
    icon: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    hover: 'hover:border-purple-400 hover:shadow-purple-100'
  },
  orange: {
    icon: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    hover: 'hover:border-orange-400 hover:shadow-orange-100'
  },
  teal: {
    icon: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    hover: 'hover:border-teal-400 hover:shadow-teal-100'
  },
  rose: {
    icon: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    hover: 'hover:border-rose-400 hover:shadow-rose-100'
  }
};

export default function ElegantFeaturesSection() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State for lightbox image

  const openLightbox = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const images = [
    {
      src: "https://camcoprefabricatedstructures.com/wp-content/uploads/2024/10/Mask-group-3.png",
      alt: "Premium prefab container unit with modern design",
      h: 'h-64'
    },
    {
      src: "https://camcoprefabricatedstructures.com/wp-content/uploads/2025/03/Mask-group-34.png",
      alt: "Interior view of customizable prefab structure",
      h: 'h-80'
    },
    {
      src: "https://camcoprefabricatedstructures.com/wp-content/uploads/2025/02/Mask-group-4-1.png",
      alt: "Advanced materials and construction details",
      h: 'h-80'
    },
    {
      src: "https://camcoprefabricatedstructures.com/wp-content/uploads/2024/10/Mask-group-27.png",
      alt: "Complete prefab solution with premium finishes",
      h: 'h-64'
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.1),transparent_50%)]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-x-12 gap-y-16 lg:grid-cols-2">
          {/* Content Section */}
          <div className="lg:sticky lg:top-24">
            <div className="mb-8">
              <span className="inline-block mb-4 text-sm font-semibold tracking-wider uppercase bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Engineering Excellence
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent leading-tight">
                Camco Prefab
                <span className="block text-3xl md:text-4xl mt-2 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  Technical Excellence
                </span>
              </h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 leading-relaxed">
                Engineered for excellence, our premium prefab products offer
                <span className="font-semibold text-gray-800"> fast, reliable construction</span> with
                <span className="font-semibold text-gray-800"> superior durability</span> and
                <span className="font-semibold text-gray-800"> design flexibility</span>—perfect for residential, commercial, or industrial use.
              </p>
              <p className="text-lg text-gray-500 mt-4">
                Every structure ensures quality, efficiency, and long-term value in every build,
                backed by cutting-edge technology and sustainable practices.
              </p>
            </div>

            {/* Features Grid */}
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const colors = colorClasses[feature.color];

                return (
                  <div
                    key={feature.name}
                    className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-xl ${colors.bg} ${colors.border} ${colors.hover}`}
                    onMouseEnter={() => setHoveredFeature(index)}
                    onMouseLeave={() => setHoveredFeature(null)}
                    style={{
                      animationDelay: `${index * 150}ms`
                    }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 p-3 rounded-xl ${colors.bg} border ${colors.border} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 ${colors.icon}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-800">
                          {feature.name}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700">
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Images Section */}
          <div className="lg:sticky lg:top-24">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 sm:space-y-6">
                {images.slice(0, 2).map((image, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                    onClick={() => openLightbox(image.src)} // Added onClick handler
                  >
                    <img
                      alt={image.alt}
                      src={image.src}
                      className={`${image.h} w-full object-cover group-hover:scale-110 transition-transform duration-700`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 sm:space-y-6 pt-8">
                {images.slice(2, 4).map((image, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                    onClick={() => openLightbox(image.src)} // Added onClick handler
                  >
                    <img
                      alt={image.alt}
                      src={image.src}
                      className={`${image.h} w-full object-cover group-hover:scale-110 transition-transform duration-700`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Component */}
      <Lightbox imageUrl={selectedImage} onClose={closeLightbox} />
    </div>
  );
}