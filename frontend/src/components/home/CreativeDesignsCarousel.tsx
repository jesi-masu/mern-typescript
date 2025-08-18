import React, { useState, useEffect } from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Briefcase, Factory } from "lucide-react";

// Define the animation styles
const animationStyles = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(24px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out forwards;
  }
`;

// Inject styles into document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = animationStyles;
  document.head.appendChild(styleSheet);
}

const designExamples = [
  {
    id: 1,
    title: "Modern Prefab Home",
    description: "Clean lines and open spaces define our modern prefab homes, perfect for contemporary living.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Residential",
    features: ["Energy Efficient", "Smart Home Ready", "Sustainable Materials"]
  },
  {
    id: 2,
    title: "Corporate Office Complex",
    description: "Efficient workspaces designed for productivity and comfort in a minimalist aesthetic.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Commercial",
    features: ["Flexible Layout", "Natural Lighting", "Modern Infrastructure"]
  },
  {
    id: 3,
    title: "Manufacturing Facility",
    description: "Robust industrial structures engineered for heavy-duty operations and maximum efficiency.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Industrial",
    features: ["Heavy-Duty Design", "Safety Compliant", "Scalable Operations"]
  },
  {
    id: 4,
    title: "Luxury Container Home",
    description: "Transform shipping containers into luxurious living spaces with premium finishes.",
    image: "https://images.unsplash.com/photo-1632829882891-5047ccc421bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Residential",
    features: ["Custom Design", "High-End Finishes", "Rapid Construction"]
  },
  {
    id: 5,
    title: "Retail Shopping Center",
    description: "Modern commercial spaces designed to enhance customer experience and business operations.",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Commercial",
    features: ["Customer-Centric", "High Traffic Design", "Retail Optimization"]
  }
];

const CreativeDesignsCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [isVisible, setIsVisible] = useState(false);
  
  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('creative-designs-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);
  
  // Update current slide when carousel changes
  useEffect(() => {
    if (!api) {
      return;
    }
 
    const onChange = () => {
      setActiveSlide(api.selectedScrollSnap());
    };
 
    api.on("select", onChange);
    return () => {
      api.off("select", onChange);
    };
  }, [api]);

  // Auto-advance carousel
  useEffect(() => {
    if (!api) return;
    
    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [api]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Residential':
        return <Building2 className="w-4 h-4" />;
      case 'Commercial':
        return <Briefcase className="w-4 h-4" />;
      case 'Industrial':
        return <Factory className="w-4 h-4" />;
      default:
        return <Building2 className="w-4 h-4" />;
    }
  };

  return (
    <section 
      id="creative-designs-section"
      className="py-20 bg-slate-50 relative overflow-hidden"
    >
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(15 23 42) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>

      {/* Modern geometric elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-slate-200/40 to-slate-300/40 rounded-full blur-3xl transition-all duration-[2000ms] ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'
        }`}></div>
        <div className={`absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-slate-200/30 to-slate-400/30 rounded-full blur-3xl transition-all duration-[2500ms] delay-500 ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-24 opacity-0'
        }`}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium mb-6 transition-all duration-700 delay-200">
            <Building2 className="w-4 h-4 mr-2" />
            Featured Projects
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Innovative Design
            <span className="block bg-gradient-to-r from-slate-700 via-slate-900 to-slate-700 bg-clip-text text-transparent">
              Concepts
            </span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Explore our comprehensive portfolio of cutting-edge prefabricated construction solutions, 
            spanning residential, commercial, and industrial applications.
          </p>
        </div>
        
        {/* Carousel Section */}
        <div className={`relative max-w-7xl mx-auto transition-all duration-1200 delay-400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}>
          <Carousel 
            className="w-full"
            setApi={setApi}
          >
            <CarouselContent className="-ml-4">
              {designExamples.map((design, index) => (
                <CarouselItem key={design.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className={`group h-full border-0 bg-white shadow-sm hover:shadow-xl transition-all duration-700 overflow-hidden hover:-translate-y-1 ${
                    isVisible ? 'animate-fade-in-up' : 'opacity-0'
                  }`} 
                  style={{ animationDelay: `${index * 200}ms` }}>
                    <CardContent className="p-0 h-full flex flex-col">
                      {/* Image Container */}
                      <div className="relative overflow-hidden bg-slate-100">
                        <img 
                          src={design.image} 
                          alt={design.title} 
                          className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-105"
                        />
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold">
                            {getCategoryIcon(design.category)}
                            <span className="ml-1">{design.category}</span>
                          </div>
                        </div>

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      
                      {/* Content Container */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors duration-300">
                          {design.title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">
                          {design.description}
                        </p>
                        
                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {design.features.slice(0, 2).map((feature, i) => (
                            <span 
                              key={i}
                              className="inline-block px-2 py-1 text-xs font-medium text-slate-600 bg-slate-50 rounded-md"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                        
                        {/* CTA Button */}
                        <Button 
                          variant="outline"
                          className="w-full border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 group/btn"
                          onClick={() => window.location.href = '/projects'}
                        >
                          <span className="flex items-center justify-center">
                            View Project Details
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                          </span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation */}
            <CarouselPrevious className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white border-slate-200 shadow-lg hover:bg-slate-50 hover:scale-110 transition-all duration-300 w-12 h-12" />
            <CarouselNext className="absolute -right-6 top-1/2 -translate-y-1/2 bg-white border-slate-200 shadow-lg hover:bg-slate-50 hover:scale-110 transition-all duration-300 w-12 h-12" />
          </Carousel>
          
          {/* Enhanced pagination */}
          <div className="flex justify-center items-center mt-12 space-x-3">
            {designExamples.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`relative transition-all duration-500 ${
                  activeSlide === index 
                    ? "w-10 h-2 bg-slate-900 rounded-full" 
                    : "w-2 h-2 bg-slate-300 rounded-full hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                {activeSlide === index && (
                  <div className="absolute inset-0 bg-slate-900 rounded-full">
                    <div className="absolute inset-0 bg-slate-900 rounded-full animate-pulse opacity-50"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-800 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <Button 
            size="lg"
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
            onClick={() => window.location.href = '/projects'}
          >
            <span className="flex items-center">
              Explore Projects
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Button>
          <p className="text-sm text-slate-500 mt-4">
            Discover our full range of architectural solutions and design capabilities
          </p>
        </div>
      </div>


    </section>
  );
};

export default CreativeDesignsCarousel;