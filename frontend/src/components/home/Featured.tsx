import { useState, useEffect } from "react";
import { Home, Building2, Users, Store, Briefcase, Wrench, ChevronLeft, ChevronRight } from "lucide-react";

const PrefabContainerSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const applications = [
    {
      id: 1,
      title: "Homes & Living",
      subtitle: "Sustainable Living Spaces",
      description: "Contemporary container homes with full amenities, eco-friendly materials, and customizable layouts for modern families.",
      icon: Home,
      features: ["Eco-friendly materials", "Quick installation", "Customizable layouts", "Energy efficient"],
      gradient: "from-blue-500 to-cyan-400",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      images: [
        "https://prefabdavao.com/wp-content/uploads/2024/10/m2.webp",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 2,
      title: "Professional Offices",
      subtitle: "Flexible Workspace Solutions",
      description: "Modern office containers for startups, remote teams, and expanding businesses with professional interiors and full connectivity.",
      icon: Building2,
      features: ["Modern interiors", "Climate control", "High-speed connectivity", "Scalable design"],
      gradient: "from-emerald-500 to-teal-400",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      images: [
        "https://camcoprefabricatedstructures.com/wp-content/uploads/2025/02/1719035864076-scaled.webp",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 3,
      title: "Comfortable Bunkhouses",
      subtitle: "Temporary Housing Solutions",
      description: "Worker accommodations for construction sites and camps with privacy partitions, shared facilities, and durable construction.",
      icon: Users,
      features: ["Multiple occupancy", "Privacy partitions", "Shared facilities", "Durable construction"],
      gradient: "from-orange-500 to-amber-400",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      images: [
        "https://camcoprefabricatedstructures.com/wp-content/uploads/2025/02/1690946425830.webp",
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 4,
      title: "Commercial Spaces",
      subtitle: "Retail & Service Centers",
      description: "Professional retail outlets and showrooms with attractive facades, display areas, and full brand customization options.",
      icon: Store,
      features: ["Attractive facades", "Display areas", "Customer-friendly", "Brand customization"],
      gradient: "from-purple-500 to-pink-400",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      images: [
        "https://camcoprefabricatedstructures.com/wp-content/uploads/2025/02/Crispy-King-scaled.webp",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 5,
      title: "Small Business Space",
      subtitle: "Startup-Ready Spaces",
      description: "Cost-effective business spaces for entrepreneurs with professional appearance, flexible terms, and growth-ready infrastructure.",
      icon: Briefcase,
      features: ["Affordable setup", "Professional image", "Flexible terms", "Growth-ready"],
      gradient: "from-indigo-500 to-blue-400",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      images: [
        "https://camcoprefabricatedstructures.com/wp-content/uploads/2025/02/22.webp",
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 6,
      title: "Portable Toilets",
      subtitle: "Utility & Sanitary Buildings",
      description: "Self-contained facilities for events, construction sites, and remote locations with easy transport and quick setup capabilities.",
      icon: Wrench,
      features: ["Easy transport", "Quick setup", "Self-contained", "Maintenance-friendly"],
      gradient: "from-gray-600 to-slate-400",
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600",
      images: [
        "https://i.pinimg.com/736x/03/49/3a/03493a3fed74956909167270d16659fc.jpg",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop"
      ]
    }
  ];

  // Auto-play functionality for main carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % applications.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, applications.length]);

  // Auto-play functionality for image carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Reset image index when slide changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % applications.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + applications.length) % applications.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % 4);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + 4) % 4);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const currentApp = applications[currentSlide];
  const IconComponent = currentApp.icon;

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-100/30 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100/50 backdrop-blur-sm px-4 py-2 rounded-full text-blue-700 font-medium mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Perfect Solutions
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Prefabricated container is
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-800 bg-clip-text text-transparent">
              perfect for:
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover versatile, sustainable, and cost-effective solutions for your space needs. 
            Our prefabricated containers adapt to any requirement with premium quality and modern design.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Main Carousel */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
              {/* Enhanced Image Section with Multiple Images */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent z-30"></div>
                
                {/* Image Carousel */}
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out" 
                       style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                    {currentApp.images.map((image, index) => (
                      <img 
                        key={index}
                        src={image} 
                        alt={`${currentApp.title} ${index + 1}`}
                        className="w-full h-full object-cover flex-shrink-0"
                      />
                    ))}
                  </div>
                  
                  {/* Image Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 flex items-center justify-center z-40"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 flex items-center justify-center z-40"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
                
                {/* Image Overlay Content */}
                <div className="absolute top-6 left-6 z-40">
                  <div className={`w-12 h-12 ${currentApp.bgColor} rounded-xl flex items-center justify-center backdrop-blur-sm`}>
                    <IconComponent className={`w-6 h-6 ${currentApp.iconColor}`} />
                  </div>
                </div>
                
                {/* Image Indicators */}
                <div className="absolute bottom-16 left-6 right-6 z-40">
                  <div className="flex justify-center gap-2 mb-4">
                    {currentApp.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-white scale-125' 
                            : 'bg-white/50 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className={`w-16 h-1 bg-gradient-to-r ${currentApp.gradient} rounded-full mb-3`}></div>
                  <h3 className="text-white font-bold text-lg">{currentApp.subtitle}</h3>
                  <p className="text-white/80 text-sm mt-1">
                    Image {currentImageIndex + 1} of {currentApp.images.length}
                  </p>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <h3 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2">
                      {currentApp.title}
                    </h3>
                    <p className={`text-lg font-semibold bg-gradient-to-r ${currentApp.gradient} bg-clip-text text-transparent`}>
                      {currentApp.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {currentApp.description}
                  </p>

                  {/* Features Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentApp.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-gray-50/50 rounded-xl p-3">
                        <div className={`w-2 h-2 bg-gradient-to-r ${currentApp.gradient} rounded-full flex-shrink-0`}></div>
                        <span className="text-gray-700 font-medium text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button className={`bg-gradient-to-r ${currentApp.gradient} text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105`}>
                      Learn More
                    </button>
                    <button className="bg-white/80 text-gray-800 font-semibold py-3 px-6 rounded-xl border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300">
                      Get Quote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-gray-900" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-gray-900" />
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-3 mt-8">
          {applications.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? `bg-gradient-to-r ${currentApp.gradient} scale-125 shadow-lg` 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Enhanced Thumbnail Navigation with Multiple Images */}
        <div className="mt-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {applications.map((app, index) => {
              const ThumbnailIcon = app.icon;
              return (
                <button
                  key={app.id}
                  onClick={() => goToSlide(index)}
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                    index === currentSlide 
                      ? 'ring-2 ring-blue-500 scale-105 shadow-xl' 
                      : 'hover:scale-105 hover:shadow-lg'
                  }`}
                >
                  <div className="aspect-[4/3] relative">
                    <img 
                      src={app.images[0]} 
                      alt={app.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 flex flex-col justify-between p-3">
                      <div className="flex justify-between items-start">
                        <div className={`w-8 h-8 ${app.bgColor} rounded-lg flex items-center justify-center`}>
                          <ThumbnailIcon className={`w-4 h-4 ${app.iconColor}`} />
                        </div>
                        <div className="flex gap-1">
                          {app.images.map((_, imgIndex) => (
                            <div 
                              key={imgIndex}
                              className={`w-1 h-1 rounded-full ${
                                imgIndex === 0 ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm leading-tight">{app.title}</h4>
                        <p className="text-white/80 text-xs">{app.subtitle}</p>
                        <p className="text-white/60 text-xs mt-1">{app.images.length} images</p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Space?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Get started with our premium prefabricated container solutions. 
              Custom designs, professional installation, and ongoing support included.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-4 px-8 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
                Get Free Quote
              </button>
              <button className="bg-white/80 text-gray-800 font-semibold py-4 px-8 rounded-2xl border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300">
                View Gallery
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrefabContainerSection;