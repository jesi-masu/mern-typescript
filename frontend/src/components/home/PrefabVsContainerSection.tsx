import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PrefabVsContainerSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeComparison, setActiveComparison] = useState<
    "prefab" | "container" | null
  >(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const prefabFeatures = [
    {
      text: "Higher level of customization, flexibility and durability to your MODULAR HOMES",
      highlight: "Higher level of customization",
      positive: true,
    },
    {
      text: "Built with more energy-efficient materials and designed to be better insulated and sealed",
      highlight: "Built with more energy-efficient materials",
      positive: true,
    },
    {
      text: "PREFAB MODULAR HOME, a SMART choice for your home",
      highlight: "PREFAB MODULAR HOME",
      positive: true,
    },
    {
      text: "Ready-made for residential use with proper ventilation and insulation",
      highlight: "Ready-made for residential use",
      positive: true,
    },
  ];

  const containerFeatures = [
    {
      text: "Not intrinsically designed to be a house, requiring significant modifications",
      highlight: "Not intrinsically designed to be a house",
      positive: false,
    },
    {
      text: "All made of steel; Need to use acetylene to modify CONTAINER VAN",
      highlight: "All made of steel",
      positive: false,
    },
    {
      text: "Require expensive modifications on-site to be efficient and habitable",
      highlight: "Require expensive modifications on-site",
      positive: false,
    },
    {
      text: "Poor natural insulation leading to higher energy costs for heating and cooling",
      highlight: "Poor natural insulation",
      positive: false,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        <div
          className={`flex flex-col items-center mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Badge className="bg-gradient-to-r from-emerald-30000 to-indigo-600 text-white mb-8 px-6 py-2 text-sm font-medium tracking-wider uppercase shadow-lg hover:scale-110 transition-all duration-300 border-0">
            Comparative Analysis
          </Badge>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-none">
            <span
              className={`inline-block font-serif italic transition-all duration-700 delay-300 bg-gradient-to-r from-blue-200 to-green-300 bg-clip-text text-transparent ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              Prefabricated
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
              Container Van
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left column - Prefabricated Units */}
          <div
            className={`space-y-8 transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
            onMouseEnter={() => setActiveComparison("prefab")}
            onMouseLeave={() => setActiveComparison(null)}
          >
            <div
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/20 p-6 transition-all duration-500 ${
                activeComparison === "prefab"
                  ? "scale-105 shadow-2xl shadow-green-500/20"
                  : ""
              }`}
            >
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <img
                    src="/photos/container001.png"
                    alt="Prefabricated Unit"
                    className={`max-h-64 object-contain transition-all duration-500 ${
                      activeComparison === "prefab" ? "scale-110" : ""
                    }`}
                  />
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Recommended
                    </Badge>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-center mb-6 text-green-400">
                PREFABRICATED UNITS
              </h3>

              <div className="space-y-4">
                {prefabFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-start group transition-all duration-500 delay-${
                      index * 100
                    } ${
                      isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-5"
                    }`}
                  >
                    <span className="bg-green-500 p-2 rounded-full mr-4 flex-shrink-0 mt-1 transition-all duration-300 group-hover:scale-110">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </span>
                    <p className="text-lg group-hover:text-green-300 transition-colors duration-300">
                      <span className="text-green-400 font-semibold">
                        {feature.highlight}
                      </span>
                      {feature.text.replace(feature.highlight, "")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Container Van */}
          <div
            className={`space-y-8 transition-all duration-1000 delay-500 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
            onMouseEnter={() => setActiveComparison("container")}
            onMouseLeave={() => setActiveComparison(null)}
          >
            <div
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/20 p-6 transition-all duration-500 ${
                activeComparison === "container"
                  ? "scale-105 shadow-2xl shadow-red-500/20"
                  : ""
              }`}
            >
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <img
                    src="/photos/containervan.png"
                    alt="Container Van"
                    className={`max-h-64 object-contain transition-all duration-500 grayscale ${
                      activeComparison === "container"
                        ? "scale-110 grayscale-0"
                        : ""
                    }`}
                  />
                  <div className="absolute -top-2 -right-2">
                    <Badge variant="destructive">
                      <XCircle className="w-4 h-4 mr-1" />
                      Limitations
                    </Badge>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-center mb-6 text-red-400">
                CONTAINER VAN
              </h3>

              <div className="space-y-4">
                {containerFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-start group transition-all duration-500 delay-${
                      index * 100 + 200
                    } ${
                      isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-5"
                    }`}
                  >
                    <span className="bg-red-500 p-2 rounded-full mr-4 flex-shrink-0 mt-1 transition-all duration-300 group-hover:scale-110">
                      <XCircle className="w-4 h-4 text-white" />
                    </span>
                    <p className="text-lg group-hover:text-red-300 transition-colors duration-300">
                      <span className="text-red-400 font-semibold">
                        {feature.highlight}
                      </span>
                      {feature.text.replace(feature.highlight, "")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`mt-12 text-center transition-all duration-1000 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Button
            size="lg"
            className="bg-gray-400 text-black hover:bg-sky-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-sky-500/25"
          >
            <Link to="/Shop" className="flex items-center">
              Browse Our Products
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Floating comparison indicator */}
        <div className="fixed bottom-8 right-8 z-50">
          {activeComparison && (
            <div
              className={`px-4 py-2 rounded-full text-white font-medium transition-all duration-300 ${
                activeComparison === "prefab"
                  ? "bg-green-500 animate-pulse"
                  : "bg-red-500 animate-pulse"
              }`}
            >
              {activeComparison === "prefab"
                ? "✓ Better Choice"
                : "⚠ Consider Alternatives"}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PrefabVsContainerSection;
