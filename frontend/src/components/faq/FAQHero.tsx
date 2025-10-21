import React, { useState, useEffect } from "react";
import { HelpCircle, ArrowRight } from "lucide-react";

interface FAQCategory {
  category: string;
  questions: { id: string; question: string; answer: string }[];
}

interface FAQHeroProps {
  faqData: FAQCategory[];
}

export const FAQHero: React.FC<FAQHeroProps> = ({ faqData }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalQuestions = faqData.reduce(
    (acc, cat) => acc + cat.questions.length,
    0
  );
  const totalCategories = faqData.length;

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white pt-16 pb-24 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        ></div>
        <div
          className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"
          style={{
            transform: `translateY(${scrollY * -0.2}px)`,
            animationDelay: "1s",
          }}
        ></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mb-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/20 shadow-xl animate-fade-in-down hover:bg-white/20 transition-all duration-300 cursor-pointer group"
            style={{ animationDelay: "0.2s" }}
          >
            <HelpCircle className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              Help Center
            </span>
          </div>
          <h1
            className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white animate-gradient">
              Frequently Asked
            </span>
            <br />
            <span className="text-blue-300">Questions</span>
          </h1>
          <p
            className="text-xl md:text-2xl text-gray-100 leading-relaxed max-w-3xl mx-auto mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            Find comprehensive answers to common questions about our
            prefabricated solutions, design process, installation, and services.
          </p>
          <div
            className="flex flex-wrap justify-center gap-8 mt-12 animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">
                {totalQuestions}+
              </div>
              <div className="text-blue-300 text-sm uppercase tracking-wider">
                Questions Answered
              </div>
            </div>
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">
                {totalCategories}
              </div>
              <div className="text-blue-300 text-sm uppercase tracking-wider">
                Categories
              </div>
            </div>
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">
                24/7
              </div>
              <div className="text-blue-300 text-sm uppercase tracking-wider">
                Support Available
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- ADDED SVG WAVE DIV --- */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 md:h-24 text-gray-50 dark:text-gray-900" // Adjust color if needed
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="currentColor"
          />
        </svg>
      </div>
      {/* --- END OF ADDED DIV --- */}
    </section>
  );
};
