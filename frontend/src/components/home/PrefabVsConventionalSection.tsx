import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Clock,
  DollarSign,
  Zap,
  Wrench,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createPortal } from "react-dom"; // Import createPortal for better modal rendering

const PrefabVsConventionalSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeColumn, setActiveColumn] = useState<
    "prefab" | "conventional" | null
  >(null);
  const [animatedFeatures, setAnimatedFeatures] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  // State for the image modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [modalImageAlt, setModalImageAlt] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Trigger feature animations with staggered delays
          setTimeout(() => {
            for (let i = 0; i < 8; i++) {
              setTimeout(() => {
                setAnimatedFeatures((prev) => [...prev, i]);
              }, i * 200);
            }
          }, 500);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Function to open the image modal
  const openImageModal = (imageUrl: string, imageAlt: string) => {
    setModalImageUrl(imageUrl);
    setModalImageAlt(imageAlt);
    setIsModalOpen(true);
    // Optional: Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden";
  };

  // Function to close the image modal
  const closeImageModal = () => {
    setIsModalOpen(false);
    setModalImageUrl("");
    setModalImageAlt("");
    // Optional: Re-enable body scrolling
    document.body.style.overflow = "";
  };

  const prefabFeatures = [
    {
      text: "Off-site factory construction, modules assembled on-site.",
      highlight: "Off-site factory construction",
      icon: <Zap className="w-5 h-5" />,
      positive: true,
    },
    {
      text: "Quick construction with simultaneous factory and site work, weather-resistant.",
      highlight: "Quick construction",
      icon: <Clock className="w-5 h-5" />,
      positive: true,
    },
    {
      text: "Lower initial costs due to factory efficiency.",
      highlight: "Lower initial costs",
      icon: <DollarSign className="w-5 h-5" />,
      positive: true,
    },
    {
      text: "One time expense",
      highlight: "One time expense",
      icon: <CheckCircle className="w-5 h-5" />,
      positive: true,
    },
  ];

  const conventionalFeatures = [
    {
      text: "Off-site house construction with phase completion.",
      highlight: "Off-site house construction",
      icon: <Wrench className="w-5 h-5" />,
      positive: false,
    },
    {
      text: "Construction time affected by weather, labor, on-site factors; delays possible.",
      highlight: "Construction time affected",
      icon: <AlertCircle className="w-5 h-5" />,
      positive: false,
    },
    {
      text: "Costs vary based on location, materials, labor, design; delays possible.",
      highlight: "Costs vary",
      icon: <DollarSign className="w-5 h-5" />,
      positive: false,
    },
    {
      text: "Continuous expenses for over-all maintenance",
      highlight: "Continuous expenses",
      icon: <AlertCircle className="w-5 h-5" />,
      positive: false,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-800 text-white overflow-hidden"
    >
      {/* Enhanced Animated Background */}
      <div
        className={`absolute inset-0 opacity-15 bg-cover bg-center transition-all duration-1500 ${
          isVisible ? "scale-100" : "scale-110"
        }`}
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
          backgroundBlendMode: "overlay",
        }}
      />

      {/* Elegant geometric overlay */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 border border-blue-400/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border border-green-400/20 rotate-12 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-64 bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"></div>
      </div>

      {/* Enhanced floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-blue-400 rounded-full opacity-40 ${
              isVisible ? "animate-float" : ""
            }`}
            style={{
              left: `${15 + i * 12}%`,
              top: `${25 + (i % 4) * 15}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 max-w-7xl mx-auto px-6">
        {/* Enhanced Header Section */}
        <div
          className={`flex flex-col items-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Badge className="bg-gradient-to-r from-emerald-30000 to-indigo-600 text-white mb-8 px-6 py-2 text-sm font-medium tracking-wider uppercase shadow-lg hover:scale-110 transition-all duration-300 border-0">
            Comparative Analysis
          </Badge>

          {/* Elegant Header with Typography Hierarchy */}
          <div className="text-center space-y-4">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-none">
              <span
                className={`inline-block font-serif italic transition-all duration-700 delay-300 bg-gradient-to-r from-blue-200 to-green-300 bg-clip-text text-transparent ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10"
                }`}
              >
                Prefab Modules
              </span>
              <span
                className={`mx-8 inline-block transition-all duration-700 delay-500 ${
                  isVisible
                    ? "opacity-100 scale-100 rotate-0"
                    : "opacity-0 scale-50 rotate-180"
                }`}
              >
                <span className="text-2xl md:text-3xl font-light text-slate-400 relative">
                  versus
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                </span>
              </span>
              <span
                className={`inline-block font-serif italic transition-all duration-700 delay-700 bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-10"
                }`}
              >
                Conventional
              </span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Enhanced Prefab Column */}
          <div
            className={`flex flex-col transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
            onMouseEnter={() => setActiveColumn("prefab")}
            onMouseLeave={() => setActiveColumn(null)}
          >
            <Card
              className={`bg-gradient-to-br from-emerald-900/20 to-green-800/20 border-emerald-500/20 rounded-2xl mb-10 overflow-hidden transition-all duration-500 backdrop-blur-sm ${
                activeColumn === "prefab"
                  ? "scale-[1.02] shadow-2xl shadow-emerald-500/10 border-emerald-400/40 bg-gradient-to-br from-emerald-900/30 to-green-800/30"
                  : ""
              }`}
            >
              <CardContent className="p-8 h-80 flex flex-col justify-center items-center relative">
                <div className="absolute top-6 right-6 z-10">
                  <Badge className="bg-emerald-500 text-white shadow-lg">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Efficient
                  </Badge>
                </div>

                {/* Enhanced Image Container - Clickable for Modal */}
                <div
                  className="relative w-full h-full flex items-center justify-center group cursor-pointer"
                  onClick={() =>
                    openImageModal(
                      "/photos/Technicaldata/prefab3.jpg",
                      "Modern Prefab Construction"
                    )
                  }
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-emerald-500/5 via-transparent to-green-400/5 rounded-xl transition-all duration-500 ${
                      activeColumn === "prefab"
                        ? "opacity-100 scale-105"
                        : "opacity-0"
                    }`}
                  ></div>

                  <img
                    src="/photos/Technicaldata/prefab3.jpg"
                    alt="Modern Prefab Construction"
                    className={`max-w-full max-h-full object-contain rounded-lg shadow-lg transition-all duration-500 ${
                      activeColumn === "prefab"
                        ? "scale-110 brightness-110 shadow-emerald-500/20"
                        : "scale-100"
                    }`}
                  />

                  {/* Image overlay effects */}
                  <div
                    className={`absolute inset-0 border-2 border-emerald-400/0 rounded-lg transition-all duration-500 ${
                      activeColumn === "prefab" ? "border-emerald-400/30" : ""
                    }`}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-light text-emerald-400 mb-2 tracking-wide">
                  Prefab Construction
                </h3>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent mx-auto"></div>
              </div>

              {prefabFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-start group transition-all duration-500 ${
                    animatedFeatures.includes(index)
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-5"
                  }`}
                >
                  <div
                    className={`bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-xl mr-5 flex-shrink-0 mt-1 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-emerald-500/25`}
                  >
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg leading-relaxed group-hover:text-emerald-300 transition-colors duration-300">
                      <span className="text-emerald-400 font-medium">
                        {feature.highlight}
                      </span>
                      <span className="text-slate-300">
                        {feature.text.replace(feature.highlight, "")}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Conventional Column */}
          <div
            className={`flex flex-col transition-all duration-1000 delay-500 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
            onMouseEnter={() => setActiveColumn("conventional")}
            onMouseLeave={() => setActiveColumn(null)}
          >
            <Card
              className={`bg-gradient-to-br from-orange-900/20 to-amber-800/20 border-orange-500/20 rounded-2xl mb-10 overflow-hidden transition-all duration-500 backdrop-blur-sm ${
                activeColumn === "conventional"
                  ? "scale-[1.02] shadow-2xl shadow-orange-500/10 border-orange-400/40 bg-gradient-to-br from-orange-900/30 to-amber-800/30"
                  : ""
              }`}
            >
              <CardContent className="p-8 h-80 flex flex-col justify-center items-center relative">
                <div className="absolute top-6 right-6 z-10">
                  <Badge variant="destructive" className="shadow-lg">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Complex
                  </Badge>
                </div>

                {/* Enhanced Image Container - Clickable for Modal */}
                <div
                  className="relative w-full h-full flex items-center justify-center group cursor-pointer"
                  onClick={() =>
                    openImageModal(
                      "/photos/Technicaldata/conventional.jpg",
                      "Traditional Conventional Construction"
                    )
                  }
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-orange-500/5 via-transparent to-amber-400/5 rounded-xl transition-all duration-500 ${
                      activeColumn === "conventional"
                        ? "opacity-100 scale-105"
                        : "opacity-0"
                    }`}
                  ></div>

                  <img
                    src="/photos/Technicaldata/conventional.jpg"
                    alt="Traditional Conventional Construction"
                    className={`max-w-full max-h-full object-contain rounded-lg shadow-lg transition-all duration-500 ${
                      activeColumn === "conventional"
                        ? "scale-110 brightness-110 shadow-orange-500/20"
                        : "scale-100 grayscale-[0.2]"
                    }`}
                  />

                  {/* Image overlay effects */}
                  <div
                    className={`absolute inset-0 border-2 border-orange-400/0 rounded-lg transition-all duration-500 ${
                      activeColumn === "conventional"
                        ? "border-orange-400/30"
                        : ""
                    }`}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-light text-orange-400 mb-2 tracking-wide">
                  Conventional Construction
                </h3>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto"></div>
              </div>

              {conventionalFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-start group transition-all duration-500 ${
                    animatedFeatures.includes(index + 4)
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-5"
                  }`}
                >
                  <div
                    className={`bg-gradient-to-br from-orange-500 to-amber-600 p-3 rounded-xl mr-5 flex-shrink-0 mt-1 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-orange-500/25`}
                  >
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg leading-relaxed group-hover:text-orange-300 transition-colors duration-300">
                      <span className="text-orange-400 font-medium">
                        {feature.highlight}
                      </span>
                      <span className="text-slate-300">
                        {feature.text.replace(feature.highlight, "")}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div
          className={`mt-20 text-center transition-all duration-1000 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        ></div>

        {/* Enhanced floating comparison indicator */}
        <div className="fixed bottom-8 left-8 z-50">
          {activeColumn && (
            <div
              className={`px-6 py-3 rounded-full text-white font-medium transition-all duration-300 shadow-lg backdrop-blur-sm ${
                activeColumn === "prefab"
                  ? "bg-emerald-500/90 animate-pulse border border-emerald-400/30"
                  : "bg-orange-500/90 animate-pulse border border-orange-400/30"
              }`}
            >
              {activeColumn === "prefab"
                ? "⚡ Fast & Efficient Solution"
                : "⚠ Traditional Approach"}
            </div>
          )}
        </div>

        {/* Enhanced progress indicator */}
        <div className="absolute top-12 right-12">
          <div className="flex space-x-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  animatedFeatures.includes(i) ||
                  animatedFeatures.includes(i + 4)
                    ? "bg-black-400 scale-125 shadow-lg shadow-black-400/50"
                    : "bg-slate-600/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal (Lightbox) */}
      {isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black bg-opacity-80 flex items-center justify-center p-4"
            onClick={closeImageModal} // Close when clicking outside the image
          >
            <div
              className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeImageModal}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10 p-2 rounded-full bg-gray-700 bg-opacity-70 hover:bg-opacity-90"
                aria-label="Close image"
              >
                <X size={32} />
              </button>
              <img
                src={modalImageUrl}
                alt={modalImageAlt}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-fade-in"
              />
              {modalImageAlt && (
                <p className="mt-4 text-white text-center text-lg bg-gray-800 bg-opacity-70 px-4 py-2 rounded-md">
                  {modalImageAlt}
                </p>
              )}
            </div>
          </div>,
          document.body // Portal the modal to the body for proper z-indexing
        )}

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(5deg);
          }
          50% {
            transform: translateY(-5px) rotate(-5deg);
          }
          75% {
            transform: translateY(-15px) rotate(3deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default PrefabVsConventionalSection;
